import { z } from 'zod';

const commonBase = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  departmentId: z.coerce.number().int().positive().optional(),
  serviceId: z.coerce.number().int().positive().optional(),
}).strict();
const dated = (schema) => schema.superRefine((data, ctx) => {
  if (data.from && data.to && data.from > data.to) ctx.addIssue({ code: 'custom', path: ['to'], message: 'to must be on or after from' });
});

export const statsQuerySchema = dated(commonBase);
export const serviceStatsQuerySchema = dated(commonBase.extend({ limit: z.coerce.number().int().min(1).max(50).default(10) }));
export const trendQuerySchema = dated(commonBase.extend({ interval: z.enum(['day', 'week', 'month']).default('day') }));
