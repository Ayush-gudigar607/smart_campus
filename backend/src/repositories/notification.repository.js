import { and, desc, eq, sql } from 'drizzle-orm'; import { db } from '../db/index.js'; import { notifications, users } from '../db/schema/index.js';
export const create = (rows) => db.insert(notifications).values(rows).returning();
export async function list(userId, { isRead, page, limit }) { const where=and(eq(notifications.userId,userId), isRead === undefined ? undefined : eq(notifications.isRead,isRead)); const [count]=await db.select({total:sql`count(*)::int`}).from(notifications).where(where); const items=await db.select().from(notifications).where(where).orderBy(desc(notifications.createdAt)).limit(limit).offset((page-1)*limit); return {items,total:count.total}; }
export const unreadCount = async userId => Number((await db.select({count:sql`count(*)::int`}).from(notifications).where(and(eq(notifications.userId,userId),eq(notifications.isRead,false))))[0].count);
export const markRead = async (id,userId) => (await db.update(notifications).set({isRead:true}).where(and(eq(notifications.id,id),eq(notifications.userId,userId))).returning())[0];
export const markAllRead = userId => db.update(notifications).set({isRead:true}).where(and(eq(notifications.userId,userId),eq(notifications.isRead,false)));
export const emails = ids => db.select({id:users.id,email:users.email,name:users.name}).from(users).where(sql`${users.id} = any(${ids})`);
