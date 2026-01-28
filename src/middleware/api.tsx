import { auth } from "@/lib/auth";
import type Elysia from "elysia";
import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) throw new Error("JWT_SECRET is not defined");

export function apiMiddleware(app: Elysia) {
	return app.derive(async ({ request }) => {
		const headers = request.headers
		const userSession = await auth.api.getSession({
			headers
		});

		if (userSession?.user) {
			const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/me/${userSession.user.id}`, {
				method: "GET"
			});

			const { data } = await res.json();
			return { user: data };
		}

		// 2️⃣ ambil token dari header
		const authHeader = headers.get("authorization") || headers.get("Authorization") || headers.get("x-token");
		if (!authHeader) return { user: null };

		const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

		try {
			const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
			if (!payload.sub) return { user: null };

			const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/me/${payload.sub}`, {
				method: "GET"
			});

			const { data } = await res.json();

			return { user: data };
		} catch (err) {
			console.warn(`[AUTH] Invalid token: ${err}`);
			return { user: null };
		}
	})
		.onBeforeHandle(({ user, set, request }) => {
			if (!user) {
				console.warn(`[AUTH] Unauthorized: ${request.method} ${request.url}`);
				set.status = 401;
				return { message: "Unauthorized" };
			}
		});
}
