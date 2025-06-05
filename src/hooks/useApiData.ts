
import { useState, useEffect } from 'react';
import { fraudApi } from '@/utils/api';
import { mockTransactions, fraudMetrics, weeklyFraudData } from '@/utils/demoData';

export const useApiData = () => {
  const [useRealApi, setUseRealApi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if API is configured
  useEffect(() => {
    const config = localStorage.getItem('apiConfig');
    if (config) {
      const parsed = JSON.parse(config);
      setUseRealApi(parsed.baseUrl !== 'http://localhost:3001/api' || Boolean(parsed.apiKey));
    }
  }, []);

  const fetchData = async (apiFunction: () => Promise<any>, fallbackData: any) => {
    if (!useRealApi) {
      return fallbackData;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiFunction();
      return data;
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to mock data on error
      return fallbackData;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactions = () => fetchData(fraudApi.getTransactions, mockTransactions);
  const getMetrics = () => fetchData(fraudApi.getMetrics, fraudMetrics);
  const getWeeklyData = () => fetchData(fraudApi.getWeeklyData, weeklyFraudData);

  return {
    useRealApi,
    isLoading,
    error,
    getTransactions,
    getMetrics,
    getWeeklyData,
    analyzeTransaction: fraudApi.analyzeTransaction,
  };
};
