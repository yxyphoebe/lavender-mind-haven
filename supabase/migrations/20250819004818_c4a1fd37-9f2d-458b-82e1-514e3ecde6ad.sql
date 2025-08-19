-- Create assistants table
CREATE TABLE public.assistants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  personality TEXT,
  system_prompt TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active assistants" 
ON public.assistants 
FOR SELECT 
USING (active = true);

CREATE POLICY "Authenticated users can manage assistants" 
ON public.assistants 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Add update trigger
CREATE TRIGGER update_assistants_updated_at
BEFORE UPDATE ON public.assistants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default feedback assistant
INSERT INTO public.assistants (name, role, personality, system_prompt) VALUES (
  'Assistant',
  'feedback',
  'A helpful and empathetic assistant focused on gathering user feedback and providing support.',
  'You are a helpful assistant designed to gather user feedback and provide support. You should be empathetic, understanding, and focused on helping users share their thoughts and experiences. Ask clarifying questions when needed and provide thoughtful responses that make users feel heard and valued.'
);