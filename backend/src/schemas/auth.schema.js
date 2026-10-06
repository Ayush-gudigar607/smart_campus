import { z } from 'zod';

const password = z.string().min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number');
const email = z.string().trim().email('Enter a valid email').transform((value) => value.toLowerCase());
export const DEPARTMENTS = ['CSE', 'AIML', 'AIDS', 'CSBS', 'CSDS', 'ECE', 'EEE', 'MECH', 'AUTOMOBILE', 'AERONAUTICAL', 'MARINE'];
const department = z.string().trim().transform((value) => value.toUpperCase()).pipe(z.enum(DEPARTMENTS));

export const registerSchema = z.object({
  studentName: z.string().trim().min(2, 'Student name is required').max(120),
  usn: z.string().trim().min(1, 'USN is required').max(50).transform((value) => value.toUpperCase()),
  department,
  currentYear: z.coerce.number().int().min(1).max(6),
  email,
  mobileNumber: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, 'Enter a valid mobile number'),
  password,
  confirmPassword: z.string(),
}).superRefine(({ password: value, confirmPassword }, ctx) => {
  if (value !== confirmPassword) ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match' });
});
export const loginSchema = z.object({
  emailOrRollNo: z.string().trim().min(1, 'Email or USN is required'),
  password: z.string().min(1, 'Password is required'),
});
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: password });
export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120), email, password,
  role: z.enum(['staff', 'admin']), department: department.nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'staff' && !data.department) ctx.addIssue({ code: 'custom', path: ['department'], message: 'Staff must have a department' });
});
