import { Transaction } from '@/hooks/useFraudData';
import { TransactionType } from './demoData';

/**
 * Converts Supabase Transaction to the UI TransactionType format
 */
export const adaptTransaction = (transaction: Transaction): TransactionType => {
  const date = new Date(transaction.timestamp);
  
  // Map status to UI format
  const statusMap: Record<Transaction['status'], 'Approved' | 'Rejected' | 'Pending'> = {
    'approved': 'Approved',
    'blocked': 'Rejected',
    'flagged': 'Pending',
    'pending': 'Pending'
  };

  // Map risk_level to UI format
  const riskMap: Record<Transaction['risk_level'], 'High' | 'Medium' | 'Low'> = {
    'critical': 'High',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low'
  };

  return {
    id: transaction.transaction_id,
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
    amount: Number(transaction.amount),
    currency: 'USD',
    type: transaction.category,
    merchantCategory: transaction.merchant,
    status: statusMap[transaction.status],
    risk: riskMap[transaction.risk_level],
    fraudProbability: transaction.fraud_score,
    device: 'Web',
    location: transaction.location || 'Unknown',
    customerName: undefined,
    accountBalance: 0 // Not tracked in current schema
  };
};

/**
 * Converts an array of Supabase Transactions to UI TransactionType format
 */
export const adaptTransactions = (transactions: Transaction[]): TransactionType[] => {
  return transactions.map(adaptTransaction);
};
