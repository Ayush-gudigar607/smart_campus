import { AppError } from '../utils/AppError.js';
export const requireRole = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(new AppError('You do not have permission for this action', 403));
