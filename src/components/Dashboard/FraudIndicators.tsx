
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface FraudFactorType {
  factor: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  value?: number; // Make value optional
}

interface FraudIndicatorsProps {
  factors: FraudFactorType[];
}

const FraudIndicators: React.FC<FraudIndicatorsProps> = ({ factors }) => {
  const COLORS = ["#FF5252", "#FF7043", "#FFCA28", "#66BB6A", "#42A5F5"];
  
  // Transform data for pie chart and add default values if missing
  const pieData = factors.slice(0, 5).map((factor, index) => ({
    name: factor.factor,
    value: factor.value || getDefaultValue(factor.impact), // Use value if exists or calculate based on impact
  }));
  
  // Helper function to get default values based on impact
  const getDefaultValue = (impact: string) => {
    switch (impact) {
      case "High": return 30;
      case "Medium": return 20;
      case "Low": return 10;
      default: return 5;
    }
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-finance-danger";
      case "Medium": return "bg-finance-warning";
      case "Low": return "bg-finance-info";
      default: return "bg-gray-400";
    }
  };
  
  const getProgressValue = (impact: string) => {
    switch (impact) {
      case "High": return 90;
      case "Medium": return 60;
      case "Low": return 30;
      default: return 10;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Indicators</CardTitle>
        <CardDescription>Most common patterns in fraudulent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
            <TabsTrigger value="chart" className="flex-1">Chart View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <ul className="space-y-4">
              {factors.slice(0, 5).map((factor, i) => (
                <li key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${getImpactColor(factor.impact)}`} />
                      <p className="font-medium">{factor.factor}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                      {factor.impact} Impact
                    </span>
                  </div>
                  <Progress value={getProgressValue(factor.impact)} className="h-2" />
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="chart">
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FraudIndicators;
