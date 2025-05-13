
import React from "react";
import Header from "@/components/Header";
import TransactionList from "@/components/Dashboard/TransactionList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTransactions } from "@/utils/demoData";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Transactions = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
            <p className="text-gray-500 dark:text-gray-400">Review and analyze recent transactions</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 lg:mt-0 w-full lg:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={mockTransactions} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Transactions;
