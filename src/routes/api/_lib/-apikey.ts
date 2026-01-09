/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */

import type { JWTPayloadSpec } from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db";
import { apikey, type User } from "@/db/schema";

const NINETY_YEARS = 60 * 60 * 24 * 365 * 90; // in seconds

type JWT = {
	sign(data: Record<string, string | number> & JWTPayloadSpec): Promise<string>;
	verify(
		jwt?: string,
	): Promise<false | (Record<string, string | number> & JWTPayloadSpec)>;
};

const ApiKeyRoute = new Elysia({
	prefix: "/apikey",
	detail: { tags: ["apikey"] },
})
	.post(
		"/create",
		async (ctx) => {
			const { user }: { user: User } = ctx as any;
			const { name, description, expiredAt } = ctx.body;
			const { sign } = (ctx as any).jwt as JWT;

			// hitung expiredAt
			const exp = expiredAt
				? Math.floor(new Date(expiredAt).getTime() / 1000) // jika dikirim
				: Math.floor(Date.now() / 1000) + NINETY_YEARS; // default 90 tahun

			const token = await sign({
				sub: user.id,
				aud: "host",
				exp,
				payload: JSON.stringify({
					name,
					description,
					expiredAt,
				}),
			});

			await db.insert(apikey).values({
				name: name,
				description: description,
				token,
				expiredAt: new Date(expiredAt || Date.now() + NINETY_YEARS), // ✅ Date
				userId: user.id,
			});

			return { message: "success", token };
		},
		{
			detail: {
				summary: "create api key",
			},
			body: t.Object({
				name: t.String(),
				description: t.String(),
				expiredAt: t.Optional(t.String({ format: "date-time" })), // ISO date string
			}),
		},
	)
	.get(
		"/list",
		async (ctx) => {
			const { user: usr }: { user: User } = ctx as any;

			const _apikey = await db.query.apikey.findMany({
				where: eq(apikey.userId, usr.id),
			});

			return { data: _apikey };
		},
		{
			detail: {
				summary: "get api key list",
			},
		},
	)
	.post(
		"/delete",
		async (ctx) => {
			const { id } = ctx.body as { id: string };

			const _apikey = await db.delete(apikey).where(eq(apikey.id, id));
			return { message: "success", _apikey };
		},
		{
			detail: {
				summary: "delete api key",
			},
			body: t.Object({
				id: t.String(),
			}),
		},
	);

export { ApiKeyRoute };
