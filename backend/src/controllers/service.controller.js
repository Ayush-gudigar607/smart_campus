import * as service from '../services/service.service.js';
export const list = async (req, res) => res.json({ success: true, data: await service.listServices(res.locals.query, req.user.role) });
export const get = async (req, res) => res.json({ success: true, data: await service.getService(req.params.id, req.user.role) });
export const create = async (req, res) => res.status(201).json({ success: true, data: await service.createService(req.body) });
export const update = async (req, res) => res.json({ success: true, data: await service.updateService(req.params.id, req.body) });
export const remove = async (req, res) => res.json({ success: true, data: await service.deleteService(req.params.id) });
