import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { registerSchema, loginSchema, changePasswordSchema, createUserSchema } from '../schemas/auth.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { runEscalationNow } from '../controllers/admin.controller.js';

const router = Router();
router.post('/register', validate(registerSchema), asyncHandler(controller.register));
router.post('/login', validate(loginSchema), asyncHandler(controller.login));
router.get('/me', authenticate, asyncHandler(controller.me));
router.post('/logout', authenticate, controller.logout);
router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(controller.changePassword));
export default router;

export const adminUsersRouter = Router();
adminUsersRouter.post('/users', authenticate, requireRole('admin'), validate(createUserSchema), asyncHandler(controller.createUser));
adminUsersRouter.post('/escalation/run', authenticate, requireRole('admin'), asyncHandler(runEscalationNow));
