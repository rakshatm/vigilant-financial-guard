import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, IndianRupee, Clock, X, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFraudData, FraudAlert as DBFraudAlert } from '@/hooks/useFraudData';

interface LocalAlert {
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
  isFromDB?: boolean;
}

const FraudAlertSystem: React.FC = () => {
  const [localAlerts, setLocalAlerts] = useState<LocalAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all');
  const [savingAlertId, setSavingAlertId] = useState<string | null>(null);
  const { toast } = useToast();
  const { alerts: dbAlerts, createAlert, updateAlertStatus: updateDBAlertStatus, loading } = useFraudData();

  // Convert DB alerts to local format
  const convertDBAlert = (dbAlert: DBFraudAlert): LocalAlert => {
    const typeMap: Record<string, LocalAlert['type']> = {
      'high_risk': 'high_risk',
      'suspicious_pattern': 'suspicious_pattern',
      'velocity_check': 'velocity_check',
      'location_anomaly': 'location_anomaly'
    };

    return {
      id: dbAlert.id,
      type: typeMap[dbAlert.alert_type] || 'high_risk',
      severity: dbAlert.severity as LocalAlert['severity'],
      title: dbAlert.alert_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: dbAlert.message,
      transactionId: dbAlert.transaction_id,
      timestamp: new Date(dbAlert.created_at),
      status: dbAlert.status as LocalAlert['status'],
      isFromDB: true
    };
  };

  // Merge DB alerts with local alerts
  useEffect(() => {
    if (dbAlerts.length > 0) {
      const convertedAlerts = dbAlerts.map(convertDBAlert);
      setLocalAlerts(prev => {
        // Filter out local alerts that exist in DB
        const localOnly = prev.filter(a => !a.isFromDB);
        return [...convertedAlerts, ...localOnly];
      });
    }
  }, [dbAlerts]);

  const generateMockAlert = (): LocalAlert => {
    const types = ['high_risk', 'suspicious_pattern', 'velocity_check', 'location_anomaly'] as const;
    const severities = ['critical', 'high', 'medium', 'low'] as const;
    
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
      amount: Math.floor(Math.random() * 100000) + 1000,
      timestamp: new Date(),
      status: 'active',
      location: ['Mumbai, Maharashtra', 'Delhi NCR', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu', 'Hyderabad, Telangana', 'Pune, Maharashtra', 'Kolkata, West Bengal'][Math.floor(Math.random() * 7)],
      merchantName: ['Flipkart', 'Paytm Mall', 'BigBasket', 'Amazon India', 'Myntra', 'Swiggy', 'Zomato', 'CRED'][Math.floor(Math.random() * 8)],
      isFromDB: false
    };
  };

  // Initialize with some demo alerts if DB is empty
  useEffect(() => {
    if (!loading && dbAlerts.length === 0 && localAlerts.length === 0) {
      const initialAlerts: LocalAlert[] = [
        {
          id: 'alert-demo-1',
          type: 'high_risk',
          severity: 'critical',
          title: 'Critical Fraud Alert',
          description: 'High-value UPI transaction from new device in unusual location',
          transactionId: 'TXN-MUM78234',
          amount: 85000,
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: 'active',
          location: 'Mumbai, Maharashtra',
          merchantName: 'Unknown UPI Merchant',
          isFromDB: false
        },
        {
          id: 'alert-demo-2',
          type: 'velocity_check',
          severity: 'high',
          title: 'Velocity Check Alert',
          description: '15 transactions in 10 minutes detected via PhonePe',
          transactionId: 'TXN-DEL45621',
          amount: 2500,
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          status: 'investigating',
          location: 'Delhi NCR',
          merchantName: 'Dream11 Gaming',
          isFromDB: false
        },
        {
          id: 'alert-demo-3',
          type: 'suspicious_pattern',
          severity: 'medium',
          title: 'Pattern Recognition Alert',
          description: 'Card testing pattern detected on Razorpay gateway',
          transactionId: 'TXN-BLR89012',
          amount: 10,
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'resolved',
          location: 'Bangalore, Karnataka',
          merchantName: 'Test Merchant India',
          isFromDB: false
        }
      ];
      setLocalAlerts(initialAlerts);
    }
  }, [loading, dbAlerts.length]);

  // Simulate new alerts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of new alert
        const newAlert = generateMockAlert();
        setLocalAlerts(prev => [newAlert, ...prev].slice(0, 15));
        
        if (newAlert.severity === 'critical') {
          toast({
            title: "🚨 Critical Fraud Alert",
            description: newAlert.title,
            variant: "destructive"
          });
        }
      }
    }, 60000); // Every 60 seconds

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

  const handleUpdateStatus = async (alertId: string, newStatus: LocalAlert['status'], isFromDB?: boolean) => {
    setSavingAlertId(alertId);
    
    try {
      if (isFromDB) {
        // Update in database
        await updateDBAlertStatus(alertId, newStatus);
        toast({
          title: "Alert Updated",
          description: `Alert status changed to ${newStatus}`,
        });
      } else {
        // Update locally and save to database
        const alert = localAlerts.find(a => a.id === alertId);
        if (alert) {
          // Save to database
          await createAlert({
            transaction_id: alert.transactionId || 'UNKNOWN',
            alert_type: alert.type,
            severity: alert.severity,
            message: alert.description,
            status: newStatus
          });
          
          // Remove from local state (it will come back from DB)
          setLocalAlerts(prev => prev.filter(a => a.id !== alertId));
          
          toast({
            title: "Alert Saved",
            description: `Alert saved to database with status: ${newStatus}`,
          });
        }
      }
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert status",
        variant: "destructive"
      });
      
      // Fallback: update locally
      setLocalAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, status: newStatus } : alert
        )
      );
    } finally {
      setSavingAlertId(null);
    }
  };

  const handleDismiss = async (alertId: string, isFromDB?: boolean) => {
    setSavingAlertId(alertId);
    
    try {
      if (isFromDB) {
        await updateDBAlertStatus(alertId, 'dismissed');
      }
      setLocalAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast({
        title: "Alert Dismissed",
        description: "The alert has been dismissed",
      });
    } catch (error) {
      console.error('Error dismissing alert:', error);
      // Still remove from local state
      setLocalAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } finally {
      setSavingAlertId(null);
    }
  };

  const handleSaveToDatabase = async (alert: LocalAlert) => {
    setSavingAlertId(alert.id);
    
    try {
      await createAlert({
        transaction_id: alert.transactionId || 'UNKNOWN',
        alert_type: alert.type,
        severity: alert.severity,
        message: alert.description,
        status: alert.status
      });
      
      // Mark as saved
      setLocalAlerts(prev => prev.filter(a => a.id !== alert.id));
      
      toast({
        title: "Alert Saved",
        description: "Alert has been saved to the database",
      });
    } catch (error) {
      console.error('Error saving alert:', error);
      toast({
        title: "Error",
        description: "Failed to save alert to database",
        variant: "destructive"
      });
    } finally {
      setSavingAlertId(null);
    }
  };

  const filteredAlerts = localAlerts.filter(alert => {
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
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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
              className={`border rounded-lg p-4 space-y-3 animate-fade-in hover:shadow-md transition-shadow ${
                alert.isFromDB ? 'border-primary/30 bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)} text-white`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      {alert.title}
                      {alert.isFromDB && (
                        <Badge variant="outline" className="text-xs bg-primary/10">
                          Saved
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(alert.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(alert.id, alert.isFromDB)}
                    disabled={savingAlertId === alert.id}
                  >
                    {savingAlertId === alert.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
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
                      <IndianRupee className="h-3 w-3" />
                      {alert.amount.toLocaleString('en-IN')}
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
                
                <div className="ml-auto flex gap-2">
                  {!alert.isFromDB && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveToDatabase(alert)}
                      disabled={savingAlertId === alert.id}
                    >
                      {savingAlertId === alert.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : null}
                      Save
                    </Button>
                  )}
                  {alert.status === 'active' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(alert.id, 'investigating', alert.isFromDB)}
                        disabled={savingAlertId === alert.id}
                      >
                        Investigate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(alert.id, 'resolved', alert.isFromDB)}
                        disabled={savingAlertId === alert.id}
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default FraudAlertSystem;
