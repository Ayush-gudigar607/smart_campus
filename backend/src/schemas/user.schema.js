import { z } from 'zod';
export const staffListSchema = z.object({ departmentId: z.coerce.number().int().positive().optional() });
