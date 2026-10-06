import { boolean, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  email: varchar('email', { length: 254 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('departments_name_unique').on(table.name)]);
