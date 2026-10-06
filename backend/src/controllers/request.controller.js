import * as service from '../services/request.service.js';
export const submit = async (req, res) => res.status(201).json({ success: true, data: await service.submit(req.user.id, req.body) });
export const mine = async (req, res) => res.json({ success: true, data: await service.listMine(req.user.id, res.locals.query) });
export const get = async (req, res) => res.json({ success: true, data: await service.getByCode(req.params.code, req.user) });
export const cancel = async (req, res) => res.json({ success: true, data: await service.cancel(req.params.code, req.user.id) });
