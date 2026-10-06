import * as repository from '../repositories/user.repository.js';
export const listStaff = (departmentId) => repository.listStaff(departmentId);
