import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

export interface Transaction {
  id: string;
  transaction_id: string;
  amount: number;
  merchant: string;
  category: string;
  location?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'blocked' | 'flagged';
  fraud_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface FraudAlert {
  id: string;
  transaction_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'active' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface FraudMetrics {
  totalTransactions: number;
  fraudulentTransactions: number;
  fraudRate: number;
  avgFraudAmount: number;
  savingsFromPrevention: number;
  currentMonthFraudChange: number;
}

export const useFraudData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [metrics, setMetrics] = useState<FraudMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  // Fetch transactions from fraud detection table
  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fraud detection')
        .select('*')
        .limit(50);

      if (error) throw error;
      
      // Map fraud detection data to Transaction interface
      const mappedTransactions: Transaction[] = (data || []).map((item: any, index: number) => {
        const isFraud = item.Is_Fraud === 1;
        const amount = item.Transaction_Amount || 0;
        
        // Determine risk level based on Is_Fraud and amount
        let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
        let fraudScore = 0;
        
        if (isFraud) {
          if (amount > 50000) {
            riskLevel = 'critical';
            fraudScore = 0.95;
          } else if (amount > 20000) {
            riskLevel = 'high';
            fraudScore = 0.8;
          } else {
            riskLevel = 'medium';
            fraudScore = 0.6;
          }
        } else {
          fraudScore = Math.random() * 0.3; // Low fraud score for legitimate transactions
        }
        
        // Determine status based on Is_Fraud
        const status: 'pending' | 'approved' | 'blocked' | 'flagged' = isFraud 
          ? (amount > 30000 ? 'blocked' : 'flagged')
          : 'approved';

        return {
          id: `fd-${index}-${item.Transaction_ID || index}`,
          transaction_id: item.Transaction_ID || `TXN-${index}`,
          amount: amount,
          merchant: item.Transaction_Description || item.Merchant_Category || 'Unknown',
          category: item.Merchant_Category || 'General',
          location: item.Transaction_Location || `${item.City || ''}, ${item.State || ''}`.trim() || 'Unknown',
          timestamp: item.Transaction_Date && item.Transaction_Time 
            ? `${item.Transaction_Date} ${item.Transaction_Time}` 
            : new Date().toISOString(),
          status,
          fraud_score: fraudScore,
          risk_level: riskLevel
        };
      });
      
      setTransactions(mappedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    }
  };

  // Fetch fraud alerts from the new fraud_alerts table
  const fetchAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fraud_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts((data || []) as FraudAlert[]);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    }
  };

  // Create a new fraud alert
  const createAlert = async (alertData: Omit<FraudAlert, 'id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('fraud_alerts')
      .insert([{
        ...alertData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    await fetchAlerts();
    return data;
  };

  // Update alert status
  const updateAlertStatus = async (alertId: string, status: FraudAlert['status']) => {
    const { error } = await supabase
      .from('fraud_alerts')
      .update({ status })
      .eq('id', alertId)
      .eq('user_id', user?.id);

    if (error) throw error;
    await fetchAlerts();
  };

  // Calculate metrics
  const calculateMetrics = (transactionData: Transaction[]): FraudMetrics => {
    const totalTransactions = transactionData.length;
    const fraudulentTransactions = transactionData.filter(t => 
      t.status === 'blocked' || t.status === 'flagged'
    ).length;
    
    const fraudRate = totalTransactions > 0 ? (fraudulentTransactions / totalTransactions) * 100 : 0;
    
    const fraudAmounts = transactionData
      .filter(t => t.status === 'blocked' || t.status === 'flagged')
      .map(t => t.amount);
    
    const avgFraudAmount = fraudAmounts.length > 0 
      ? fraudAmounts.reduce((sum, amount) => sum + amount, 0) / fraudAmounts.length 
      : 0;

    const savingsFromPrevention = fraudAmounts.reduce((sum, amount) => sum + amount, 0);

    // Mock monthly change for now
    const currentMonthFraudChange = -2.3;

    return {
      totalTransactions,
      fraudulentTransactions,
      fraudRate,
      avgFraudAmount,
      savingsFromPrevention,
      currentMonthFraudChange
    };
  };

  // Load all data
  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchTransactions(),
        fetchAlerts()
      ]);
    } catch (err) {
      console.error('Error loading fraud data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update metrics when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      setMetrics(calculateMetrics(transactions));
    }
  }, [transactions]);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTransactions([]);
      setAlerts([]);
      setMetrics(null);
      setLoading(false);
    }
  }, [user]);

  // Create a new transaction
  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transactionData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Refresh transactions
    await fetchTransactions();
    
    return data;
  };

  // Update transaction status
  const updateTransactionStatus = async (transactionId: string, status: Transaction['status']) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', transactionId)
      .eq('user_id', user?.id);

    if (error) throw error;
    
    // Refresh transactions
    await fetchTransactions();
  };

  return {
    transactions,
    alerts,
    metrics,
    loading,
    error,
    refreshData: loadData,
    createTransaction,
    updateTransactionStatus,
    createAlert,
    updateAlertStatus
  };
};