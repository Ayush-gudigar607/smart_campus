import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { departments, services } from '../db/schema/index.js';
export const list = (activeOnly) => db.select().from(departments).where(activeOnly ? eq(departments.isActive, true) : undefined).orderBy(departments.name);
export const findById = async (id) => (await db.select().from(departments).where(eq(departments.id, id)).limit(1))[0];
export const findByName = async (name) => (await db.select().from(departments).where(eq(departments.name, name)).limit(1))[0];
export const create = async (data) => (await db.insert(departments).values(data).returning())[0];
export const update = async (id, data) => (await db.update(departments).set(data).where(eq(departments.id, id)).returning())[0];
export const hasActiveServices = async (id) => (await db.select({ id: services.id }).from(services).where(and(eq(services.departmentId, id), eq(services.isActive, true))).limit(1)).length > 0;
