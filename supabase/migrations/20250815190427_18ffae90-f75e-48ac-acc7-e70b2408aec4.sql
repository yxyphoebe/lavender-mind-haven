-- Add notifications_enabled field to users table
ALTER TABLE public.users 
ADD COLUMN notifications_enabled boolean NOT NULL DEFAULT true;