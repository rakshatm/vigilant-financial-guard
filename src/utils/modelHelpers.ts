
export type TransactionInput = {
  transaction_amount: number;
  account_balance: number;
  transaction_type: string;
  merchant_category: string;
  transaction_hour: number;
  device_type: string;
  day_of_week: number;
  state: string;
  city: string;
  location: string;
  currency: string;
};

// In a real implementation, this would call a backend API
// For demo, we'll simulate a prediction with logic close to the model
export const predictFraud = (input: TransactionInput): {
  fraudProbability: number;
  contributingFactors: { factor: string; impact: number }[];
} => {
  // Simple heuristic model for demo purposes
  let baseProbability = 0.05;
  const factors: { factor: string; impact: number }[] = [];
  
  // Large transaction relative to balance
  const amtToBalanceRatio = input.transaction_amount / (input.account_balance || 1);
  if (amtToBalanceRatio > 0.5) {
    baseProbability += 0.15;
    factors.push({ factor: "High transaction to balance ratio", impact: 0.15 });
  }
  
  // Unusual hour (late night)
  if (input.transaction_hour >= 23 || input.transaction_hour <= 4) {
    baseProbability += 0.10;
    factors.push({ factor: "Unusual transaction hour", impact: 0.10 });
  }
  
  // High-risk merchant categories
  if (['gambling', 'cryptocurrency', 'money_transfer', 'electronics'].includes(input.merchant_category.toLowerCase())) {
    baseProbability += 0.12;
    factors.push({ factor: "High-risk merchant category", impact: 0.12 });
  }
  
  // International or unusual location
  if (input.location === 'International' || input.location === 'Different State') {
    baseProbability += 0.20;
    factors.push({ factor: "Unusual transaction location", impact: 0.20 });
  }
  
  // Weekend transaction
  if (input.day_of_week >= 5) {  // 5 = Saturday, 6 = Sunday
    baseProbability += 0.03;
    factors.push({ factor: "Weekend transaction", impact: 0.03 });
  }
  
  // Digital transaction types are higher risk
  if (['online', 'digital', 'contactless'].includes(input.transaction_type.toLowerCase())) {
    baseProbability += 0.08;
    factors.push({ factor: "Higher-risk transaction type", impact: 0.08 });
  }

  // Foreign currency
  if (input.currency !== 'INR') {
    baseProbability += 0.05;
    factors.push({ factor: "Foreign currency", impact: 0.05 });
  }
  
  // Cap the probability
  baseProbability = Math.min(baseProbability, 0.95);
  
  // Sort factors by impact
  factors.sort((a, b) => b.impact - a.impact);
  
  return {
    fraudProbability: parseFloat(baseProbability.toFixed(2)),
    contributingFactors: factors
  };
};

export const getRiskLevel = (probability: number): "Low" | "Medium" | "High" => {
  if (probability < 0.3) return "Low";
  if (probability < 0.7) return "Medium";
  return "High";
};
