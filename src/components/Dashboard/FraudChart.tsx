
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface FraudChartProps {
  data: {
    name: string;
    fraudCount: number;
    legitCount: number;
  }[];
}

const FraudChart: React.FC<FraudChartProps> = ({ data }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Transaction Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
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
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "fraudCount") return [`${value} Fraudulent`, "Fraudulent"];
                  return [`${value} Legitimate`, "Legitimate"];
                }}
              />
              <Legend />
              <Bar 
                dataKey="legitCount" 
                name="Legitimate" 
                stackId="a" 
                fill="#3182ce" 
              />
              <Bar 
                dataKey="fraudCount" 
                name="Fraudulent" 
                stackId="a" 
                fill="#e53e3e" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudChart;
