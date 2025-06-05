
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, TestTube, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { getApiConfig, saveApiConfig, apiCall } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

const DatabaseConfig = () => {
  const [config, setConfig] = useState(getApiConfig());
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const { toast } = useToast();

  const handleSave = () => {
    saveApiConfig(config);
    toast({
      title: "Configuration Saved",
      description: "Database configuration has been saved successfully.",
    });
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      await apiCall('/health');
      setConnectionStatus('success');
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the database backend.",
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: "Could not connect to the database backend. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertTriangle className="h-3 w-3 mr-1" />Untested</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Database Configuration</CardTitle>
            <CardDescription>Configure connection to your MySQL backend API</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="baseUrl">Backend API URL</Label>
          <Input
            id="baseUrl"
            value={config.baseUrl}
            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            placeholder="http://localhost:3001/api"
          />
          <p className="text-xs text-muted-foreground">
            The base URL of your backend API that connects to MySQL
          </p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="apiKey">API Key (Optional)</Label>
          <Input
            id="apiKey"
            type="password"
            value={config.apiKey || ''}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder="Enter your API key if required"
          />
          <p className="text-xs text-muted-foreground">
            Authentication key for accessing your backend API
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Required API Endpoints</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <div><code>GET /health</code> - Health check</div>
            <div><code>GET /transactions</code> - Transaction data</div>
            <div><code>GET /dashboard-metrics</code> - Dashboard statistics</div>
            <div><code>GET /fraud-alerts</code> - Fraud alerts</div>
            <div><code>POST /analyze-transaction</code> - Fraud analysis</div>
            <div><code>GET /trends</code> - Fraud trends</div>
            <div><code>GET /weekly-fraud-data</code> - Chart data</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
          <Button 
            variant="outline" 
            onClick={testConnection}
            disabled={isTestingConnection}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;
