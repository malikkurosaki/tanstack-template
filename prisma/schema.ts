import { relations, sql } from 'drizzle-orm'
import { boolean, foreignKey, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const User = pgTable('User', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name'),
	email: text('email').unique(),
	password: text('password'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const ApiKey = pgTable('ApiKey', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	userId: text('userId').notNull(),
	name: text('name').notNull(),
	key: text('key').notNull().unique(),
	description: text('description'),
	expiredAt: timestamp('expiredAt', { precision: 3 }),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
}, (ApiKey) => ([foreignKey({
	name: 'ApiKey_User_fkey',
	columns: [ApiKey.userId],
	foreignColumns: [User.id]
})
	.onDelete('cascade')
	.onUpdate('cascade')
]));

export const WebHook = pgTable('WebHook', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name'),
	description: text('description'),
	url: text('url').notNull(),
	payload: text('payload').default("{}"),
	method: text('method').notNull().default("POST"),
	headers: text('headers').default("{}"),
	apiToken: text('apiToken'),
	retries: integer('retries').default(3),
	enabled: boolean('enabled').notNull().default(true),
	replay: boolean('replay').notNull(),
	replayKey: text('replayKey'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const WaHook = pgTable('WaHook', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	data: jsonb('data'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const ChatFlows = pgTable('ChatFlows', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	flows: jsonb('flows'),
	defaultFlow: text('defaultFlow'),
	defaultData: jsonb('defaultData'),
	active: boolean('active').notNull().default(true),
	flowUrl: text('flowUrl').unique(),
	flowToken: text('flowToken'),
	waPhoneNumberId: text('waPhoneNumberId'),
	waToken: text('waToken'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const UserRelations = relations(User, ({ many }) => ({
	ApiKey: many(ApiKey, {
		relationName: 'ApiKeyToUser'
	})
}));

export const ApiKeyRelations = relations(ApiKey, ({ one }) => ({
	User: one(User, {
		relationName: 'ApiKeyToUser',
		fields: [ApiKey.userId],
		references: [User.id]
	})
}));