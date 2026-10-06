import { Router } from 'express';
import * as controller from '../controllers/staff.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import { departmentRequestsQuerySchema, staffQueueQuerySchema } from '../schemas/staff.schema.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireRole('staff'));
router.get('/queue', validate(staffQueueQuerySchema, 'query'), asyncHandler(controller.queue));
router.get('/department-requests', validate(departmentRequestsQuerySchema, 'query'), asyncHandler(controller.departmentRequests));
export default router;
