
import React from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Trends = () => {
  // Sample data for charts
  const monthlyData = [
    { name: "Jan", transactions: 420, frauds: 18 },
    { name: "Feb", transactions: 380, frauds: 22 },
    { name: "Mar", transactions: 450, frauds: 25 },
    { name: "Apr", transactions: 520, frauds: 32 },
    { name: "May", transactions: 480, frauds: 28 },
    { name: "Jun", transactions: 550, frauds: 30 },
    { name: "Jul", transactions: 590, frauds: 34 },
    { name: "Aug", transactions: 610, frauds: 38 },
    { name: "Sep", transactions: 560, frauds: 36 },
    { name: "Oct", transactions: 590, frauds: 40 },
    { name: "Nov", transactions: 640, frauds: 42 },
    { name: "Dec", transactions: 710, frauds: 48 }
  ];

  const fraudCategoryData = [
    { name: "Online", value: 42 },
    { name: "In-Store", value: 28 },
    { name: "ATM", value: 15 },
    { name: "Mobile", value: 10 },
    { name: "Other", value: 5 }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const timeOfDayData = [
    { hour: "00", frauds: 15 },
    { hour: "01", frauds: 18 },
    { hour: "02", frauds: 22 },
    { hour: "03", frauds: 28 },
    { hour: "04", frauds: 25 },
    { hour: "05", frauds: 20 },
    { hour: "06", frauds: 15 },
    { hour: "07", frauds: 10 },
    { hour: "08", frauds: 8 },
    { hour: "09", frauds: 12 },
    { hour: "10", frauds: 15 },
    { hour: "11", frauds: 18 },
    { hour: "12", frauds: 20 },
    { hour: "13", frauds: 22 },
    { hour: "14", frauds: 24 },
    { hour: "15", frauds: 28 },
    { hour: "16", frauds: 30 },
    { hour: "17", frauds: 34 },
    { hour: "18", frauds: 38 },
    { hour: "19", frauds: 42 },
    { hour: "20", frauds: 45 },
    { hour: "21", frauds: 48 },
    { hour: "22", frauds: 40 },
    { hour: "23", frauds: 30 }
  ];

  const volumeByRegionData = [
    { state: "CA", volume: 380, frauds: 42 },
    { state: "NY", volume: 320, frauds: 38 },
    { state: "TX", volume: 280, frauds: 35 },
    { state: "FL", volume: 240, frauds: 30 },
    { state: "IL", volume: 200, frauds: 25 },
    { state: "PA", volume: 180, frauds: 22 },
    { state: "OH", volume: 160, frauds: 18 },
    { state: "GA", volume: 140, frauds: 15 }
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
                          { category: "Electronics", count: 42 },
                          { category: "Travel", count: 38 },
                          { category: "Gambling", count: 35 },
                          { category: "Crypto", count: 32 },
                          { category: "Retail", count: 25 },
                          { category: "Dining", count: 20 }
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
