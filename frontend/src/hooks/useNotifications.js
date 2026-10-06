import { useState, useEffect } from 'react';
import { apiGetNotifications, apiMarkAllNotificationsRead } from '../api/client';
import { mockNotifications } from '../data/mockData';

export function useNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await apiGetNotifications();
    if (res && res.success) {
      setNotifications(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    await apiMarkAllNotificationsRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
  };
}
