import { useState, useEffect } from 'react';
import { apiGetMe, apiLogin, apiRegister, getCurrentUser } from '../api/client';
import { mockUser } from '../data/mockData';

export function useAuth() {
  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const res = await apiGetMe();
      if (isMounted) {
        if (res && res.data) {
          setUser(res.data);
          setIsLiveBackend(!!res.isLive);
        }
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (emailOrRollNo, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(emailOrRollNo, password);
      if (res.success) {
        setUser(res.data.user || getCurrentUser());
        setIsLiveBackend(!!res.isLive);
        setLoading(false);
        return { success: true };
      } else {
        setError(res.message || 'Login failed');
        setLoading(false);
        return { success: false, message: res.message };
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  const register = async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRegister(studentData);
      if (res.success) {
        setUser(res.data.user || getCurrentUser());
        setIsLiveBackend(!!res.isLive);
        setLoading(false);
        return { success: true };
      } else {
        setError(res.message || 'Registration failed');
        setLoading(false);
        return { success: false, message: res.message };
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  return {
    user,
    loading,
    error,
    isLiveBackend,
    login,
    register,
  };
}
