import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import DatabaseConfig from "@/components/DatabaseConfig";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Save, RefreshCw, AlertTriangle, Check } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gmailAddress, setGmailAddress] = useState("");

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setDisplayName(data.display_name || '');
        setEmail(data.email || user.email || '');
        setPhoneNumber(data.phone_number || '');
      } else if (user.email) {
        setEmail(user.email);
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        display_name: displayName,
        email: email,
        phone_number: phoneNumber,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save profile changes",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Configure system preferences and notification settings</p>
        </div>

        <Tabs defaultValue="general" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="model">Model Settings</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="api">API & Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">Indian format with country code</p>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Security Analyst" disabled />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="asia_kolkata">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia_kolkata">Asia/Kolkata (IST UTC+05:30)</SelectItem>
                      <SelectItem value="america_los_angeles">America/Los Angeles (UTC-07:00)</SelectItem>
                      <SelectItem value="america_new_york">America/New York (UTC-04:00)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (UTC+01:00)</SelectItem>
                      <SelectItem value="asia_tokyo">Asia/Tokyo (UTC+09:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="gmail">Gmail Address</Label>
                  <Input 
                    id="gmail" 
                    type="email" 
                    value={gmailAddress}
                    onChange={(e) => setGmailAddress(e.target.value)}
                    placeholder="your.email@gmail.com"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">Used for sending alerts and notifications</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setDisplayName("");
                  setEmail(user?.email || "");
                  setPhoneNumber("");
                  setGmailAddress("");
                }}>Cancel</Button>
                <Button 
                  className="flex items-center gap-2"
                  onClick={handleSaveProfile}
                  disabled={saving || loading}
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alerts</h3>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="high-risk-email" className="flex-1">High-risk fraud alerts (Email)</Label>
                    <Switch id="high-risk-email" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="high-risk-sms" className="flex-1">High-risk fraud alerts (SMS)</Label>
                    <Switch id="high-risk-sms" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="medium-risk" className="flex-1">Medium-risk fraud alerts</Label>
                    <Switch id="medium-risk" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="system-updates" className="flex-1">System updates and maintenance</Label>
                    <Switch id="system-updates" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="weekly-reports" className="flex-1">Weekly summary reports</Label>
                    <Switch id="weekly-reports" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Report Delivery</h3>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="report-email">Email addresses for reports (comma separated)</Label>
                    <Input id="report-email" defaultValue="john.doe@example.com, team@company.com" />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="report-schedule">Report Schedule</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily (8:00 AM)</SelectItem>
                        <SelectItem value="weekly">Weekly (Mondays, 8:00 AM)</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly (Monday, 8:00 AM)</SelectItem>
                        <SelectItem value="monthly">Monthly (1st of month, 8:00 AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Save Notification Settings</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="model">
            <Card>
              <CardHeader>
                <CardTitle>Model Configuration</CardTitle>
                <CardDescription>Adjust ML model behavior and sensitivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="threshold">Detection Threshold</Label>
                      <span className="text-sm">0.65</span>
                    </div>
                    <Slider id="threshold" defaultValue={[0.65]} max={1} step={0.01} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Less sensitive</span>
                      <span>More sensitive</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Higher values increase false positives but reduce false negatives</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between space-x-2 pt-4">
                  <Label htmlFor="auto-retrain" className="flex-1">Automatic model retraining</Label>
                  <Switch id="auto-retrain" defaultChecked />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="retraining-freq">Retraining Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="feature-selection">Feature Selection Method</Label>
                  <Select defaultValue="recursive">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recursive">Recursive Feature Elimination</SelectItem>
                      <SelectItem value="importance">Feature Importance</SelectItem>
                      <SelectItem value="correlation">Correlation-based Selection</SelectItem>
                      <SelectItem value="all">Use All Features</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="ensemble" className="flex-1">Use ensemble models</Label>
                  <Switch id="ensemble" defaultChecked />
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="flex items-center gap-2 w-full">
                    <RefreshCw className="h-4 w-4" />
                    <span>Retrain Model Now</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Save Model Settings</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="database">
            <DatabaseConfig />
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Keys & Integrations</CardTitle>
                <CardDescription>Manage API access and third-party connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-key">API Key</Label>
                      <Button variant="outline" size="sm" className="h-7 text-xs">Regenerate</Button>
                    </div>
                    <div className="flex">
                      <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly className="rounded-r-none" />
                      <Button variant="outline" className="rounded-l-none border-l-0">Copy</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Last used: May 12, 2025, 14:23</p>
                  </div>
                  
                  <div className="grid gap-3 pt-4">
                    <Label>Active Integrations</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">Banking System API</p>
                            <p className="text-xs text-muted-foreground">Connected on Apr 30, 2025</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="font-medium">Payment Gateway</p>
                            <p className="text-xs text-muted-foreground">Token expired 2 days ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Reconnect</Button>
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Customer Data Platform</p>
                            <p className="text-xs text-muted-foreground">Connected on May 5, 2025</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">+ Add New Integration</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
