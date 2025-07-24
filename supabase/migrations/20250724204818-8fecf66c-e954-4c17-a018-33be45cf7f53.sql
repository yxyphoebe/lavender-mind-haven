-- Create Q6 question and options

-- Insert Q6 question
INSERT INTO public.onboarding_questions (question_key, question_text, question_order)
VALUES ('Q6', 'If you had a breakdown today, how do you want someone to be there for you?', 6);

-- Insert Option A for Q6
INSERT INTO public.onboarding_options (
  question_id, 
  option_key, 
  option_value, 
  option_order, 
  matching_roles,
  image_url
)
VALUES (
  (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q6'),
  'A',
  'Hold me. Just be here.',
  1,
  '["Camille", "Elena", "Sage"]'::jsonb,
  'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/hug.png'
);

-- Insert Option B for Q6
INSERT INTO public.onboarding_options (
  question_id, 
  option_key, 
  option_value, 
  option_order, 
  matching_roles,
  image_url
)
VALUES (
  (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q6'),
  'B',
  'Say it all. Scream if you need.',
  2,
  '["Leo", "Lani"]'::jsonb,
  'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/yell.png'
);