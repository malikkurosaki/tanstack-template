/** biome-ignore-all lint/suspicious/noExplicitAny: explanation */
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = (await auth.api.getSession({ headers })) as any;
	const usr = await db.query.user.findFirst({
		where: eq(user.id, session?.user.id ?? ""),
	});

	if (!session || !usr) {
		throw redirect({ to: "/login" });
	}

	return await next({
		context: {
			session: usr,
		},
	});
});
