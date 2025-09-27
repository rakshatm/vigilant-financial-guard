-- Fix security warning: Add missing RLS policy for model_training_data table

CREATE POLICY "Users can view training data for their transactions" 
ON public.model_training_data 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.transactions 
  WHERE transactions.id = model_training_data.transaction_id 
  AND transactions.user_id = auth.uid()
));