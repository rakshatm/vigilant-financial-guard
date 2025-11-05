import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Sample dataset with mix of fraud and legitimate transactions
    const sampleTransactions = [
      // Fraudulent transactions
      {
        transaction_id: 'TXN-FRAUD-001',
        amount: 9999.99,
        merchant: 'Unknown Merchant XYZ',
        category: 'Electronics',
        location: 'Nigeria',
        status: 'blocked',
        fraud_score: 0.95,
        risk_level: 'critical',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-FRAUD-002',
        amount: 5500,
        merchant: 'Temp Store 123',
        category: 'Online Retail',
        location: 'Unknown',
        status: 'blocked',
        fraud_score: 0.88,
        risk_level: 'high',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-FRAUD-003',
        amount: 12000,
        merchant: 'Cash Advance Ltd',
        category: 'ATM',
        location: 'Foreign Location',
        status: 'blocked',
        fraud_score: 0.92,
        risk_level: 'critical',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-FRAUD-004',
        amount: 7800,
        merchant: 'Test Merchant',
        category: 'Gas Stations',
        location: 'Suspicious Area',
        status: 'flagged',
        fraud_score: 0.75,
        risk_level: 'high',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      // Legitimate transactions
      {
        transaction_id: 'TXN-LEGIT-001',
        amount: 45.99,
        merchant: 'Starbucks',
        category: 'Restaurants',
        location: 'New York, USA',
        status: 'approved',
        fraud_score: 0.05,
        risk_level: 'low',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-LEGIT-002',
        amount: 125.50,
        merchant: 'Amazon',
        category: 'Shopping',
        location: 'Seattle, USA',
        status: 'approved',
        fraud_score: 0.08,
        risk_level: 'low',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-LEGIT-003',
        amount: 89.99,
        merchant: 'Walmart',
        category: 'Grocery',
        location: 'Los Angeles, USA',
        status: 'approved',
        fraud_score: 0.03,
        risk_level: 'low',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-LEGIT-004',
        amount: 250.00,
        merchant: 'Apple Store',
        category: 'Electronics',
        location: 'San Francisco, USA',
        status: 'approved',
        fraud_score: 0.15,
        risk_level: 'low',
        timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
      },
      // Pending/Review transactions
      {
        transaction_id: 'TXN-PENDING-001',
        amount: 2500,
        merchant: 'International Wire',
        category: 'Financial Services',
        location: 'London, UK',
        status: 'flagged',
        fraud_score: 0.45,
        risk_level: 'medium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-PENDING-002',
        amount: 1850,
        merchant: 'Luxury Hotel',
        category: 'Travel',
        location: 'Paris, France',
        status: 'pending',
        fraud_score: 0.35,
        risk_level: 'medium',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
      },
      // More legitimate transactions
      {
        transaction_id: 'TXN-LEGIT-005',
        amount: 15.75,
        merchant: 'Local Cafe',
        category: 'Restaurants',
        location: 'Boston, USA',
        status: 'approved',
        fraud_score: 0.02,
        risk_level: 'low',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-LEGIT-006',
        amount: 320.00,
        merchant: 'Best Buy',
        category: 'Electronics',
        location: 'Chicago, USA',
        status: 'approved',
        fraud_score: 0.12,
        risk_level: 'low',
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
      },
      // Additional fraud cases
      {
        transaction_id: 'TXN-FRAUD-005',
        amount: 15000,
        merchant: 'Unknown Online Store',
        category: 'Online Retail',
        location: 'Tor Network',
        status: 'blocked',
        fraud_score: 0.98,
        risk_level: 'critical',
        timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
      },
      {
        transaction_id: 'TXN-FRAUD-006',
        amount: 4500,
        merchant: 'Suspicious Vendor',
        category: 'Gas Stations',
        location: 'Unknown',
        status: 'blocked',
        fraud_score: 0.82,
        risk_level: 'high',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
      },
    ];

    // Add user_id to all transactions
    const transactionsWithUser = sampleTransactions.map(t => ({
      ...t,
      user_id: user.id
    }));

    // Insert transactions
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionsWithUser)
      .select();

    if (error) {
      console.error('Error inserting sample data:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data.length} transactions for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        inserted: data.length,
        message: `Successfully seeded ${data.length} sample transactions`,
        breakdown: {
          fraudulent: sampleTransactions.filter(t => t.status === 'blocked').length,
          legitimate: sampleTransactions.filter(t => t.status === 'approved').length,
          pending: sampleTransactions.filter(t => t.status === 'pending' || t.status === 'flagged').length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
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
