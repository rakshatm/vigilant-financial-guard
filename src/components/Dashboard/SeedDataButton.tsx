import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SeedDataButton = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setIsSeeding(true);

    try {
      const { data, error } = await supabase.functions.invoke('seed-sample-data');

      if (error) throw error;

      toast({
        title: 'Sample Data Loaded!',
        description: `${data.message}. Refreshing page...`,
      });

      // Reload to show new data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast({
        title: 'Seeding Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      onClick={handleSeedData}
      disabled={isSeeding}
      variant="outline"
      size="sm"
    >
      {isSeeding ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading Sample Data...
        </>
      ) : (
        <>
          <Database className="h-4 w-4 mr-2" />
          Load Sample Dataset
        </>
      )}
    </Button>
  );
};
