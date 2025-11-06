import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, DollarSign, Clock, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface FraudAlert {
  id: string;
  type: 'high_risk' | 'suspicious_pattern' | 'velocity_check' | 'location_anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  transactionId?: string;
  amount?: number;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  location?: string;
  merchantName?: string;
}

const FraudAlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all');
  const { toast } = useToast();

  const generateMockAlert = (): FraudAlert => {
    const types = ['high_risk', 'suspicious_pattern', 'velocity_check', 'location_anomaly'] as const;
    const severities = ['critical', 'high', 'medium', 'low'] as const;
    const statuses = ['active', 'investigating', 'resolved'] as const;
    
    const alertTemplates = {
      high_risk: {
        title: 'High-Risk Transaction Detected',
        description: 'Transaction flagged by ML model with >85% fraud probability'
      },
      suspicious_pattern: {
        title: 'Suspicious Pattern Alert',
        description: 'Multiple failed authentication attempts detected'
      },
      velocity_check: {
        title: 'Velocity Check Failed',
        description: 'Unusual transaction frequency detected'
      },
      location_anomaly: {
        title: 'Location Anomaly',
        description: 'Transaction from unusual geographic location'
      }
    };

    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const template = alertTemplates[type];

    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      title: template.title,
      description: template.description,
      transactionId: `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      amount: Math.floor(Math.random() * 10000) + 100,
      timestamp: new Date(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: ['Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu'][Math.floor(Math.random() * 4)],
      merchantName: ['Flipkart', 'Paytm', 'PhonePe', 'Amazon India'][Math.floor(Math.random() * 4)]
    };
  };

  const initializeAlerts = () => {
    const initialAlerts: FraudAlert[] = [
      {
        id: 'alert-1',
        type: 'high_risk',
        severity: 'critical',
        title: 'Critical Fraud Alert',
        description: 'High-value transaction from new device in foreign country',
        transactionId: 'TXN-ABC123',
        amount: 8500,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'active',
        location: 'Nigeria',
        merchantName: 'Unknown Merchant'
      },
      {
        id: 'alert-2',
        type: 'velocity_check',
        severity: 'high',
        title: 'Velocity Check Alert',
        description: '15 transactions in 10 minutes detected',
        transactionId: 'TXN-DEF456',
        amount: 250,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'investigating',
        location: 'California, USA',
        merchantName: 'Online Gaming'
      },
      {
        id: 'alert-3',
        type: 'suspicious_pattern',
        severity: 'medium',
        title: 'Pattern Recognition Alert',
        description: 'Card testing pattern detected',
        transactionId: 'TXN-GHI789',
        amount: 1,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'resolved',
        location: 'Texas, USA',
        merchantName: 'Test Merchant'
      }
    ];
    setAlerts(initialAlerts);
  };

  useEffect(() => {
    initializeAlerts();

    // Simulate new alerts every 30-60 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new alert
        const newAlert = generateMockAlert();
        setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep only latest 10
        
        if (newAlert.severity === 'critical') {
          toast({
            title: "🚨 Critical Fraud Alert",
            description: newAlert.title,
            variant: "destructive"
          });
        }
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [toast]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'investigating': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const updateAlertStatus = (alertId: string, newStatus: FraudAlert['status']) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'active') return alert.status === 'active';
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Fraud Alert System
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'active' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button 
              variant={filter === 'critical' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('critical')}
            >
              Critical
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              No fraud alerts matching your filter criteria.
            </AlertDescription>
          </Alert>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="border rounded-lg p-4 space-y-3 animate-fade-in hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)} text-white`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(alert.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  {alert.transactionId && (
                    <span>ID: {alert.transactionId}</span>
                  )}
                  {alert.amount && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {alert.amount.toLocaleString()}
                    </span>
                  )}
                  {alert.location && (
                    <span>{alert.location}</span>
                  )}
                  {alert.merchantName && (
                    <span>{alert.merchantName}</span>
                  )}
                </div>
                <span>{getTimeAgo(alert.timestamp)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {alert.severity.toUpperCase()}
                </Badge>
                <Badge 
                  variant={alert.status === 'resolved' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {alert.status.toUpperCase()}
                </Badge>
                
                {alert.status === 'active' && (
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateAlertStatus(alert.id, 'investigating')}
                    >
                      Investigate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateAlertStatus(alert.id, 'resolved')}
                    >
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default FraudAlertSystem;