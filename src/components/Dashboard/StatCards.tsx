
import React, { useState } from "react";
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  Shield, 
  ShieldCheck,
  Info 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import FraudDetailsModal from "./FraudDetailsModal";
import RecoveryReportModal from "./RecoveryReportModal";

interface StatCardsProps {
  metrics: {
    totalTransactions: number;
    fraudulentTransactions: number;
    fraudRate: number;
    avgFraudAmount: number;
    savingsFromPrevention: number;
    currentMonthFraudChange: number;
  };
}

const StatCards: React.FC<StatCardsProps> = ({ metrics }) => {
  const [showFraudDetails, setShowFraudDetails] = useState(false);
  const [showRecoveryReport, setShowRecoveryReport] = useState(false);
  
  const trendDelta = metrics.currentMonthFraudChange;
  const isPositive = trendDelta < 0;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className={cn(
            "absolute h-2 top-0 inset-x-0",
            isPositive ? "bg-finance-success" : "bg-finance-danger"
          )} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Detection Rate</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Percentage of transactions flagged as fraudulent out of total transactions processed this month
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold">{metrics.fraudRate.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  of {metrics.totalTransactions.toLocaleString()} transactions
                </p>
              </div>
              <div className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-finance-success" : "text-finance-danger"
              )}>
                {isPositive ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUp className="h-3 w-3 mr-1" />
                )}
                {Math.abs(metrics.currentMonthFraudChange).toFixed(1)}% from last month
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="bg-finance-accent h-full rounded-full" 
                style={{ width: `${Math.min(metrics.fraudRate * 5, 100)}%` }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="absolute h-2 top-0 inset-x-0 bg-finance-success" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Prevented</CardTitle>
            <Shield className="h-5 w-5 text-finance-success" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{metrics.fraudulentTransactions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">transactions</div>
            </div>
            <div className="mt-1">
              <p className="text-xs text-muted-foreground">Average amount: ₹{metrics.avgFraudAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => setShowFraudDetails(true)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="absolute h-2 top-0 inset-x-0 bg-finance-primary" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Recovery</CardTitle>
            <DollarSign className="h-5 w-5 text-finance-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">₹{metrics.savingsFromPrevention.toLocaleString('en-IN')}</div>
              <div className="text-sm text-muted-foreground">saved</div>
            </div>
            <div className="mt-1">
              <p className="text-xs text-muted-foreground">from fraud attempts this month</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => setShowRecoveryReport(true)}
              >
                Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <FraudDetailsModal
        isOpen={showFraudDetails}
        onClose={() => setShowFraudDetails(false)}
        fraudCount={metrics.fraudulentTransactions}
        avgAmount={metrics.avgFraudAmount}
      />

      <RecoveryReportModal
        isOpen={showRecoveryReport}
        onClose={() => setShowRecoveryReport(false)}
        totalSavings={metrics.savingsFromPrevention}
      />
    </>
  );
};

export default StatCards;
