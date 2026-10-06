import { AppError } from '../utils/AppError.js';

export const validate = (schema, location = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[location]);
  if (!result.success) return next(new AppError(result.error.issues.map((i) => i.message).join(', '), 400));
  if (location === 'query') res.locals.query = result.data;
  else req[location] = result.data;
  next();
};
