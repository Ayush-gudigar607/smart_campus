import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

export const authenticate = (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const bearerToken = header?.startsWith('Bearer ') ? header.slice(7) : null;
    const token = req.cookies?.token || bearerToken;
    if (!token) throw new AppError('Authentication required', 401);
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Invalid or expired token', 401));
  }
};
