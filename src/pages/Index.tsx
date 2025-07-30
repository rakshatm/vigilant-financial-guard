
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import StatCards from "@/components/Dashboard/StatCards";
import TransactionList from "@/components/Dashboard/TransactionList";
import FraudChart from "@/components/Dashboard/FraudChart";
import FraudIndicators, { FraudFactorType } from "@/components/Dashboard/FraudIndicators";
import LiveTransactionFeed from "@/components/Dashboard/LiveTransactionFeed";
import TransactionAnalyzer from "@/components/TransactionAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, RefreshCw, Database } from "lucide-react";
import { fraudFactors } from "@/utils/demoData";
import { Badge } from "@/components/ui/badge";
import { useApiData } from "@/hooks/useApiData";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  
  const { useRealApi, isLoading, error, getTransactions, getMetrics, getWeeklyData } = useApiData();

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

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [transactionData, metricsData, weeklyChartData] = await Promise.all([
        getTransactions(),
        getMetrics(),
        getWeeklyData()
      ]);
      
      setTransactions(transactionData);
      setMetrics(metricsData);
      setWeeklyData(weeklyChartData);
      updateTimestamp();
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    updateTimestamp();
    loadData();
  }, [useRealApi]);

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
              <Badge variant={useRealApi ? "default" : "secondary"}>
                {useRealApi ? "Live API" : "Demo Data"}
              </Badge>
            </div>
            <Button 
              size="sm" 
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertDescription>
              API connection failed: {error}. Showing demo data instead.
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
                {weeklyData.length > 0 && <FraudChart data={weeklyData} />}
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
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                {transactions.length > 0 && (
                  <TransactionList transactions={transactions.slice(0, 5)} />
                )}
              </div>
              <div>
                <LiveTransactionFeed initialTransactions={transactions} />
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
