import * as repository from '../repositories/service.repository.js';
import * as departmentRepository from '../repositories/department.repository.js';
import { AppError } from '../utils/AppError.js';
export const listServices = async (filters, role) => ({ ...(await repository.list(filters, role === 'student')), page: filters.page, limit: filters.limit });
export async function getService(id, role) { const item = await repository.findById(id); if (!item || (role === 'student' && !item.isActive)) throw new AppError('Service not found', 404); return item; }
async function ensureDepartment(id) { const department = await departmentRepository.findById(id); if (!department || !department.isActive) throw new AppError('Department not found or inactive', 400); }
export async function createService(data) { await ensureDepartment(data.departmentId); if (await repository.findByName(data.name)) throw new AppError('Service name already exists', 409); return repository.create(data); }
export async function updateService(id, data) { await getService(id); if (data.departmentId) await ensureDepartment(data.departmentId); if (data.name) { const existing = await repository.findByName(data.name); if (existing && existing.id !== id) throw new AppError('Service name already exists', 409); } return repository.update(id, data); }
export async function deleteService(id) { await getService(id); return repository.update(id, { isActive: false }); }
