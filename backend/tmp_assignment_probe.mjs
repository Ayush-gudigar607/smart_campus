import { db, pool } from './src/db/index.js';
import * as requestService from './src/services/request.service.js';

try {
  const columns = await db.execute(`
    select column_name
    from information_schema.columns
    where table_name = 'requests'
      and column_name in ('reassign_count', 'assigned_to', 'assigned_at')
    order by column_name
  `);
  console.log('request columns:', columns.rows);

  const historyColumns = await db.execute(`
    select column_name, is_nullable
    from information_schema.columns
    where table_name = 'request_history'
      and column_name = 'changed_by'
  `);
  console.log('history columns:', historyColumns.rows);

  const samples = await db.execute(`
    select r.request_code, r.status, r.department_id, r.assigned_to, u.id as staff_id, u.name as staff_name
    from requests r
    left join users u on u.role = 'staff' and u.is_active and u.department_id = r.department_id
    where r.status in ('pending', 'assigned', 'in_progress')
    order by r.created_at desc
    limit 5
  `);
  console.log('assignment samples:', samples.rows);

  const target = samples.rows.find((row) => row.status === 'pending' && row.staff_id);
  if (target) {
    const [before] = (await db.execute(`
      select id, status, assigned_to, assigned_at, updated_at
      from requests
      where request_code = '${target.request_code}'
    `)).rows;
    const beforeHistory = await db.execute(`
      select id
      from request_history
      where request_id = ${before.id}
    `);

    try {
      const assigned = await requestService.autoAssign(target.request_code);
      console.log('auto-assign result:', {
        requestCode: assigned.requestCode,
        status: assigned.status,
        assignedTo: assigned.assignedTo,
        assignedStaffName: assigned.assignedStaffName,
      });
    } catch (error) {
      console.error('auto-assign error:', error);
    } finally {
      const keepIds = beforeHistory.rows.map((row) => Number(row.id));
      await db.execute(`
        update requests
        set status = '${before.status}',
            assigned_to = ${before.assigned_to ?? 'null'},
            assigned_at = ${before.assigned_at ? `'${before.assigned_at.toISOString()}'` : 'null'},
            updated_at = '${before.updated_at.toISOString()}'
        where id = ${before.id}
      `);
      await db.execute(`
        delete from request_history
        where request_id = ${before.id}
          ${keepIds.length ? `and id not in (${keepIds.join(',')})` : ''}
      `);
      console.log('auto-assign probe restored:', target.request_code);
    }
  }
} finally {
  await pool.end();
}
