
import React from "react";
import Header from "@/components/Header";
import StatCards from "@/components/Dashboard/StatCards";
import TransactionList from "@/components/Dashboard/TransactionList";
import FraudChart from "@/components/Dashboard/FraudChart";
import TransactionAnalyzer from "@/components/TransactionAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTransactions, fraudMetrics, weeklyFraudData, fraudFactors } from "@/utils/demoData";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Fraud Detection Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Real-time transaction monitoring and ML-powered analysis</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <span className="text-sm">Last updated: May 13, 2025, 10:45 AM</span>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analyzer">Transaction Analyzer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-8">
            <StatCards metrics={fraudMetrics} />
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FraudChart data={weeklyFraudData} />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Fraud Indicators</CardTitle>
                  <CardDescription>Most common patterns in fraudulent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {fraudFactors.slice(0, 5).map((factor, i) => (
                      <li key={i} className="flex items-start">
                        <span className={`inline-block w-2 h-2 mt-1.5 mr-2 rounded-full ${
                          factor.impact === "High" 
                            ? "bg-finance-danger" 
                            : factor.impact === "Medium" 
                            ? "bg-finance-warning" 
                            : "bg-finance-info"
                        }`} />
                        <div>
                          <p className="font-medium">{factor.factor}</p>
                          <p className="text-xs text-muted-foreground">{factor.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <TransactionList transactions={mockTransactions} />
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
