import { AppError } from '../utils/AppError.js';

export const validate = (schema, location = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[location]);
  if (!result.success) return next(new AppError(result.error.issues.map((i) => i.message).join(', '), 400));
  req[location] = result.data;
  next();
};
