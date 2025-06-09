
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
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Calendar, Target } from "lucide-react";

interface RecoveryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSavings: number;
}

const RecoveryReportModal: React.FC<RecoveryReportModalProps> = ({
  isOpen,
  onClose,
  totalSavings
}) => {
  // Mock monthly recovery data
  const monthlyData = [
    { month: "December 2024", prevented: 125, recovered: 47500, target: 50000 },
    { month: "November 2024", prevented: 98, recovered: 38200, target: 45000 },
    { month: "October 2024", prevented: 112, recovered: 42800, target: 45000 },
    { month: "September 2024", prevented: 87, recovered: 33400, target: 40000 },
    { month: "August 2024", prevented: 134, recovered: 51200, target: 45000 },
    { month: "July 2024", prevented: 95, recovered: 36800, target: 40000 }
  ];

  // Category breakdown
  const categoryBreakdown = [
    { category: "Credit Card Fraud", amount: 18500, percentage: 39 },
    { category: "Identity Theft", amount: 12800, percentage: 27 },
    { category: "Account Takeover", amount: 8900, percentage: 19 },
    { category: "Payment Fraud", amount: 4200, percentage: 9 },
    { category: "Other", amount: 3100, percentage: 6 }
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return "bg-finance-success";
    if (percentage >= 80) return "bg-finance-accent";
    return "bg-finance-danger";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-finance-primary" />
            Financial Recovery Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-finance-primary" />
                <span className="text-sm font-medium">Total Recovered</span>
              </div>
              <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">this month</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-finance-success" />
                <span className="text-sm font-medium">Growth</span>
              </div>
              <div className="text-2xl font-bold">+24.3%</div>
              <div className="text-sm text-muted-foreground">vs last month</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-finance-accent" />
                <span className="text-sm font-medium">Target Progress</span>
              </div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">of monthly goal</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-finance-accent" />
                <span className="text-sm font-medium">Avg per Case</span>
              </div>
              <div className="text-2xl font-bold">${(totalSavings / 125).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">recovery amount</div>
            </div>
          </div>

          {/* Monthly Recovery Trends */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Monthly Recovery Trends</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Cases Prevented</TableHead>
                  <TableHead>Amount Recovered</TableHead>
                  <TableHead>Monthly Target</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((row, index) => {
                  const progressPercentage = (row.recovered / row.target) * 100;
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell>{row.prevented}</TableCell>
                      <TableCell className="font-semibold">
                        ${row.recovered.toLocaleString()}
                      </TableCell>
                      <TableCell>${row.target.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={progressPercentage} className="w-20" />
                          <Badge variant={progressPercentage >= 95 ? "default" : "secondary"}>
                            {Math.round(progressPercentage)}%
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Recovery by Category */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recovery by Fraud Category</h3>
            <div className="space-y-3">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-sm font-semibold">${category.amount.toLocaleString()}</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                  <Badge variant="outline" className="ml-3">
                    {category.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecoveryReportModal;
