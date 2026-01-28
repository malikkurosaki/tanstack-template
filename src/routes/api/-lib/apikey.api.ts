import dayjs from "dayjs";
import Elysia, { t } from "elysia";
import { SignJWT } from "jose";
import { prisma } from "@/db";
import type { User } from "@/generated/prisma/client";


const ApikeyApi = new Elysia({
	prefix: "/apikey",
})
	.get(
		"/",
		async () => {
			const list = await prisma.apiKey.findMany();

			return {
				data: list,
			};
		},
		{
			detail: {
				summary: "Get list apikey",
				description: "Untuk mendapatkan list API key yang aktif",
			},
		},
	)

	.post(
		"/create",
		async (ctx) => {
			const { user }: { user: User } = ctx as { user: User };
			const { body } = ctx;

            console.log(body)

			if (!process.env.JWT_SECRET) {
				throw new Error("JWT_SECRET is not defined");
			}

			const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

			const expiredAt = body.expiresAt
				? dayjs(body.expiresAt)
				: dayjs().add(3, "month");

			// Generate JWT API KEY
			const apikey = await new SignJWT({
				sub: user.id,
				type: "apikey",
			})
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime(expiredAt.unix())
				.sign(secretKey);

			const create = await prisma.apiKey.create({
				data: {
					apikey,
					userId: user.id,
					active: true,
					title: body.title,
					description: body.description,
					expiresAt: expiredAt.toDate(),
				},
			});

			return {
				message: "API key created",
				data: create,
			};
		},
		{
			body: t.Object({
				title: t.String(),
				description: t.Optional(t.String()),
				expiresAt: t.Optional(t.String()),
			}),
			detail: {
				summary: "Create API key",
				description: "Generate API key berbasis JWT",
			},
		},
	)
	.patch(
		"/:id",
		async (ctx) => {
			const { params, body } = ctx;
			const { id } = params;
			const { active } = body;

			const update = await prisma.apiKey.update({
				where: { id },
				data: { active },
			});

			return {
				message: "API key updated",
				data: update,
			};
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				active: t.Boolean(),
			}),
			detail: {
				summary: "Update API key status",
				description: "Enable or disable API key",
			},
		},
	)
	.delete(
		"/:id",
		async (ctx) => {
			const { params } = ctx;
			const { id } = params;

			await prisma.apiKey.delete({
				where: { id },
			});

			return {
				message: "API key deleted",
			};
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			detail: {
				summary: "Delete API key",
				description: "Permanently delete API key",
			},
		},
	);

export { ApikeyApi };
