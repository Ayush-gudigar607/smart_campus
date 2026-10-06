import { z } from 'zod';

const pagination = { page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().min(1).max(100).default(10) };
export const staffQueueQuerySchema = z.object({
  status: z.preprocess((value) => typeof value === 'string' ? value.split(',') : value, z.array(z.enum(['assigned', 'in_progress', 'completed'])).min(1).default(['assigned', 'in_progress'])),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  sort: z.enum(['dueAt', 'priority', 'createdAt']).default('dueAt'),
  order: z.enum(['asc', 'desc']).default('asc'),
  ...pagination,
}).strict();
export const departmentRequestsQuerySchema = z.object({ ...pagination }).strict();
