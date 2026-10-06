import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from '../controllers/auth.controller.js';
import { registerSchema, loginSchema, changePasswordSchema, createUserSchema } from '../schemas/auth.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' } });
router.post('/register', authLimiter, validate(registerSchema), asyncHandler(controller.register));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(controller.login));
router.get('/me', authenticate, asyncHandler(controller.me));
router.post('/logout', authenticate, controller.logout);
router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(controller.changePassword));
export default router;

export const adminUsersRouter = Router();
adminUsersRouter.post('/users', authenticate, requireRole('admin'), validate(createUserSchema), asyncHandler(controller.createUser));
