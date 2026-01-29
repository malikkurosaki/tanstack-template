import { auth } from "@/lib/auth";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";


const getUser = async () => {
	const headers = getRequestHeaders();

	const session = await auth.api.getSession({ headers });

	const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/me/${session?.user.id}`, {
		method: "GET",
		headers,
	});

	const { data: user }: { data: any | null } = await res.json();

	if (session && user) {
		(session.user as any).role = user.role
	}
	return {
		session,
		user
	}
}

export const authMiddleware = createMiddleware().server(
	async ({ next, context, pathname }) => {

		const { user, session } = await getUser()

		if (pathname.startsWith("/profile")) {

			if (!user) {
				throw redirect({ to: "/auth/signin", replace: true });
			}
		}


		if (pathname.startsWith("/dashboard")) {
			if (user?.role !== "ADMIN") {
				throw redirect({ to: "/profile", replace: true });
			}

		}

		return await next({
			context: {
				...(context ?? {}),
				session,
			},
		});
	},
);
