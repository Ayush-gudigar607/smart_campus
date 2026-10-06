import { useState, useEffect, useCallback } from 'react';
import {
  apiGetMineRequests,
  apiGetMineSummary,
  apiCreateRequest,
  apiCancelRequest,
} from '../api/client';
import { mockStats } from '../data/mockData';

export function useRequests(initialStatus = 'all') {
  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState(mockStats);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const fetchRequests = useCallback(async (status) => {
    setLoading(true);
    const filter = status && status !== 'all' ? { status } : {};
    const [reqRes, sumRes] = await Promise.all([
      apiGetMineRequests(filter),
      apiGetMineSummary(),
    ]);

    if (reqRes && reqRes.success) {
      setRequests(reqRes.data);
      setIsLive(reqRes.isLive);
    }
    if (sumRes && sumRes.success) {
      setSummary(sumRes.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests(statusFilter);
  }, [statusFilter, fetchRequests]);

  const refresh = async () => {
    setRefreshing(true);
    await fetchRequests(statusFilter);
    setRefreshing(false);
  };

  const createRequest = async (payload) => {
    const res = await apiCreateRequest(payload);
    if (res.success) {
      await fetchRequests(statusFilter);
      return { success: true, data: res.data };
    }
    return { success: false, message: res.message };
  };

  const cancelRequest = async (code) => {
    const res = await apiCancelRequest(code);
    if (res.success) {
      await fetchRequests(statusFilter);
      return { success: true };
    }
    return { success: false };
  };

  return {
    requests,
    summary,
    statusFilter,
    setStatusFilter,
    loading,
    refreshing,
    isLive,
    refresh,
    createRequest,
    cancelRequest,
  };
}
