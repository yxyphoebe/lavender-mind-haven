-- Update Q1 question text
UPDATE public.onboarding_questions 
SET question_text = 'How have your emotions been lately?'
WHERE question_key = 'q1';

-- Update Q1 Option A
UPDATE public.onboarding_options 
SET 
  option_value = 'Emotional rollercoaster - many different emotions in a day',
  matching_roles = '["Sage", "Camille", "Elias"]'::jsonb,
  image_url = '/lovable-uploads/be5d8865-92e0-4e3f-89e8-4d2bd1a29d02.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'q1')
  AND option_key = 'a';

-- Update Q1 Option B  
UPDATE public.onboarding_options 
SET 
  option_value = 'Like fog - unclear but something feels off',
  matching_roles = '["Jade", "Leo", "Elena"]'::jsonb,
  image_url = '/lovable-uploads/9ef540e2-467c-4a82-87ce-c94bf59eb342.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'q1')
  AND option_key = 'b';