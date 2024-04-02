import {blob, integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({autoIncrement: true}),
    qqId: text('qq_id').notNull(),
    nick: text('nick'),
    prefix: text('prefix'),
    suffix: text('suffix'),
    coins: integer('coins')
})


export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
