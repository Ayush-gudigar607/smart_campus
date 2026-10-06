import * as service from '../services/department.service.js';
export const list = async (req, res) => res.json({ success: true, data: await service.listDepartments(req.user.role) });
export const get = async (req, res) => res.json({ success: true, data: await service.getDepartment(req.params.id, req.user.role) });
export const create = async (req, res) => res.status(201).json({ success: true, data: await service.createDepartment(req.body) });
export const update = async (req, res) => res.json({ success: true, data: await service.updateDepartment(req.params.id, req.body) });
export const remove = async (req, res) => res.json({ success: true, data: await service.deleteDepartment(req.params.id) });
