
export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
}

// Get API configuration from localStorage or use defaults
export const getApiConfig = (): ApiConfig => {
  const saved = localStorage.getItem('apiConfig');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    baseUrl: 'http://localhost:3001/api', // Default backend URL
    apiKey: ''
  };
};

// Save API configuration to localStorage
export const saveApiConfig = (config: ApiConfig): void => {
  localStorage.setItem('apiConfig', JSON.stringify(config));
};

// Generic API call function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const config = getApiConfig();
  const url = `${config.baseUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// API functions for fraud detection
export const fraudApi = {
  // Get all transactions
  getTransactions: () => apiCall('/transactions'),
  
  // Get fraud metrics for dashboard
  getMetrics: () => apiCall('/dashboard-metrics'),
  
  // Get fraud alerts
  getAlerts: () => apiCall('/fraud-alerts'),
  
  // Analyze a transaction for fraud
  analyzeTransaction: (transactionData: any) => 
    apiCall('/analyze-transaction', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),
  
  // Get fraud trends data
  getTrends: () => apiCall('/trends'),
  
  // Get weekly fraud data for charts
  getWeeklyData: () => apiCall('/weekly-fraud-data'),
};
