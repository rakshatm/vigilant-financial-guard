
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { predictFraud, getRiskLevel, TransactionInput } from "@/utils/modelHelpers";
import { cn } from "@/lib/utils";

const transactionTypes = [
  "Online", "In-Store", "ATM", "Wire Transfer", "Mobile Payment"
];

const merchantCategories = [
  "Retail", "Electronics", "Travel", "Grocery", "Entertainment", 
  "Gambling", "Cryptocurrency", "Financial Services"
];

const locations = [
  "Local", "Different City", "Different State", "International"
];

const currencies = [
  "INR"
];

const deviceTypes = [
  "Mobile", "Desktop", "Tablet", "ATM", "POS Terminal", "Card Present"
];

const TransactionAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    fraudProbability: number;
    contributingFactors: { factor: string; impact: number }[];
  } | null>(null);
  
  const [formData, setFormData] = useState<TransactionInput>({
    transaction_amount: 500,
    account_balance: 3500,
    transaction_type: "Online",
    merchant_category: "Electronics",
    transaction_hour: new Date().getHours(),
    device_type: "Mobile",
    day_of_week: new Date().getDay(),
    state: "Maharashtra",
    city: "Mumbai",
    location: "Same City",
    currency: "INR"
  });

  const handleInputChange = (field: keyof TransactionInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const prediction = predictFraud(formData);
      setResult(prediction);
      setLoading(false);
    }, 1500);
  };

  const getRiskColor = (probability: number) => {
    if (probability < 0.3) return "bg-green-500";
    if (probability < 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getFactorIcon = (impact: number) => {
    if (impact >= 0.15) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (impact >= 0.08) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <ShieldCheck className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input 
                    id="amount"
                    type="number"
                    value={formData.transaction_amount}
                    onChange={e => handleInputChange('transaction_amount', parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="balance">Account Balance</Label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input 
                    id="balance"
                    type="number"
                    value={formData.account_balance}
                    onChange={e => handleInputChange('account_balance', parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select 
                  value={formData.transaction_type}
                  onValueChange={value => handleInputChange('transaction_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant Category</Label>
                <Select
                  value={formData.merchant_category}
                  onValueChange={value => handleInputChange('merchant_category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {merchantCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hour">Transaction Hour (24h)</Label>
              <div className="pt-2">
                <Slider
                  id="hour"
                  min={0}
                  max={23}
                  step={1}
                  value={[formData.transaction_hour]}
                  onValueChange={([value]) => handleInputChange('transaction_hour', value)}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>11 PM</span>
                </div>
                <div className="text-center mt-2">
                  {formData.transaction_hour < 12 ? (
                    `${formData.transaction_hour === 0 ? 12 : formData.transaction_hour} AM`
                  ) : (
                    `${formData.transaction_hour === 12 ? 12 : formData.transaction_hour - 12} PM`
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device">Device Type</Label>
                <Select
                  value={formData.device_type}
                  onValueChange={value => handleInputChange('device_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map(device => (
                      <SelectItem key={device} value={device}>{device}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={value => handleInputChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={value => handleInputChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Transaction"} 
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className={cn(
        "transition-all", 
        result ? "opacity-100" : "opacity-60"
      )}>
        <CardHeader>
          <CardTitle>Fraud Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fraud Probability</span>
                  <Badge variant={getRiskLevel(result.fraudProbability) === "High" ? "destructive" : 
                    getRiskLevel(result.fraudProbability) === "Medium" ? "default" : "secondary"}>
                    {getRiskLevel(result.fraudProbability)} Risk
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={result.fraudProbability * 100} className={getRiskColor(result.fraudProbability)} />
                  <div className="text-center text-2xl font-bold">
                    {Math.round(result.fraudProbability * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contributing Factors</h3>
                <div className="space-y-2">
                  {result.contributingFactors.map((factor, i) => (
                    <div key={i} className="flex items-center justify-between border-b last:border-0 pb-2">
                      <div className="flex items-center space-x-2">
                        {getFactorIcon(factor.impact)}
                        <span>{factor.factor}</span>
                      </div>
                      <span className="text-sm font-medium">
                        +{Math.round(factor.impact * 100)}%
                      </span>
                    </div>
                  ))}
                  
                  {result.contributingFactors.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No significant risk factors detected
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Recommendation</h3>
                <p className="text-sm">
                  {result.fraudProbability >= 0.7 ? (
                    "This transaction has a high risk of fraud. We recommend rejecting the transaction and contacting the customer to verify."
                  ) : result.fraudProbability >= 0.3 ? (
                    "This transaction has a moderate risk of fraud. Additional verification is recommended before approval."
                  ) : (
                    "This transaction appears to be legitimate with a low risk of fraud. Standard processing is recommended."
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Enter transaction details and click Analyze
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                The ML model will evaluate the risk and provide fraud analysis
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionAnalyzer;
