
export type TransactionType = {
  id: string;
  amount: number;
  currency: string;
  type: string;
  merchantCategory: string;
  device: string;
  location: string;
  date: string;
  time: string;
  accountBalance: number;
  status: "Approved" | "Rejected" | "Pending";
  risk: "High" | "Medium" | "Low";
  fraudProbability: number;
  customerName?: string;
};

export const mockTransactions: TransactionType[] = [
  {
    id: "T12345678",
    amount: 1250.75,
    currency: "USD",
    type: "Online",
    merchantCategory: "Electronics",
    device: "Mobile",
    location: "Different State",
    date: "2025-05-12",
    time: "14:25:30",
    accountBalance: 5420.33,
    status: "Approved",
    risk: "Low",
    fraudProbability: 0.12,
    customerName: "Alice Johnson"
  },
  {
    id: "T12345679",
    amount: 3999.99,
    currency: "USD",
    type: "Online",
    merchantCategory: "Travel",
    device: "Desktop",
    location: "International",
    date: "2025-05-13",
    time: "03:15:22",
    accountBalance: 4500.10,
    status: "Rejected",
    risk: "High",
    fraudProbability: 0.92,
    customerName: "Bob Smith"
  },
  {
    id: "T12345680",
    amount: 89.50,
    currency: "USD",
    type: "In-Store",
    merchantCategory: "Grocery",
    device: "Card Present",
    location: "Local",
    date: "2025-05-13",
    time: "09:45:11",
    accountBalance: 2350.25,
    status: "Approved",
    risk: "Low",
    fraudProbability: 0.05,
    customerName: "Carol Davis"
  },
  {
    id: "T12345681",
    amount: 1750.00,
    currency: "USD",
    type: "ATM",
    merchantCategory: "Cash Withdrawal",
    device: "ATM",
    location: "Different City",
    date: "2025-05-12",
    time: "22:10:45",
    accountBalance: 2150.75,
    status: "Pending",
    risk: "Medium",
    fraudProbability: 0.45,
    customerName: "David Wilson"
  },
  {
    id: "T12345682",
    amount: 499.99,
    currency: "EUR",
    type: "Online",
    merchantCategory: "Digital Services",
    device: "Tablet",
    location: "International",
    date: "2025-05-11",
    time: "16:30:20",
    accountBalance: 3700.50,
    status: "Approved",
    risk: "Low",
    fraudProbability: 0.18,
    customerName: "Emma Brown"
  },
  {
    id: "T12345683",
    amount: 5250.00,
    currency: "USD",
    type: "Wire Transfer",
    merchantCategory: "Financial Services",
    device: "Online Banking",
    location: "Different State",
    date: "2025-05-10",
    time: "11:05:33",
    accountBalance: 6500.25,
    status: "Rejected",
    risk: "High",
    fraudProbability: 0.87,
    customerName: "Frank Miller"
  }
];

export const fraudFactors = [
  { factor: "Unusual Location", impact: "High", description: "Transaction occurred in a location different from customer's regular pattern" },
  { factor: "Odd Hour", impact: "Medium", description: "Transaction was made during unusual hours for this customer" },
  { factor: "Amount Anomaly", impact: "High", description: "Transaction amount significantly higher than customer's typical spending" },
  { factor: "Multiple Attempts", impact: "Medium", description: "Multiple transactions in short succession" },
  { factor: "New Device", impact: "Medium", description: "Transaction from a device not previously used by this customer" },
  { factor: "High-Risk Merchant", impact: "Low", description: "Merchant category associated with higher fraud rates" },
  { factor: "Balance Ratio", impact: "Medium", description: "Transaction amount high relative to account balance" },
];

export const fraudMetrics = {
  totalTransactions: 12435,
  fraudulentTransactions: 237,
  fraudRate: 1.91,
  avgFraudAmount: 2150.75,
  savingsFromPrevention: 427320.50,
  currentMonthFraudChange: -12.3,
};

export const weeklyFraudData = [
  { name: "Mon", fraudCount: 32, legitCount: 1542 },
  { name: "Tue", fraudCount: 28, legitCount: 1648 },
  { name: "Wed", fraudCount: 41, legitCount: 1720 },
  { name: "Thu", fraudCount: 35, legitCount: 1890 },
  { name: "Fri", fraudCount: 52, legitCount: 2240 },
  { name: "Sat", fraudCount: 31, legitCount: 1730 },
  { name: "Sun", fraudCount: 18, legitCount: 1210 }
];
