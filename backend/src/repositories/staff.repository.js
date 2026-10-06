import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '../db/index.js';
import { requests, services, users } from '../db/schema/index.js';

const student = alias(users, 'queue_student');
const queueFields = { requestCode: requests.requestCode, title: requests.title, priority: requests.priority, status: requests.status, dueAt: requests.dueAt, createdAt: requests.createdAt, studentName: student.name, studentUsn: student.rollNo, serviceName: services.name, location: requests.location };
const ordering = { dueAt: requests.dueAt, priority: requests.priority, createdAt: requests.createdAt };
const queueQuery = (where, filters) => db.select(queueFields).from(requests).innerJoin(student, eq(requests.studentId, student.id)).innerJoin(services, eq(requests.serviceId, services.id)).where(where).orderBy((filters.order === 'desc' ? desc : asc)(ordering[filters.sort])).limit(filters.limit).offset((filters.page - 1) * filters.limit);

export async function listQueue(staffId, filters) {
  const conditions = [eq(requests.assignedTo, staffId), inArray(requests.status, filters.status)];
  if (filters.priority) conditions.push(eq(requests.priority, filters.priority));
  const where = and(...conditions);
  const [totalRows, counts] = await Promise.all([
    db.select({ total: sql`count(*)::int` }).from(requests).where(where),
    db.select({ assigned: sql`count(*) filter (where ${requests.status} = 'assigned')::int`, inProgress: sql`count(*) filter (where ${requests.status} = 'in_progress')::int`, overdue: sql`count(*) filter (where ${requests.dueAt} < now() and ${requests.status} not in ('completed', 'cancelled'))::int` }).from(requests).where(eq(requests.assignedTo, staffId)),
  ]);
  return { items: await queueQuery(where, filters), total: totalRows[0].total, counts: { assigned: counts.assigned, in_progress: counts.inProgress, overdue: counts.overdue } };
}

export async function listDepartmentPending(staffId, filters) {
  const [staff] = await db.select({ departmentId: users.departmentId }).from(users).where(eq(users.id, staffId)).limit(1);
  if (!staff?.departmentId) return { items: [], total: 0 };
  const where = and(eq(requests.departmentId, staff.departmentId), eq(requests.status, 'pending'));
  const [countRow] = await db.select({ total: sql`count(*)::int` }).from(requests).where(where);
  return { items: await queueQuery(where, { ...filters, sort: 'createdAt', order: 'asc' }), total: countRow.total };
}
