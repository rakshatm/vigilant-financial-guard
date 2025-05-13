
import React, { useState } from "react";
import { 
  AlertCircle, 
  Check, 
  ChevronDown,
  Clock, 
  Filter, 
  Search, 
  XCircle 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/utils/demoData";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: TransactionType[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<"All" | "High" | "Medium" | "Low">("All");

  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch = 
      searchTerm === "" || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.customerName && transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Risk filter
    const matchesRisk = riskFilter === "All" || transaction.risk === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                {riskFilter}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Risk Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRiskFilter("All")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRiskFilter("High")}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRiskFilter("Medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRiskFilter("Low")}>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className={cn(
                transaction.risk === "High" ? "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30" : ""
              )}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{transaction.date}</span>
                    <span className="text-xs text-muted-foreground">{transaction.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{transaction.currency} {transaction.amount.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">{transaction.merchantCategory}</span>
                  </div>
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(transaction.status)}
                    <span>{transaction.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRiskBadgeVariant(transaction.risk)}>
                    {transaction.risk} ({Math.round(transaction.fraudProbability * 100)}%)
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionList;
