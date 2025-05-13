
import React from "react";
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  Shield, 
  ShieldCheck 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
          <Shield className="h-5 w-5 text-finance-accent" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">{metrics.fraudRate.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">
                of {metrics.totalTransactions.toLocaleString()} transactions
              </p>
            </div>
            <div className={cn(
              "flex items-center text-xs",
              metrics.currentMonthFraudChange < 0 
                ? "text-finance-success" 
                : "text-finance-danger"
            )}>
              {metrics.currentMonthFraudChange < 0 ? (
                <ArrowDown className="h-3 w-3 mr-1" />
              ) : (
                <ArrowUp className="h-3 w-3 mr-1" />
              )}
              {Math.abs(metrics.currentMonthFraudChange)}% from last month
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fraud Prevented</CardTitle>
          <ShieldCheck className="h-5 w-5 text-finance-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.fraudulentTransactions}</div>
          <p className="text-xs text-muted-foreground">transactions stopped</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Financial Recovery</CardTitle>
          <DollarSign className="h-5 w-5 text-finance-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.savingsFromPrevention.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">saved from fraud attempts</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
