import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  AlertCircle, 
  Check, 
  Clock, 
  Pause, 
  Play, 
  XCircle 
} from "lucide-react";
import { TransactionType } from "@/utils/demoData";
import { cn } from "@/lib/utils";

interface LiveTransactionFeedProps {
  initialTransactions?: TransactionType[];
}

const LiveTransactionFeed: React.FC<LiveTransactionFeedProps> = ({ 
  initialTransactions = [] 
}) => {
  const [transactions, setTransactions] = useState<TransactionType[]>(
    initialTransactions.slice(0, 8)
  );
  const [isLive, setIsLive] = useState(true);
  const [newTransactionIds, setNewTransactionIds] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout>();

  // Generate a random transaction
  const generateRandomTransaction = (): TransactionType => {
    const amounts = [150, 275, 89, 450, 1200, 75, 890, 325, 2100, 67];
    const types = ["Online", "Card", "Wire Transfer", "ATM"];
    const merchants = ["Amazon", "Starbucks", "Shell Gas", "Target", "Best Buy", "McDonald's"];
    const currencies = ["USD", "EUR", "GBP"];
    const risks = ["High", "Medium", "Low"] as const;
    const statuses = ["Approved", "Rejected", "Pending"] as const;
    const devices = ["Mobile", "Desktop", "Tablet", "ATM"];
    const locations = ["Same City", "Different State", "International", "Unusual Location"];
    
    const now = new Date();
    const id = `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    
    return {
      id,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount,
      type: types[Math.floor(Math.random() * types.length)],
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      merchantCategory: merchants[Math.floor(Math.random() * merchants.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      accountBalance: Math.floor(Math.random() * 10000) + amount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      risk: risks[Math.floor(Math.random() * risks.length)],
      fraudProbability: Math.random(),
      customerName: `Customer ${Math.floor(Math.random() * 1000)}`
    };
  };

  // Add new transaction with animation
  const addNewTransaction = () => {
    if (!isLive) return;
    
    const newTransaction = generateRandomTransaction();
    setNewTransactionIds(prev => new Set([...prev, newTransaction.id]));
    
    setTransactions(prev => {
      const updated = [newTransaction, ...prev.slice(0, 7)];
      return updated;
    });

    // Remove the "new" highlight after animation
    setTimeout(() => {
      setNewTransactionIds(prev => {
        const updated = new Set(prev);
        updated.delete(newTransaction.id);
        return updated;
      });
    }, 2000);
  };

  // Auto-refresh effect
  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(addNewTransaction, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  const getRiskBadgeVariant = (risk: "High" | "Medium" | "Low") => {
    switch (risk) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "default";
    }
  };

  const getStatusIcon = (status: "Approved" | "Rejected" | "Pending") => {
    switch (status) {
      case "Approved": 
        return <Check className="h-4 w-4 text-finance-success" />;
      case "Rejected": 
        return <XCircle className="h-4 w-4 text-finance-danger" />;
      case "Pending": 
        return <Clock className="h-4 w-4 text-finance-warning" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={cn(
              "h-5 w-5",
              isLive ? "text-finance-success animate-pulse" : "text-muted-foreground"
            )} />
            <CardTitle>Live Transaction Feed</CardTitle>
            {isLive && (
              <Badge variant="secondary" className="bg-finance-success/20 text-finance-success">
                LIVE
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            {isLive ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={cn(
                "p-3 rounded-lg border transition-all duration-500",
                newTransactionIds.has(transaction.id) 
                  ? "animate-fade-in bg-primary/5 border-primary shadow-md" 
                  : "bg-card hover:bg-muted/50",
                transaction.risk === "High" && "bg-red-50 dark:bg-red-900/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{transaction.id}</span>
                    <Badge variant={getRiskBadgeVariant(transaction.risk)} className="text-xs">
                      {transaction.risk}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{transaction.currency} {transaction.amount.toLocaleString()}</span>
                    <span>{transaction.merchantCategory}</span>
                    <span>{transaction.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(transaction.status)}
                    <span className="text-xs">{transaction.status}</span>
                  </div>
                  {transaction.risk === "High" && (
                    <AlertCircle className="h-4 w-4 text-finance-danger" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!isLive && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Feed paused - Click Resume to continue receiving live transactions
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveTransactionFeed;