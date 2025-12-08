-- Enable realtime for fraud_alerts table
ALTER TABLE public.fraud_alerts REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.fraud_alerts;