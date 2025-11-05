import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { transactions } = await req.json();

    if (!Array.isArray(transactions) || transactions.length === 0) {
      throw new Error('Invalid transactions data');
    }

    // Process in smaller batches to avoid memory issues
    const batchSize = 50;
    let totalImported = 0;
    
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      
      // Transform batch only (don't transform everything at once)
      const transactionsToInsert = batch.map((t: any) => ({
        user_id: user.id,
        transaction_id: t.transaction_id || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat(t.amount),
        merchant: t.merchant,
        category: t.category,
        location: t.location || null,
        status: t.status || 'pending',
        fraud_score: parseFloat(t.fraud_score || 0),
        risk_level: t.risk_level || 'low',
        timestamp: t.timestamp || new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)
        .select();

      if (error) {
        console.error('Batch insert error:', error);
        throw error;
      }
      
      totalImported += data?.length || 0;
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}, imported ${data?.length || 0} transactions`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: totalImported,
        message: `Successfully imported ${totalImported} transactions`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
};

serve(handler);
