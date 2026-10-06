import * as service from '../services/staff.service.js';
export const queue = async (req, res) => res.json({ success: true, data: await service.queue(req.user.id, res.locals.query) });
export const departmentRequests = async (req, res) => res.json({ success: true, data: await service.departmentRequests(req.user.id, res.locals.query) });
