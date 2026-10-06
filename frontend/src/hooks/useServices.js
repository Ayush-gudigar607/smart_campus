import { useCallback, useEffect, useState } from 'react';
import { apiGetServices } from '../api/client';
import { mockServices } from '../data/mockData';

export function useServices() {
  const [services, setServices] = useState(mockServices);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const result = await apiGetServices();
    if (result.success) {
      setServices(result.data);
      setIsLive(!!result.isLive);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, isLive, refresh: fetchServices };
}
