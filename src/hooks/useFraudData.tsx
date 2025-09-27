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

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    }
  };

  // Fetch fraud alerts
  const fetchAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fraud_alerts')
        .select(`
          *,
          transactions!inner(user_id)
        `)
        .eq('transactions.user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    }
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
    updateTransactionStatus
  };
};