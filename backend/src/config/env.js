import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CLIENT_ORIGIN: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MAX_ACTIVE_PER_STAFF: z.coerce.number().int().positive().default(10),
  ESCALATION_L2_HOURS: z.coerce.number().positive().default(24),
  UNASSIGNED_ALERT_HOURS: z.coerce.number().positive().default(4),
  ESCALATION_CRON: z.string().default('*/15 * * * *'),
  RUN_JOBS: z.string().default('true').transform(v => v !== 'false'),
  SMTP_HOST: z.string().optional(), SMTP_PORT: z.coerce.number().default(1025), SMTP_USER: z.string().optional(), SMTP_PASS: z.string().optional(), MAIL_FROM: z.string().email().default('noreply@campus.local'), FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}
export const env = parsed.data;
