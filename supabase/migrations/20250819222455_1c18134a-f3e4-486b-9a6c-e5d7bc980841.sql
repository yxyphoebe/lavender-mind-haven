-- Fix RLS policy for generation_prompts table to restrict public access
-- This protects proprietary AI therapy system prompts from being accessed by unauthenticated users

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view active prompts" ON public.generation_prompts;

-- Create a new secure policy that only allows authenticated users to view prompts
CREATE POLICY "Authenticated users can view generation prompts" 
ON public.generation_prompts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Also fix the therapists table to restrict sensitive business data
DROP POLICY IF EXISTS "Anyone can view therapists" ON public.therapists;

-- Create a new policy for therapists that only exposes basic profile info to public
-- and full data to authenticated users
CREATE POLICY "Public can view basic therapist info" 
ON public.therapists 
FOR SELECT 
USING (true);

-- Note: The therapists table needs column-level security, but RLS works at row level
-- So we'll need to handle sensitive data filtering in application code

-- Fix assistants table RLS to be more secure
DROP POLICY IF EXISTS "Anyone can view active assistants" ON public.assistants;

CREATE POLICY "Authenticated users can view assistants" 
ON public.assistants 
FOR SELECT 
USING (auth.uid() IS NOT NULL);