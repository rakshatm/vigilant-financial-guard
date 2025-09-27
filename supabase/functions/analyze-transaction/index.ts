import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransactionData {
  amount: number;
  merchant: string;
  category: string;
  location?: string;
}

interface FraudAnalysis {
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  recommendation: 'approve' | 'review' | 'block';
}

const analyzeTransactionForFraud = (transaction: TransactionData): FraudAnalysis => {
  let fraudScore = 0;
  const riskFactors: string[] = [];

  // Amount-based risk analysis
  if (transaction.amount > 10000) {
    fraudScore += 0.4;
    riskFactors.push('High transaction amount');
  } else if (transaction.amount > 5000) {
    fraudScore += 0.2;
    riskFactors.push('Above average transaction amount');
  }

  // Merchant category risk analysis
  const highRiskCategories = ['gas_stations', 'atm', 'online_retail'];
  const mediumRiskCategories = ['restaurants', 'entertainment'];
  
  if (highRiskCategories.includes(transaction.category.toLowerCase())) {
    fraudScore += 0.3;
    riskFactors.push(`High-risk category: ${transaction.category}`);
  } else if (mediumRiskCategories.includes(transaction.category.toLowerCase())) {
    fraudScore += 0.1;
    riskFactors.push(`Medium-risk category: ${transaction.category}`);
  }

  // Location-based risk analysis
  if (transaction.location) {
    const suspiciousLocations = ['nigeria', 'unknown', 'tor network'];
    if (suspiciousLocations.some(loc => transaction.location!.toLowerCase().includes(loc))) {
      fraudScore += 0.5;
      riskFactors.push('Suspicious location detected');
    }
  }

  // Merchant name risk analysis
  const suspiciousMerchants = ['unknown', 'temp', 'test'];
  if (suspiciousMerchants.some(term => transaction.merchant.toLowerCase().includes(term))) {
    fraudScore += 0.3;
    riskFactors.push('Suspicious merchant name');
  }

  // Determine risk level and recommendation
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  let recommendation: 'approve' | 'review' | 'block';

  if (fraudScore >= 0.8) {
    riskLevel = 'critical';
    recommendation = 'block';
  } else if (fraudScore >= 0.6) {
    riskLevel = 'high';
    recommendation = 'review';
  } else if (fraudScore >= 0.3) {
    riskLevel = 'medium';
    recommendation = 'review';
  } else {
    riskLevel = 'low';
    recommendation = 'approve';
  }

  return {
    fraudScore: Math.min(fraudScore, 1.0),
    riskLevel,
    riskFactors,
    recommendation
  };
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
      throw new Error('No authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { transaction, saveToDatabase = false } = await req.json();

    // Analyze the transaction
    const analysis = analyzeTransactionForFraud(transaction);
    
    console.log('Transaction analysis completed:', {
      merchant: transaction.merchant,
      amount: transaction.amount,
      fraudScore: analysis.fraudScore,
      recommendation: analysis.recommendation
    });

    // Optionally save to database
    if (saveToDatabase) {
      // Create transaction record
      const { data: transactionRecord, error: insertError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          transaction_id: crypto.randomUUID(),
          amount: transaction.amount,
          merchant: transaction.merchant,
          category: transaction.category,
          location: transaction.location,
          status: analysis.recommendation === 'block' ? 'blocked' : 
                  analysis.recommendation === 'review' ? 'flagged' : 'approved',
          fraud_score: analysis.fraudScore,
          risk_level: analysis.riskLevel
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error saving transaction:', insertError);
        throw insertError;
      }

      // Create fraud alert if high risk
      if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
        await supabase
          .from('fraud_alerts')
          .insert([{
            transaction_id: transactionRecord.id,
            alert_type: 'suspicious_amount',
            severity: analysis.riskLevel,
            message: `High-risk transaction detected: ${analysis.riskFactors.join(', ')}`,
            status: 'active'
          }]);
      }

      // Save training data
      await supabase
        .from('model_training_data')
        .insert([{
          transaction_id: transactionRecord.id,
          features: {
            amount: transaction.amount,
            merchant: transaction.merchant,
            category: transaction.category,
            location: transaction.location,
            fraud_score: analysis.fraudScore
          },
          label: analysis.recommendation === 'block'
        }]);
    }

    return new Response(JSON.stringify({
      analysis,
      timestamp: new Date().toISOString(),
      status: 'success'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in analyze-transaction function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);