import { boolean, integer, pgEnum, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { departments } from './departments.js';

export const roleEnum = pgEnum('role', ['student', 'staff', 'admin']);
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('student'),
  rollNo: varchar('roll_no', { length: 50 }),
  departmentId: integer('department_id').references(() => departments.id),
  currentYear: integer('current_year'),
  mobileNumber: varchar('mobile_number', { length: 20 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('users_email_unique').on(table.email),
  uniqueIndex('users_roll_no_unique').on(table.rollNo),
  uniqueIndex('users_mobile_number_unique').on(table.mobileNumber),
]);
