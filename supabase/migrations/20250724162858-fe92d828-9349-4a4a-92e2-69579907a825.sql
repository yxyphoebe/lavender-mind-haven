-- Add Q2 onboarding question and options
INSERT INTO public.onboarding_questions (question_key, question_text, question_order)
VALUES ('Q2', 'What are you more tired of right now?', 2);

-- Insert Q2 options
INSERT INTO public.onboarding_options (
  question_id, 
  option_key, 
  option_value, 
  option_order,
  image_url,
  matching_roles
)
VALUES 
(
  (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q2'),
  'A',
  'City pressure, social obligations, information overload',
  1,
  'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/city-pressure.png',
  '["busy", "overwhelmed", "social"]'::jsonb
),
(
  (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q2'),
  'B', 
  'Emotional entanglement, relationship internal conflict, unspoken worries',
  2,
  'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/toxic-relationship.png',
  '["emotional", "relationship", "internal"]'::jsonb
);