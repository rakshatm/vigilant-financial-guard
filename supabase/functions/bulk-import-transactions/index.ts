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

    // Process and insert transactions
    const transactionsToInsert = transactions.map((t: any) => ({
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

    // Insert in batches of 100
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < transactionsToInsert.length; i += batchSize) {
      const batch = transactionsToInsert.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('transactions')
        .insert(batch)
        .select();

      if (error) {
        console.error('Batch insert error:', error);
        throw error;
      }
      
      results.push(...(data || []));
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: results.length,
        message: `Successfully imported ${results.length} transactions`
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
