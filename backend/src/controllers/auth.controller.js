import * as authService from '../services/auth.service.js';

const sendToken = (res, result, status = 200) => {
  res.cookie('token', result.token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.status(status).json({ success: true, data: result });
};

export const register = async (req, res) => sendToken(res, await authService.register(req.body), 201);
export const login = async (req, res) => sendToken(res, await authService.login(req.body));
export const me = async (req, res) => res.json({ success: true, data: await authService.getCurrentUser(req.user.id) });
export const logout = async (_req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ success: true, data: { message: 'Logged out successfully' } });
};
export const changePassword = async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  res.json({ success: true, data: { message: 'Password changed successfully' } });
};
export const createUser = async (req, res) => res.status(201).json({ success: true, data: await authService.createUser(req.body) });
