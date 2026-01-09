/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import Elysia from "elysia";

const UserRoute = new Elysia({
	prefix: "user",
	tags: ["user"],
})
	.get(
		"/list",
		async () => {
			const data = await db.query.user.findMany();
			return { data };
		},
		{
			detail: {
				summary: "mendapatkan list user",
			},
		},
	)
	.get("/me", async (ctx) => {
		const { user: u } = ctx as any;
    const usr = await db.query.user.findFirst({
      where: eq(user.id, u.id)
    })
		return {
			data: usr,
		};
	}, {
    detail: {
      summary: "mendapatkan user saat ini"
    }
  });

export { UserRoute };
