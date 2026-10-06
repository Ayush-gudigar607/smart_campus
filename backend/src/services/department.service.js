import * as repository from '../repositories/department.repository.js';
import { AppError } from '../utils/AppError.js';
export const listDepartments = (role) => repository.list(role === 'student');
export async function getDepartment(id, role) { const item = await repository.findById(id); if (!item || (role === 'student' && !item.isActive)) throw new AppError('Department not found', 404); return item; }
export async function createDepartment(data) { if (await repository.findByName(data.name)) throw new AppError('Department name already exists', 409); return repository.create(data); }
export async function updateDepartment(id, data) { await getDepartment(id); if (data.name) { const existing = await repository.findByName(data.name); if (existing && existing.id !== id) throw new AppError('Department name already exists', 409); } return repository.update(id, data); }
export async function deleteDepartment(id) { await getDepartment(id); if (await repository.hasActiveServices(id)) throw new AppError('Department has active services', 409); return repository.update(id, { isActive: false }); }
