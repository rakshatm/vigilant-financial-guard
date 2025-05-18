import React, { useState } from "react";
import Header from "@/components/Header";
import StatCards from "@/components/Dashboard/StatCards";
import TransactionList from "@/components/Dashboard/TransactionList";
import FraudChart from "@/components/Dashboard/FraudChart";
import FraudIndicators, { FraudFactorType } from "@/components/Dashboard/FraudIndicators";
import TransactionAnalyzer from "@/components/TransactionAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, RefreshCw } from "lucide-react";
import { mockTransactions, fraudMetrics, weeklyFraudData, fraudFactors } from "@/utils/demoData";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

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
              <span>Last updated: May 13, 2025, 10:45 AM</span>
            </div>
            <Button 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Badge className="bg-finance-accent text-white mb-2">Dashboard Overview</Badge>
          <StatCards metrics={fraudMetrics} />
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analyzer">Transaction Analyzer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-8">            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FraudChart data={weeklyFraudData} />
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
            
            <TransactionList transactions={mockTransactions.slice(0, 5)} />
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
