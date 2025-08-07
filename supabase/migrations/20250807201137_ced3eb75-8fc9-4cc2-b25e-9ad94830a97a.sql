-- Create the generation_prompts table
CREATE TABLE public.generation_prompts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    therapist_id TEXT NOT NULL,
    therapist_name TEXT NOT NULL,
    prompt_type TEXT NOT NULL,
    language TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add CHECK constraint for prompt_type
ALTER TABLE public.generation_prompts 
ADD CONSTRAINT check_prompt_type 
CHECK (prompt_type IN ('text', 'video', 'image'));

-- Create indexes for better query performance
CREATE INDEX idx_generation_prompts_therapist_id ON public.generation_prompts(therapist_id);
CREATE INDEX idx_generation_prompts_prompt_type ON public.generation_prompts(prompt_type);
CREATE INDEX idx_generation_prompts_language ON public.generation_prompts(language);
CREATE INDEX idx_generation_prompts_active ON public.generation_prompts(active);

-- Create composite index for common query patterns
CREATE INDEX idx_generation_prompts_composite ON public.generation_prompts(therapist_id, prompt_type, language, active);

-- Enable Row Level Security
ALTER TABLE public.generation_prompts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Anyone can view active prompts, authenticated users can view all
CREATE POLICY "Anyone can view active prompts"
ON public.generation_prompts
FOR SELECT
USING (active = true OR auth.uid() IS NOT NULL);

-- Only authenticated users can insert prompts
CREATE POLICY "Authenticated users can insert prompts"
ON public.generation_prompts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update prompts
CREATE POLICY "Authenticated users can update prompts"
ON public.generation_prompts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users can delete prompts
CREATE POLICY "Authenticated users can delete prompts"
ON public.generation_prompts
FOR DELETE
TO authenticated
USING (true);