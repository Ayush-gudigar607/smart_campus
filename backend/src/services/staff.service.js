import * as repository from '../repositories/staff.repository.js';
import { withOverdue } from '../utils/requestOverdue.js';

export const queue = async (staffId, filters) => { const result = await repository.listQueue(staffId, filters); return { ...result, items: result.items.map((item) => withOverdue(item)), page: filters.page, limit: filters.limit }; };
export const departmentRequests = async (staffId, filters) => { const result = await repository.listDepartmentPending(staffId, filters); return { ...result, items: result.items.map((item) => withOverdue(item)), page: filters.page, limit: filters.limit }; };
