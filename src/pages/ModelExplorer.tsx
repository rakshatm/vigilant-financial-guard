
import React from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionAnalyzer from "@/components/TransactionAnalyzer";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ModelExplorer = () => {
  // Model performance data
  const performanceMetrics = {
    accuracy: 0.945,
    precision: 0.92,
    recall: 0.89,
    f1Score: 0.905,
    auc: 0.963
  };

  // Feature importance chart data
  const featureImportance = [
    { name: "Transaction Amount", value: 0.25 },
    { name: "Transaction Time", value: 0.18 },
    { name: "Device Type", value: 0.15 },
    { name: "Merchant Category", value: 0.12 },
    { name: "Location", value: 0.10 },
    { name: "Account Age", value: 0.08 },
    { name: "Currency", value: 0.07 },
    { name: "Transaction Type", value: 0.05 }
  ].sort((a, b) => b.value - a.value);

  // Confusion matrix data
  const confusionMatrix = {
    truePositive: 428,
    falsePositive: 37,
    trueNegative: 1843,
    falseNegative: 52
  };

  // Sample model version history
  const modelVersions = [
    { version: "2.5", date: "May 10, 2025", accuracy: 0.945, recall: 0.89 },
    { version: "2.4", date: "Apr 15, 2025", accuracy: 0.938, recall: 0.87 },
    { version: "2.3", date: "Mar 3, 2025", accuracy: 0.924, recall: 0.85 },
    { version: "2.2", date: "Feb 8, 2025", accuracy: 0.910, recall: 0.82 },
    { version: "2.1", date: "Jan 12, 2025", accuracy: 0.895, recall: 0.79 }
  ];

  // ROC Curve data (simplified)
  const rocCurveData = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.02, tpr: 0.45 },
    { fpr: 0.04, tpr: 0.63 },
    { fpr: 0.06, tpr: 0.76 },
    { fpr: 0.08, tpr: 0.82 },
    { fpr: 0.10, tpr: 0.86 },
    { fpr: 0.15, tpr: 0.90 },
    { fpr: 0.2, tpr: 0.94 },
    { fpr: 0.3, tpr: 0.97 },
    { fpr: 0.5, tpr: 0.99 },
    { fpr: 1, tpr: 1 }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Model Explorer</h1>
          <p className="text-gray-500 dark:text-gray-400">ML model analysis and transaction testing</p>
        </div>

        <Tabs defaultValue="performance" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Model Performance</TabsTrigger>
            <TabsTrigger value="features">Feature Analysis</TabsTrigger>
            <TabsTrigger value="test">Test Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Current model evaluation metrics</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  {Object.entries(performanceMetrics).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-sm text-muted-foreground mb-1 capitalize">
                        {key === "auc" ? "AUC-ROC" : key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-3xl font-bold">{(value * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Confusion Matrix</CardTitle>
                  <CardDescription>Model prediction breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-4 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">True Negatives</p>
                      <p className="text-2xl font-bold">{confusionMatrix.trueNegative}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-4 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">False Positives</p>
                      <p className="text-2xl font-bold">{confusionMatrix.falsePositive}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-4 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">False Negatives</p>
                      <p className="text-2xl font-bold">{confusionMatrix.falseNegative}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-4 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">True Positives</p>
                      <p className="text-2xl font-bold">{confusionMatrix.truePositive}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ROC Curve</CardTitle>
                  <CardDescription>True Positive Rate vs False Positive Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rocCurveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fpr" label={{ value: "False Positive Rate", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "True Positive Rate", angle: -90, position: "insideLeft" }} />
                        <Tooltip formatter={(value) => value.toFixed(2)} />
                        <Line type="monotone" dataKey="tpr" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="fpr" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm font-medium">AUC-ROC Score: {performanceMetrics.auc.toFixed(3)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Version History</CardTitle>
                  <CardDescription>Performance improvements over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={modelVersions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="version" />
                        <YAxis domain={[0.75, 1]} />
                        <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" stroke="#8884d8" name="Accuracy" />
                        <Line type="monotone" dataKey="recall" stroke="#82ca9d" name="Recall" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="features">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Importance</CardTitle>
                  <CardDescription>Impact of each feature on model predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={featureImportance}
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 0.3]} />
                        <YAxis dataKey="name" type="category" scale="band" />
                        <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                        <Bar dataKey="value" fill="#8884d8" name="Importance">
                          {featureImportance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Details</CardTitle>
                    <CardDescription>Technical specifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Algorithm</p>
                          <p className="font-medium">XGBoost Classifier</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Version</p>
                          <p className="font-medium">2.5 (Latest)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Training Data Size</p>
                          <p className="font-medium">2.4M transactions</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Features</p>
                          <p className="font-medium">32 features</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Last Trained</p>
                          <p className="font-medium">May 10, 2025</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Retraining Schedule</p>
                          <p className="font-medium">Monthly</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Training Distribution</CardTitle>
                    <CardDescription>Data characteristics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Legitimate", value: 94 },
                              { name: "Fraudulent", value: 6 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#4CAF50" />
                            <Cell fill="#F44336" />
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-2">SMOTE balancing applied during training</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Analyzer</CardTitle>
                <CardDescription>Test the model with custom transaction parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ModelExplorer;
