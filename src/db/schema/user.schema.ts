import {
    boolean,
    pgEnum,
    pgTable,
    text,
    timestamp
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const roleEnum = pgEnum("role_enum", ["ADMIN", "USER", "MODERATOR"]);
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    phone: text("phone"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
    roleId: roleEnum("role").notNull().default("USER"),
});

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;
export type RoleEnum = (typeof roleEnum.enumValues)[number];
