import { sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { buildRequestWhere } from './requestFilters.js';

// Definitions: open is pending/assigned/in_progress; overdue is open with due_at < now().
// Resolution is completed_at-created_at for completed requests; response is assigned_at-created_at when assigned.
// Cancelled requests count in totals but never in resolution metrics.
const rows = async (query) => (await db.execute(query)).rows;
const scope = (filters, alias = 'r') => buildRequestWhere(filters, alias);
const number = (value) => value === null || value === undefined ? null : Number(value);
const normalizeOverview = (r) => ({ ...r, total: number(r.total) || 0, pending: number(r.pending) || 0, assigned: number(r.assigned) || 0, inProgress: number(r.inProgress) || 0, completed: number(r.completed) || 0, cancelled: number(r.cancelled) || 0, open: number(r.open) || 0, overdue: number(r.overdue) || 0, unassigned: number(r.unassigned) || 0, avgResolutionHours: number(r.avgResolutionHours), medianResolutionHours: number(r.medianResolutionHours), avgResponseHours: number(r.avgResponseHours), completionRate: number(r.completionRate), byPriority: { low: number(r.low) || 0, medium: number(r.medium) || 0, high: number(r.high) || 0, urgent: number(r.urgent) || 0 } });

export async function overview(filters) { const [result] = await rows(sql`
  select count(*)::int total, count(*) filter (where r.status = 'pending')::int pending,
    count(*) filter (where r.status = 'assigned')::int assigned, count(*) filter (where r.status = 'in_progress')::int "inProgress",
    count(*) filter (where r.status = 'completed')::int completed, count(*) filter (where r.status = 'cancelled')::int cancelled,
    count(*) filter (where r.status in ('pending','assigned','in_progress'))::int open,
    count(*) filter (where r.status in ('pending','assigned','in_progress') and r.due_at < now())::int overdue,
    round((avg(extract(epoch from (r.completed_at-r.created_at))/3600) filter (where r.status='completed'))::numeric,1) "avgResolutionHours",
    round((percentile_cont(0.5) within group (order by extract(epoch from (r.completed_at-r.created_at))/3600) filter (where r.status='completed'))::numeric,1) "medianResolutionHours",
    round((avg(extract(epoch from (r.assigned_at-r.created_at))/3600) filter (where r.assigned_at is not null))::numeric,1) "avgResponseHours",
    case when count(*) filter (where r.status <> 'cancelled') = 0 then null else round(100.0 * count(*) filter (where r.status='completed') / count(*) filter (where r.status <> 'cancelled'), 1) end "completionRate",
    count(*) filter (where r.status='pending' and r.assigned_to is null)::int unassigned,
    count(*) filter (where r.status in ('pending','assigned','in_progress') and r.priority='low')::int low,
    count(*) filter (where r.status in ('pending','assigned','in_progress') and r.priority='medium')::int medium,
    count(*) filter (where r.status in ('pending','assigned','in_progress') and r.priority='high')::int high,
    count(*) filter (where r.status in ('pending','assigned','in_progress') and r.priority='urgent')::int urgent
  from requests r ${scope(filters)}`); return normalizeOverview(result); }

export async function byDepartment(filters) { return rows(sql`
  with filtered as (select * from requests r ${scope(filters)}) select d.name, count(r.id) filter (where r.status in ('pending','assigned','in_progress'))::int open,
    count(r.id) filter (where r.status in ('pending','assigned','in_progress') and r.due_at < now())::int overdue,
    count(r.id) filter (where r.status='completed')::int completed,
    round((avg(extract(epoch from (r.completed_at-r.created_at))/3600) filter (where r.status='completed'))::numeric,1) "avgResolutionHours",
    count(distinct u.id) filter (where u.role='staff' and u.is_active)::int "staffCount"
  from departments d left join filtered r on r.department_id=d.id left join users u on u.department_id=d.id
  group by d.id, d.name order by open desc, d.name`); }

export async function byService(filters) { return rows(sql`
  with filtered as (select * from requests r ${scope(filters)}) select s.name, count(r.id)::int total, count(r.id) filter (where r.status='completed')::int completed,
    round((avg(extract(epoch from (r.completed_at-r.created_at))/3600) filter (where r.status='completed'))::numeric,1) "avgResolutionHours", s.sla_hours "slaHours",
    case when count(r.id) filter (where r.status='completed')=0 then null else round(100.0*count(r.id) filter (where r.status='completed' and r.completed_at <= r.due_at)/count(r.id) filter (where r.status='completed'),1) end "slaComplianceRate"
  from services s left join filtered r on r.service_id=s.id group by s.id, s.name, s.sla_hours order by total desc, s.name limit ${filters.limit}`); }

export async function trend(filters) { const unit = sql.raw(`'${filters.interval}'`); return rows(sql`
  with buckets as (select generate_series(date_trunc(${unit}, ${filters.from}::timestamptz), date_trunc(${unit}, ${filters.to}::timestamptz), ${sql.raw(`'1 ${filters.interval}'::interval`)}) bucket)
  select b.bucket, count(r.id) filter (where r.created_at >= b.bucket and r.created_at < b.bucket + ${sql.raw(`'1 ${filters.interval}'::interval`)})::int created,
    count(r.id) filter (where r.completed_at >= b.bucket and r.completed_at < b.bucket + ${sql.raw(`'1 ${filters.interval}'::interval`)})::int completed
  from buckets b left join requests r on r.created_at >= ${filters.from} and r.created_at <= ${filters.to} ${filters.departmentId ? sql`and r.department_id=${filters.departmentId}` : sql``} ${filters.serviceId ? sql`and r.service_id=${filters.serviceId}` : sql``}
  group by b.bucket order by b.bucket`); }

export async function staffPerformance(filters, staffId) { return rows(sql`
  with filtered as (select * from requests r ${scope(filters)})
  select u.name, d.name department, count(r.id) filter (where r.status in ('pending','assigned','in_progress'))::int "assignedOpen",
    count(r.id) filter (where r.status='completed')::int completed, count(r.id) filter (where r.status in ('pending','assigned','in_progress') and r.due_at < now())::int overdue,
    round((avg(extract(epoch from (r.completed_at-r.created_at))/3600) filter (where r.status='completed'))::numeric,1) "avgResolutionHours",
    0::int "reassignedAway"
  from users u join departments d on d.id=u.department_id left join filtered r on r.assigned_to=u.id
  where u.role='staff' ${staffId ? sql`and u.id=${staffId}` : sql``} group by u.id,d.name order by completed desc,u.name`); }

export async function recentRequests(filters) { return rows(sql`select r.request_code "requestCode",r.title,r.status,r.priority,r.created_at "createdAt" from requests r ${scope(filters)} order by r.created_at desc limit 10`); }
export async function overdueList(filters) { return rows(sql`with filtered as (select * from requests r ${scope(filters)}) select r.request_code "requestCode",r.title,r.due_at "dueAt",round((extract(epoch from (now()-r.due_at))/3600)::numeric,1) "hoursOverdue",u.name "assignedTo" from filtered r left join users u on u.id=r.assigned_to where r.status in ('pending','assigned','in_progress') and r.due_at < now() order by r.due_at limit 10`); }
