import dayjs from "dayjs";
import {
    index,
    pgTable,
    text,
    timestamp
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
export const apikey = pgTable(
    "apikey",
    {
        id: text("id")
            .primaryKey()
            .$default(() => crypto.randomUUID()),
        name: text("name").notNull(),
        description: text("description").notNull(),
        token: text("token"),
        expiredAt: timestamp("expired_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(() => dayjs().toDate()),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("apikey_userId_idx").on(table.userId)],
);

export type Apikey = InferSelectModel<typeof apikey>;
export type NewApikey = InferInsertModel<typeof apikey>;

