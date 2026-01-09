import { eq } from "drizzle-orm";
import { db } from ".";
import { type RoleEnum, user } from "./schema";

const listAdmins = [
	{
		email: "agus@gmail.com",
		roleId: "ADMIN" as RoleEnum,
	},
];

async function updateRole() {
	for (const v of listAdmins) {
		await db
			.update(user)
			.set({ roleId: v.roleId })
			.where(eq(user.email, v.email));

		console.log(`update ${v.email} : ${v.roleId} success`);
	}
}

(async () => {
	await updateRole();
})()
	.then(() => {
		console.log("success");
		process.exit(0);
	})
	.catch((e) => {
		console.log(JSON.stringify(e));
		process.exit(1);
	});
