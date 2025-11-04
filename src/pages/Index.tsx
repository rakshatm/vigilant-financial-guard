
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import StatCards from "@/components/Dashboard/StatCards";
import TransactionList from "@/components/Dashboard/TransactionList";
import FraudChart from "@/components/Dashboard/FraudChart";
import FraudIndicators, { FraudFactorType } from "@/components/Dashboard/FraudIndicators";
import LiveTransactionFeed from "@/components/Dashboard/LiveTransactionFeed";
import FraudAlertSystem from "@/components/Dashboard/FraudAlertSystem";
import TransactionAnalyzer from "@/components/TransactionAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, RefreshCw, Database } from "lucide-react";
import { fraudFactors } from "@/utils/demoData";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFraudData } from "@/hooks/useFraudData";
import { adaptTransactions } from "@/utils/transactionAdapter";
import { mockTransactions, fraudMetrics, weeklyFraudData } from "@/utils/demoData";

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState("");
  const { transactions: supabaseTransactions, metrics: supabaseMetrics, loading, error, refreshData } = useFraudData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use Supabase data if available, otherwise fall back to demo data
  const transactions = supabaseTransactions.length > 0 ? supabaseTransactions : [];
  const metrics = supabaseMetrics || fraudMetrics;

  // Convert Supabase transactions to UI format, with demo data as fallback
  const adaptedTransactions = React.useMemo(() => {
    // If we have Supabase transactions, adapt them
    if (transactions.length > 0) {
      return adaptTransactions(transactions);
    }
    // Otherwise use demo data which is already in the correct format
    return mockTransactions;
  }, [transactions]);

  const updateTimestamp = () => {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    setLastUpdated(formatted);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    updateTimestamp();
    setIsRefreshing(false);
  };

  useEffect(() => {
    updateTimestamp();
  }, []);

  // Calculate weekly data from adapted transactions for the chart
  const weeklyData = React.useMemo(() => {
    // If we have Supabase transactions, calculate from them
    if (transactions.length > 0) {
      const dayMap = new Map();
      transactions.forEach(t => {
        const day = new Date(t.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
        if (!dayMap.has(day)) {
          dayMap.set(day, { name: day, fraudCount: 0, legitCount: 0 });
        }
        const data = dayMap.get(day);
        if (t.status === 'blocked' || t.status === 'flagged') {
          data.fraudCount++;
        } else {
          data.legitCount++;
        }
      });
      return Array.from(dayMap.values());
    }
    
    // Otherwise use demo weekly data
    return weeklyFraudData;
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Fraud Detection Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Real-time transaction monitoring and ML-powered analysis</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center text-sm">
              <Database className="h-4 w-4 mr-1" />
              <Badge variant="default">
                Live Data
              </Badge>
            </div>
            <Button 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${(isRefreshing || loading) ? 'animate-spin' : ''}`} />
              <span>{(isRefreshing || loading) ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertDescription>
              Error loading data: {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <Badge className="bg-finance-accent text-white mb-2">Dashboard Overview</Badge>
          {metrics && <StatCards metrics={metrics} />}
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analyzer">Transaction Analyzer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-8">            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FraudChart data={weeklyData} />
              </div>
              
              <FraudIndicators factors={fraudFactors as FraudFactorType[]} />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <Button variant="ghost" className="text-sm flex items-center">
                <span>View All Transactions</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-8">
              <FraudAlertSystem />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <TransactionList transactions={adaptedTransactions.slice(0, 5)} />
              </div>
              <div>
                <LiveTransactionFeed initialTransactions={adaptedTransactions} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analyzer">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">ML Transaction Analyzer</h2>
                <p className="text-muted-foreground">
                  Test our machine learning model by inputting transaction details and see the fraud risk assessment in real-time.
                </p>
              </div>
              
              <TransactionAnalyzer />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
