-- Update Q5 question text and options

-- Update the Q5 question text
UPDATE public.onboarding_questions 
SET 
  question_text = 'When you open your heart, what kind of support feels right?'
WHERE question_key = 'Q5';

-- Update Option A for Q5
UPDATE public.onboarding_options 
SET 
  option_value = 'Stay beside you, quietly.',
  matching_roles = '["Elena", "Sage"]'::jsonb,
  image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/stay-beside.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q5')
  AND option_key = 'A';

-- Update Option B for Q5
UPDATE public.onboarding_options 
SET 
  option_value = 'Help you unpack it, step by step.',
  matching_roles = '["Jade", "Elias"]'::jsonb,
  image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/step-by-step.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q5')
  AND option_key = 'B';