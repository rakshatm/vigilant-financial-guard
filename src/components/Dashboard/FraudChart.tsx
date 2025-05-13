
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface FraudChartProps {
  data: {
    name: string;
    fraudCount: number;
    legitCount: number;
  }[];
}

const FraudChart: React.FC<FraudChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  
  // Calculate percentages for trend visualization
  const percentageData = data.map(item => ({
    name: item.name,
    fraudPercent: (item.fraudCount / (item.fraudCount + item.legitCount)) * 100,
    totalTransactions: item.fraudCount + item.legitCount
  }));
  
  // Render the appropriate chart based on the selected type
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar 
                dataKey="legitCount" 
                name="Legitimate" 
                stackId="a" 
                fill="var(--color-legitimate)" 
              />
              <Bar 
                dataKey="fraudCount" 
                name="Fraudulent" 
                stackId="a" 
                fill="var(--color-fraudulent)" 
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={percentageData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="fraudPercent" 
                name="Fraud %" 
                stroke="var(--color-fraudPercent)" 
                activeDot={{ r: 8 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="totalTransactions" 
                name="Total Transactions" 
                stroke="var(--color-totalTransactions)" 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="legitCount" 
                name="Legitimate" 
                stackId="1" 
                stroke="var(--color-legitimate)" 
                fill="var(--color-legitimate)" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="fraudCount" 
                name="Fraudulent" 
                stackId="1" 
                stroke="var(--color-fraudulent)" 
                fill="var(--color-fraudulent)" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Transaction Analysis</CardTitle>
          <CardDescription>Weekly pattern of transactions by type</CardDescription>
        </div>
        <Tabs defaultValue="bar" className="w-[200px]" onValueChange={(value) => setChartType(value as 'bar' | 'line' | 'area')}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ChartContainer 
            config={{
              legitimate: {
                label: "Legitimate",
                color: "#3182ce"
              },
              fraudulent: {
                label: "Fraudulent",
                color: "#e53e3e"
              },
              fraudPercent: {
                label: "Fraud %",
                color: "#805ad5"
              },
              totalTransactions: {
                label: "Total Transactions",
                color: "#38a169"
              }
            }}
          >
            {renderChart()}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudChart;
