
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Shield, Calendar, DollarSign } from "lucide-react";

interface FraudDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fraudCount: number;
  avgAmount: number;
}

const FraudDetailsModal: React.FC<FraudDetailsModalProps> = ({
  isOpen,
  onClose,
  fraudCount,
  avgAmount
}) => {
  // Mock detailed fraud transaction data
  const fraudTransactions = [
    {
      id: "TXN-2024-001",
      date: "2024-12-09",
      time: "14:32",
      amount: 2450.00,
      merchant: "Online Electronics Store",
      reason: "Velocity fraud - multiple cards",
      riskScore: 95,
      status: "Blocked"
    },
    {
      id: "TXN-2024-002", 
      date: "2024-12-09",
      time: "11:18",
      amount: 850.00,
      merchant: "ATM Withdrawal",
      reason: "Geolocation anomaly",
      riskScore: 88,
      status: "Blocked"
    },
    {
      id: "TXN-2024-003",
      date: "2024-12-08",
      time: "22:45", 
      amount: 1200.00,
      merchant: "Gas Station",
      reason: "Unusual spending pattern",
      riskScore: 82,
      status: "Blocked"
    },
    {
      id: "TXN-2024-004",
      date: "2024-12-08",
      time: "16:22",
      amount: 3200.00,
      merchant: "Luxury Retailer",
      reason: "High-value transaction",
      riskScore: 91,
      status: "Reviewed"
    },
    {
      id: "TXN-2024-005",
      date: "2024-12-07",
      time: "09:15",
      amount: 450.00,
      merchant: "Online Marketplace",
      reason: "Device fingerprint mismatch",
      riskScore: 76,
      status: "Blocked"
    }
  ];

  const getRiskBadgeColor = (score: number) => {
    if (score >= 90) return "destructive";
    if (score >= 80) return "secondary";
    return "outline";
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === "Blocked") return "destructive";
    if (status === "Reviewed") return "secondary";
    return "outline";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-finance-success" />
            Fraud Prevention Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-finance-danger" />
                <span className="text-sm font-medium">Total Prevented</span>
              </div>
              <div className="text-2xl font-bold">{fraudCount}</div>
              <div className="text-sm text-muted-foreground">transactions</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-finance-primary" />
                <span className="text-sm font-medium">Average Amount</span>
              </div>
              <div className="text-2xl font-bold">${avgAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">per transaction</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-finance-accent" />
                <span className="text-sm font-medium">Time Period</span>
              </div>
              <div className="text-2xl font-bold">7</div>
              <div className="text-sm text-muted-foreground">days</div>
            </div>
          </div>

          {/* Detailed Transaction Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Fraud Attempts</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Fraud Reason</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fraudTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.date}</div>
                        <div className="text-sm text-muted-foreground">{transaction.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.merchant}</TableCell>
                    <TableCell>
                      <span className="text-sm">{transaction.reason}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeColor(transaction.riskScore)}>
                        {transaction.riskScore}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FraudDetailsModal;
