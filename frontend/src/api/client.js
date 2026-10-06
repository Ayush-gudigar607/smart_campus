/**
 * CampusConnect API Client
 * Connects Expo frontend to Express/Drizzle backend (http://localhost:5000)
 * Gracefully provides offline/mock fallbacks if backend is booting or unreachable.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { mockRequests, mockServices, mockUser, mockNotifications, mockStats } from '../data/mockData';

// EXPO_PUBLIC_API_URL takes precedence. In Expo Go, derive the Metro host as a
// useful default so a phone on the same Wi-Fi network can reach the API.
const expoHostUri = Constants.expoConfig?.hostUri
  || Constants.expoConfig?.extra?.expoClient?.hostUri
  || Constants.manifest2?.extra?.expoClient?.hostUri
  || Constants.manifest?.hostUri;
const expoHost = expoHostUri?.split(':')[0];
const deviceDefaultUrl = expoHost
  ? `http://${expoHost}:5000`
  : (Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000');
const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || deviceDefaultUrl).replace(/\/$/, '');

const formatHistoryTime = (value) => value ? new Date(value).toLocaleString() : 'Just now';
const normalizeRequest = (item) => ({
  ...item,
  code: item.code || item.requestCode,
  department: item.department || item.departmentName,
  serviceTitle: item.serviceTitle || item.serviceName,
  assignedTo: item.assignedStaffName || item.assignedTo || null,
  history: item.history?.map((entry) => ({
    ...entry,
    step: entry.step || entry.newStatus?.replace('_', ' ') || 'Request updated',
    time: entry.time || formatHistoryTime(entry.changedAt),
  })),
});
const normalizeNotification = (item) => ({ ...item, read: item.read ?? item.isRead ?? false, time: item.time || (item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now') });

// Do not use URLSearchParams here. Some Expo Go/Hermes versions do not expose
// it globally, which can crash the app as soon as the home screen loads.
const toQueryString = (params = {}) => Object.entries(params)
  .filter(([, value]) => value !== undefined && value !== null && value !== '')
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
  .join('&');

let authToken = null;
let currentUser = { ...mockUser };

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => authToken;
export const getCurrentUser = () => currentUser;
export const getApiBaseUrl = () => BASE_URL;

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const json = await res.json();
    return { ...json, status: res.status };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[API Client] Fallback for ${endpoint}:`, err.message);
    return null;
  }
}

// Auth API
export const apiLogin = async (emailOrRollNo, password) => {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrRollNo, password }),
  });

  if (res && res.success && res.data?.token) {
    authToken = res.data.token;
    if (res.data.user) currentUser = res.data.user;
    return { success: true, data: res.data, isLive: true };
  }

  if (res) {
    return { success: false, message: res.message || 'Sign in failed. Please check your credentials.' };
  }

  return {
    success: false,
    data: null,
    isLive: false,
    message: `Cannot reach the API at ${BASE_URL}. Check EXPO_PUBLIC_API_URL and that the backend is running.`,
  };
};

export const apiRegister = async (studentData) => {
  const res = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(studentData),
  });

  if (res && res.success) {
    if (res.data?.token) authToken = res.data.token;
    if (res.data?.user) currentUser = res.data.user;
    return { success: true, data: res.data, isLive: true };
  }

  if (res) return { success: false, message: res.message || 'Registration failed.' };

  return {
    success: false,
    message: `Cannot reach the API at ${BASE_URL}. Check EXPO_PUBLIC_API_URL and that the backend is running.`,
  };
};

export const apiGetMe = async () => {
  const res = await request('/api/auth/me');
  if (res && res.success) {
    currentUser = res.data;
    return { success: true, data: res.data, isLive: true };
  }
  return { success: true, data: currentUser, isLive: false };
};

// Requests API
export const apiGetMineRequests = async (filters = {}) => {
  const query = toQueryString(filters);
  const res = await request(`/api/requests/mine${query ? `?${query}` : ''}`);

  if (res && res.success && res.data) {
    const page = res.data.items || res.data.requests || res.data;
    return { success: true, data: Array.isArray(page) ? page.map(normalizeRequest) : page, isLive: true };
  }

  // Mock filtering
  let data = [...mockRequests];
  if (filters.status && filters.status !== 'all') {
    data = data.filter((r) => r.status === filters.status);
  }
  return { success: true, data, isLive: false };
};

export const apiGetMineSummary = async () => {
  const res = await request('/api/requests/mine/summary');
  if (res && res.success && res.data) {
    return { success: true, data: res.data, isLive: true };
  }
  return { success: true, data: mockStats, isLive: false };
};

// Administration API
export const apiGetAdminDashboard = async () => {
  const res = await request('/api/stats/dashboard');
  if (res && res.success && res.data) return { success: true, data: res.data };
  return { success: false, message: res?.message || 'Could not load the admin dashboard.' };
};

export const apiGetAvailableStaff = async (departmentId) => {
  const query = departmentId ? `?departmentId=${encodeURIComponent(departmentId)}` : '';
  const res = await request(`/api/users/staff${query}`);
  if (res && res.success) return { success: true, data: Array.isArray(res.data) ? res.data : [] };
  return { success: false, message: res?.message || 'Could not load available staff.' };
};

export const apiAssignRequest = async (code, assignedTo) => {
  const res = await request(`/api/requests/${encodeURIComponent(code)}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedTo }),
  });
  if (res && res.success) return { success: true, data: normalizeRequest(res.data) };
  return { success: false, message: res?.message || 'Could not assign this request.' };
};

export const apiAutoAssignRequest = async (code) => {
  const res = await request(`/api/requests/${encodeURIComponent(code)}/auto-assign`, {
    method: 'POST',
  });
  if (res && res.success) return { success: true, data: normalizeRequest(res.data) };
  return { success: false, message: res?.message || 'Could not auto-assign this request.' };
};

export const apiGetStaffQueue = async () => {
  const res = await request('/api/staff/queue');
  if (res && res.success && res.data) return { success: true, data: res.data };
  return { success: false, message: res?.message || 'Could not load your work queue.' };
};

export const apiUpdateRequestStatus = async (code, status, note) => {
  const res = await request(`/api/requests/${encodeURIComponent(code)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, ...(note ? { note } : {}) }),
  });
  if (res && res.success) return { success: true, data: normalizeRequest(res.data) };
  return { success: false, message: res?.message || 'Could not update the request status.' };
};

export const apiCreateRequest = async ({ serviceId, title, description, location, priority }) => {
  const payload = { serviceId, title, description, location, priority };
  const res = await request('/api/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res && res.success && res.data) {
    return { success: true, data: normalizeRequest(res.data), isLive: true };
  }

  if (res) return { success: false, message: res.message || 'Could not submit the request.' };

  // Create local mock ticket
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const newTicket = {
    id: Date.now(),
    code: `SR-2026-${randomNum}`,
    serviceId: Number(serviceId),
    serviceTitle: mockServices.find((s) => s.id === Number(serviceId))?.name || 'General Maintenance',
    title,
    description,
    location: location || 'Campus Grounds',
    status: 'pending',
    priority: priority || 'medium',
    assignedTo: null,
    department: 'CSE',
    createdAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    history: [
      { step: 'Request Submitted', time: 'Just now', note: `Submitted by ${currentUser.name}` },
    ],
  };

  mockRequests.unshift(newTicket);
  return { success: true, data: newTicket, isLive: false };
};

export const apiGetRequestDetail = async (code) => {
  const res = await request(`/api/requests/${code}`);
  if (res && res.success && res.data) {
    return { success: true, data: normalizeRequest(res.data), isLive: true };
  }

  const found = mockRequests.find((r) => r.code === code) || mockRequests[0];
  return { success: true, data: found, isLive: false };
};

export const apiCancelRequest = async (code) => {
  const res = await request(`/api/requests/${code}/cancel`, {
    method: 'PATCH',
  });

  if (res && res.success) {
    return { success: true, isLive: true };
  }

  if (res) return { success: false, message: res.message || 'Could not cancel the request.' };

  const found = mockRequests.find((r) => r.code === code);
  if (found) found.status = 'cancelled';
  return { success: true, isLive: false };
};

// Services API
export const apiGetServices = async () => {
  const res = await request('/api/services');
  if (res && res.success && res.data) {
    const services = res.data.items || res.data.services || res.data;
    return { success: true, data: Array.isArray(services) ? services : [], isLive: true };
  }
  return { success: true, data: mockServices, isLive: false };
};

// Notifications API
export const apiGetNotifications = async () => {
  const res = await request('/api/notifications');
  if (res && res.success && res.data) {
    const page = res.data.items || res.data;
    return { success: true, data: Array.isArray(page) ? page.map(normalizeNotification) : page, isLive: true };
  }
  return { success: true, data: mockNotifications, isLive: false };
};

export const apiMarkAllNotificationsRead = async () => {
  const res = await request('/api/notifications/read-all', {
    method: 'PATCH',
  });
  if (res && res.success) return { success: true, isLive: true };

  mockNotifications.forEach((n) => (n.read = true));
  return { success: true, isLive: false };
};
