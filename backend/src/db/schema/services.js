import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { departments } from './departments.js';
import { servicePriorityEnum } from './enums.js';

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  description: varchar('description', { length: 1000 }),
  departmentId: integer('department_id').notNull().references(() => departments.id, { onDelete: 'restrict' }),
  slaHours: integer('sla_hours').notNull().default(48),
  defaultPriority: servicePriorityEnum('default_priority').notNull().default('medium'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('services_name_unique').on(table.name)]);

export const servicesRelations = relations(services, ({ one }) => ({
  department: one(departments, { fields: [services.departmentId], references: [departments.id] }),
}));
