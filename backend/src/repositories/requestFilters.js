import { sql } from 'drizzle-orm';

// Shared request scope used by request reporting queries.  Values are always bound
// by Drizzle; the alias is an internal constant supplied by repository code.
export const buildRequestWhere = (filters = {}, alias = 'r') => {
  const column = (name) => sql`${sql.raw(alias)}.${sql.raw(name)}`;
  const parts = [];
  if (filters.departmentId) parts.push(sql`${column('department_id')} = ${filters.departmentId}`);
  if (filters.serviceId) parts.push(sql`${column('service_id')} = ${filters.serviceId}`);
  if (filters.from) parts.push(sql`${column('created_at')} >= ${filters.from}`);
  if (filters.to) parts.push(sql`${column('created_at')} <= ${filters.to}`);
  return parts.length ? sql`where ${sql.join(parts, sql` and `)}` : sql``;
};
