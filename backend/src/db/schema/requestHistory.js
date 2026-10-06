import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { requestStatusEnum } from './enums.js'; import { requests } from './requests.js'; import { users } from './users.js';
export const requestHistory = pgTable('request_history', { id: serial('id').primaryKey(), requestId: integer('request_id').notNull().references(() => requests.id, { onDelete: 'cascade' }), oldStatus: requestStatusEnum('old_status'), newStatus: requestStatusEnum('new_status').notNull(), changedBy: integer('changed_by').references(() => users.id), note: text('note'), changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull() });
export const requestHistoryRelations = relations(requestHistory, ({ one }) => ({ request: one(requests, { fields: [requestHistory.requestId], references: [requests.id] }), changedByUser: one(users, { fields: [requestHistory.changedBy], references: [users.id] }) }));
