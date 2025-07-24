-- Create onboarding_questions table
CREATE TABLE public.onboarding_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_key TEXT NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create onboarding_options table
CREATE TABLE public.onboarding_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.onboarding_questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  option_value TEXT NOT NULL,
  image_url TEXT,
  matching_roles JSONB NOT NULL DEFAULT '[]'::jsonb,
  option_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_options ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view onboarding questions"
ON public.onboarding_questions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view onboarding options"
ON public.onboarding_options
FOR SELECT
USING (true);

-- Create policies for authenticated users to manage (admin purposes)
CREATE POLICY "Authenticated users can manage onboarding questions"
ON public.onboarding_questions
FOR ALL
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage onboarding options"
ON public.onboarding_options
FOR ALL
TO authenticated
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_onboarding_questions_order ON public.onboarding_questions(question_order);
CREATE INDEX idx_onboarding_options_question_id ON public.onboarding_options(question_id);
CREATE INDEX idx_onboarding_options_order ON public.onboarding_options(option_order);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_onboarding_questions_updated_at
BEFORE UPDATE ON public.onboarding_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_options_updated_at
BEFORE UPDATE ON public.onboarding_options
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert current questions
INSERT INTO public.onboarding_questions (question_key, question_text, question_order) VALUES
('Q1', 'When you''re going through something, how do you usually process it?', 1),
('Q2', 'Which of these do you relate to most right now?', 2),
('Q3', 'What kind of support would feel most comforting to you now?', 3),
('Q4', 'If you had to choose a vibe right now...', 4);

-- Insert options with matching roles based on current logic
INSERT INTO public.onboarding_options (question_id, option_key, option_value, matching_roles, option_order)
SELECT 
  q.id,
  'A',
  'talk-emotions',
  '["Lani", "Maya"]'::jsonb,
  1
FROM public.onboarding_questions q WHERE q.question_key = 'Q1'
UNION ALL
SELECT 
  q.id,
  'B',
  'logical-thinking',
  '["Alex", "Leo"]'::jsonb,
  2
FROM public.onboarding_questions q WHERE q.question_key = 'Q1'
UNION ALL
SELECT 
  q.id,
  'A',
  'emotionally-overwhelmed',
  '["Lani", "Maya"]'::jsonb,
  1
FROM public.onboarding_questions q WHERE q.question_key = 'Q2'
UNION ALL
SELECT 
  q.id,
  'B',
  'stuck-decisions',
  '["Alex", "Leo"]'::jsonb,
  2
FROM public.onboarding_questions q WHERE q.question_key = 'Q2'
UNION ALL
SELECT 
  q.id,
  'A',
  'warm-motherly',
  '["Lani", "Maya"]'::jsonb,
  1
FROM public.onboarding_questions q WHERE q.question_key = 'Q3'
UNION ALL
SELECT 
  q.id,
  'B',
  'calm-grounded',
  '["Alex", "Leo"]'::jsonb,
  2
FROM public.onboarding_questions q WHERE q.question_key = 'Q3'
UNION ALL
SELECT 
  q.id,
  'A',
  'cozy-tea',
  '["Lani", "Maya"]'::jsonb,
  1
FROM public.onboarding_questions q WHERE q.question_key = 'Q4'
UNION ALL
SELECT 
  q.id,
  'B',
  'clean-desk',
  '["Alex", "Leo"]'::jsonb,
  2
FROM public.onboarding_questions q WHERE q.question_key = 'Q4';