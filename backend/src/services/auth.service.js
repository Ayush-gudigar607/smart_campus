import bcrypt from 'bcrypt';
import * as authRepository from '../repositories/auth.repository.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';

const SALT_ROUNDS = 12;
const publicUser = ({ passwordHash, ...user }) => user;
const tokenFor = (user) => signToken({ id: user.id, role: user.role });

export async function register(input) {
  const { studentName, usn, department, confirmPassword, ...student } = input;
  const existing = await authRepository.findStudentByEmailRollNoOrMobile(student.email, usn, student.mobileNumber);
  if (existing.length) throw new AppError('Email, USN, or mobile number is already registered', 409);
  const departmentRecord = await authRepository.findDepartmentByName(department);
  if (!departmentRecord) throw new AppError('Department not found', 400);

  const passwordHash = await bcrypt.hash(student.password, SALT_ROUNDS);
  const user = await authRepository.createUser({
    name: studentName, rollNo: usn, email: student.email, passwordHash,
    departmentId: departmentRecord.id, currentYear: student.currentYear,
    mobileNumber: student.mobileNumber, role: 'student',
  });
  return { user: publicUser(user), token: tokenFor(user) };
}

export async function login({ emailOrRollNo, password }) {
  const user = await authRepository.findUserByEmailOrRollNo(emailOrRollNo);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Invalid email or password', 401);
  if (!user.isActive) throw new AppError('This account is inactive', 403);
  return { user: publicUser(user), token: tokenFor(user) };
}

export async function getCurrentUser(id) {
  const user = await authRepository.findUserById(id);
  if (!user) throw new AppError('User not found', 404);
  if (!user.isActive) throw new AppError('This account is inactive', 403);
  return publicUser(user);
}

export async function changePassword(id, { currentPassword, newPassword }) {
  const user = await authRepository.findUserById(id);
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) throw new AppError('Current password is incorrect', 401);
  await authRepository.updateUserPassword(id, await bcrypt.hash(newPassword, SALT_ROUNDS));
}

export async function createUser(input) {
  const { department, ...userInput } = input;
  const departmentRecord = department ? await authRepository.findDepartmentByName(department) : null;
  if (department && !departmentRecord) throw new AppError('Department not found', 400);
  if (await authRepository.findUserByEmail(input.email)) throw new AppError('Email is already registered', 409);

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  return publicUser(await authRepository.createUser({ ...userInput, passwordHash, departmentId: departmentRecord?.id }));
}
