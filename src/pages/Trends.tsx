
import React from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Trends = () => {
  // Sample data for charts - Indian dataset
  const monthlyData = [
    { name: "Jan", transactions: 20, frauds: 10 },
    { name: "Feb", transactions: 0, frauds: 0 },
    { name: "Mar", transactions: 0, frauds: 0 },
    { name: "Apr", transactions: 0, frauds: 0 },
    { name: "May", transactions: 0, frauds: 0 },
    { name: "Jun", transactions: 0, frauds: 0 },
    { name: "Jul", transactions: 0, frauds: 0 },
    { name: "Aug", transactions: 0, frauds: 0 },
    { name: "Sep", transactions: 0, frauds: 0 },
    { name: "Oct", transactions: 0, frauds: 0 },
    { name: "Nov", transactions: 0, frauds: 0 },
    { name: "Dec", transactions: 0, frauds: 0 }
  ];

  const fraudCategoryData = [
    { name: "TRANSFER", value: 6 },
    { name: "PAYMENT", value: 2 },
    { name: "CASHOUT", value: 1 },
    { name: "DEBIT", value: 1 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const timeOfDayData = [
    { hour: "00", frauds: 0 },
    { hour: "01", frauds: 0 },
    { hour: "02", frauds: 0 },
    { hour: "03", frauds: 0 },
    { hour: "04", frauds: 0 },
    { hour: "05", frauds: 0 },
    { hour: "06", frauds: 0 },
    { hour: "07", frauds: 0 },
    { hour: "08", frauds: 0 },
    { hour: "09", frauds: 0 },
    { hour: "10", frauds: 1 },
    { hour: "11", frauds: 1 },
    { hour: "12", frauds: 0 },
    { hour: "13", frauds: 2 },
    { hour: "14", frauds: 1 },
    { hour: "15", frauds: 0 },
    { hour: "16", frauds: 2 },
    { hour: "17", frauds: 1 },
    { hour: "18", frauds: 0 },
    { hour: "19", frauds: 0 },
    { hour: "20", frauds: 2 },
    { hour: "21", frauds: 0 },
    { hour: "22", frauds: 0 },
    { hour: "23", frauds: 0 }
  ];

  const volumeByRegionData = [
    { state: "Maharashtra", volume: 3, frauds: 1 },
    { state: "Gujarat", volume: 3, frauds: 1 },
    { state: "Kerala", volume: 2, frauds: 0 },
    { state: "Mizoram", volume: 2, frauds: 2 },
    { state: "Karnataka", volume: 1, frauds: 0 },
    { state: "Delhi", volume: 1, frauds: 0 },
    { state: "Rajasthan", volume: 1, frauds: 1 },
    { state: "West Bengal", volume: 1, frauds: 1 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Trend Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400">Long-term patterns and fraud trends</p>
        </div>

        <Tabs defaultValue="timeline" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="time-patterns">Time Patterns</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Transaction and Fraud Trends</CardTitle>
                <CardDescription>Year-to-date transaction volumes and fraud incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#8884d8" activeDot={{ r: 8 }} name="Transactions" />
                      <Line yAxisId="right" type="monotone" dataKey="frauds" stroke="#e53e3e" name="Fraud Cases" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fraud by Transaction Type</CardTitle>
                  <CardDescription>Distribution of fraud cases across transaction methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fraudCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {fraudCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Merchant Category Risk</CardTitle>
                  <CardDescription>Fraud frequency by merchant category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { category: "Restaurant", count: 4 },
                          { category: "Groceries", count: 3 },
                          { category: "Clothing", count: 3 },
                          { category: "Entertainment", count: 0 },
                          { category: "Utilities", count: 0 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="Fraud Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="time-patterns">
            <Card>
              <CardHeader>
                <CardTitle>Fraud by Time of Day</CardTitle>
                <CardDescription>Hourly distribution of fraudulent transaction attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeOfDayData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="frauds" stroke="#8884d8" fill="#8884d8" name="Fraud Attempts" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="geographic">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume by Region</CardTitle>
                <CardDescription>Geographic distribution of transactions and fraud cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={volumeByRegionData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="state" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="volume" fill="#8884d8" name="Transaction Volume" />
                      <Bar dataKey="frauds" fill="#e53e3e" name="Fraud Cases" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Trends;
