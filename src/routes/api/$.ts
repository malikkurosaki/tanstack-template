import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { createFileRoute } from "@tanstack/react-router";
import { Elysia } from "elysia";
import { auth } from "@/lib/auth";
import { apiMidleware } from "@/middleware/api";
import { ApiKeyRoute } from "./_lib/-apikey";
import { UserRoute } from "./_lib/-users";

const AuthApp = new Elysia().all("/auth/*", ({ request }) =>
	auth.handler(request),
);

export const app = new Elysia({
	prefix: "/api",
})
	.use(cors())
	.use(
		swagger({
			path: "/docs",
		}),
	)
	.use(AuthApp)
	.use(apiMidleware)
	.use(ApiKeyRoute)
	.use(UserRoute);

const handle = ({ request }: { request: Request }) => app.fetch(request);

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			GET: handle,
			POST: handle,
		},
	},
});

export type AppApi = typeof app;
