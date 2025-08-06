-- Add tavus_config column to therapists table
ALTER TABLE public.therapists 
ADD COLUMN tavus_config JSONB DEFAULT '{}'::JSONB;