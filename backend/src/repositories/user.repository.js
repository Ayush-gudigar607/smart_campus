import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema/index.js';
export const listStaff = (departmentId) => db.select({ id: users.id, name: users.name, email: users.email, departmentId: users.departmentId }).from(users).where(and(eq(users.role, 'staff'), eq(users.isActive, true), ...(departmentId ? [eq(users.departmentId, departmentId)] : [])));
