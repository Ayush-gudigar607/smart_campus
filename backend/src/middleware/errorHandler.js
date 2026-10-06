import { env } from '../config/env.js';
export const errorHandler = (err, _req, res, _next) => {
  const isUniqueViolation = err.code === '23505';
  const statusCode = isUniqueViolation ? 409 : err.statusCode || 500;
  const message = isUniqueViolation ? 'A user with that email or roll number already exists' : (err.isOperational ? err.message : 'Internal server error');
  if (env.NODE_ENV !== 'production' && !err.isOperational) console.error(err);
  res.status(statusCode).json({ success: false, message });
};
