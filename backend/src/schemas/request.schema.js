import { z } from 'zod';
const priority = z.enum(['low', 'medium', 'high', 'urgent']);
export const createRequestSchema = z.object({ serviceId: z.coerce.number().int().positive(), title: z.string().trim().min(5).max(120), description: z.string().trim().min(1).max(5000), location: z.string().trim().max(500).optional(), priority: priority.optional() }).strict();
export const requestCodeSchema = z.object({ code: z.string().trim().regex(/^SR-\d{4}-\d{6}$/, 'Invalid request code') });
export const mineQuerySchema = z.object({ status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']).optional(), page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().min(1).max(100).default(10) });
