import { z } from 'zod';
export const serviceIdSchema = z.object({ id: z.coerce.number().int().positive() });
const fields = { name: z.string().trim().min(2).max(150), description: z.string().trim().max(1000).nullable().optional(), departmentId: z.coerce.number().int().positive(), slaHours: z.coerce.number().int().positive().max(8760).optional(), defaultPriority: z.enum(['low', 'medium', 'high', 'urgent']).optional(), isActive: z.boolean().optional() };
export const createServiceSchema = z.object(fields);
export const updateServiceSchema = z.object(fields).partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required');
export const serviceListSchema = z.object({ departmentId: z.coerce.number().int().positive().optional(), q: z.string().trim().max(150).optional(), isActive: z.enum(['true', 'false']).transform((value) => value === 'true').optional(), sort: z.enum(['name', 'slaHours', 'createdAt']).default('name'), order: z.enum(['asc', 'desc']).default('asc'), page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().min(1).max(100).default(10) });
