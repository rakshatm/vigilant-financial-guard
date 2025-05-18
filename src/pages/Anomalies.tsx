
import React from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FraudChart from "@/components/Dashboard/FraudChart";
import { weeklyFraudData, fraudFactors } from "@/utils/demoData";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Anomalies = () => {
  const recentAnomalies = [
    { id: 1, description: "Large international transfer at unusual hour", severity: "High", time: "2 hours ago" },
    { id: 2, description: "Multiple failed authentication attempts", severity: "Medium", time: "5 hours ago" },
    { id: 3, description: "Account accessed from new device and location", severity: "High", time: "Yesterday" },
    { id: 4, description: "Unusual merchant category for customer profile", severity: "Low", time: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Anomaly Detection</h1>
          <p className="text-gray-500 dark:text-gray-400">AI-powered detection of suspicious patterns</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Anomaly Frequency</CardTitle>
              <CardDescription>Weekly pattern of detected anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <FraudChart data={weeklyFraudData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest detected anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnomalies.map((anomaly) => (
                  <div key={anomaly.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className={`p-1.5 rounded-full 
                      ${anomaly.severity === "High" ? "bg-red-100 text-red-600" : 
                        anomaly.severity === "Medium" ? "bg-yellow-100 text-yellow-600" : 
                        "bg-blue-100 text-blue-600"}`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Badge variant={
                          anomaly.severity === "High" ? "destructive" : 
                          anomaly.severity === "Medium" ? "default" : "secondary"
                        }>
                          {anomaly.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{anomaly.time}</span>
                      </div>
                      <p className="mt-1 text-sm">{anomaly.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="ghost" className="text-xs flex items-center justify-center w-full">
                  <span>View all anomalies</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Anomaly Patterns</CardTitle>
            <CardDescription>Most common fraud indicators detected by the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {fraudFactors.map((factor, i) => (
                <div key={i} className="flex items-start border rounded-lg p-4">
                  <span className={`inline-block w-2 h-2 mt-1.5 mr-2 rounded-full ${
                    factor.impact === "High" 
                      ? "bg-finance-danger" 
                      : factor.impact === "Medium" 
                      ? "bg-finance-warning" 
                      : "bg-finance-info"
                  }`} />
                  <div>
                    <p className="font-medium">{factor.factor}</p>
                    <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Define Button for this file context
const Button = React.forwardRef<
  HTMLButtonElement, 
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
      ${variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" :
        variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" :
        variant === "outline" ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" :
        variant === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" :
        variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" :
        "text-primary underline-offset-4 hover:underline"}
      ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export default Anomalies;
