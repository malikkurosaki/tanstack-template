import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { createFileRoute } from "@tanstack/react-router";
import { Elysia } from "elysia";
import { prisma } from "@/db";
import { auth } from "@/lib/auth";
import { apiMiddleware } from "@/middleware/api";
import { ApikeyApi } from "./-lib/apikey.api";
import { ProjectApi } from "./-lib/project.api";
import { TaskApi } from "./-lib/task.api";
import { UserApi } from "./-lib/users.api";

const AuthApp = new Elysia().all("/auth/*", ({ request }) =>
	auth.handler(request),
);

const dev = process.env.NODE_ENV === "development";

export const app = new Elysia({
	prefix: "/api",
})
	.use(cors())
	.use(
		dev
			? swagger({
					path: "/docs",
				})
			: (app) => app.get("/docs", "docs dev only"),
	)
	.get("/me/:id", async ({ params }) => {
		const userId = params.id;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		return {
			data: user,
		};
	})
	.use(AuthApp)
	.use(apiMiddleware)
	.use(UserApi)
	.use(ApikeyApi)
	.use(TaskApi);

const handle = ({ request }: { request: Request }) => app.fetch(request);

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			GET: handle,
			POST: handle,
			PATCH: handle,
			DELETE: handle,
		},
	},
});

export type AppApi = typeof app;
