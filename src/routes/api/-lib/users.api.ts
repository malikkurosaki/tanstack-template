/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
import { prisma } from "@/db";
import type { User } from "@/generated/prisma/client";
import Elysia, { t } from "elysia";

const UserApi = new Elysia({
	prefix: "user",
	tags: ["user"],
})
	.get("/", (ctx) => {
		const { user }: { user: User } = ctx as any
		console.log(user)
		return {
			data: user
		}

	})
	.get("/:id", async ({ params }) => {
		const userId = params.id
		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		})
		return {
			data: user
		}
	}, {
		params: t.Object({
			id: t.Optional(t.String())
		}),
		detail: {
			summary: "get user by id"
		}
	})
	.get(
		"/list",
		async ({ query }) => {
			const page = query.page || 1;
			const limit = query.limit || 10;
			const skip = (page - 1) * limit;

			const [data, totalCount] = await Promise.all([
				prisma.user.findMany({
					take: limit,
					skip: skip,
				}),
				prisma.user.count(),
			]);

			const totalPages = Math.ceil(totalCount / limit);

			return {
				data,
				pagination: {
					page,
					limit,
					total: totalCount,
					totalPages,
				},
			};
		},
		{
			detail: {
				summary: "mendapatkan list user",
			},
			tags: ["list"],
			query: t.Object({
				page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
				limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
			}),
		},
	)

export { UserApi };
