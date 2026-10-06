import { eq, or } from 'drizzle-orm';
import { db } from '../db/index.js';
import { departments, users } from '../db/schema/index.js';

// This layer is the only auth layer that knows about Drizzle and database tables.
export const findUserByEmail = async (email) => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
};

export const findUserById = async (id) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
};

export const findStudentByEmailRollNoOrMobile = async (email, rollNo, mobileNumber) =>
  db.select({ id: users.id }).from(users)
    .where(or(eq(users.email, email), eq(users.rollNo, rollNo), eq(users.mobileNumber, mobileNumber))).limit(1);

export const findUserByEmailOrRollNo = async (emailOrRollNo) => {
  const [user] = await db.select().from(users)
    .where(or(eq(users.email, emailOrRollNo.toLowerCase()), eq(users.rollNo, emailOrRollNo.toUpperCase())))
    .limit(1);
  return user;
};

export const findDepartmentByName = async (name) => {
  const [department] = await db.select({ id: departments.id }).from(departments).where(eq(departments.name, name)).limit(1);
  return department;
};

export const createUser = async (data) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const updateUserPassword = async (id, passwordHash) =>
  db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, id));
