import * as service from '../services/user.service.js';
export const listStaff = async (req, res) => res.json({ success: true, data: await service.listStaff(req.query.departmentId) });
