import { z } from 'zod';
export const idSchema = z.object({ id: z.coerce.number().int().positive() });
const fields = { name: z.string().trim().min(2).max(100), description: z.string().trim().max(500).nullable().optional(), email: z.string().trim().email().nullable().optional(), isActive: z.boolean().optional() };
export const createDepartmentSchema = z.object(fields);
export const updateDepartmentSchema = z.object(fields).partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required');
