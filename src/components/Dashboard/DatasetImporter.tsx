import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileJson, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const DatasetImporter = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const text = await file.text();
      let transactions;

      if (file.name.endsWith('.json')) {
        transactions = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        // Parse CSV
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        transactions = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',');
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index]?.trim();
          });
          return obj;
        });
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV.');
      }

      // Call edge function to import
      const { data, error } = await supabase.functions.invoke('bulk-import-transactions', {
        body: { transactions }
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: data.message,
      });

      // Reload the page to show new data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast({
        title: 'Import Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        transaction_id: 'TXN-001',
        amount: 150.50,
        merchant: 'Amazon',
        category: 'Shopping',
        location: 'New York, USA',
        status: 'approved',
        fraud_score: 0.05,
        risk_level: 'low',
        timestamp: new Date().toISOString()
      },
      {
        transaction_id: 'TXN-002',
        amount: 5000,
        merchant: 'Unknown Merchant',
        category: 'Electronics',
        location: 'Unknown',
        status: 'blocked',
        fraud_score: 0.95,
        risk_level: 'critical',
        timestamp: new Date().toISOString()
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction-template.json';
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Dataset
        </CardTitle>
        <CardDescription>
          Upload your transaction dataset (JSON or CSV format)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          
          <label className="flex-1">
            <Button
              variant="default"
              disabled={isUploading}
              className="w-full"
              asChild
            >
              <span>
                <FileJson className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Dataset'}
              </span>
            </Button>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Supported formats: JSON, CSV. Required fields: amount, merchant, category
        </p>
      </CardContent>
    </Card>
  );
};
