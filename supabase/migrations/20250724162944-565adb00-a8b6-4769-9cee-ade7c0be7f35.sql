-- Update Q2 question and options to match user requirements
UPDATE public.onboarding_questions 
SET question_text = 'What are you more tired of right now?'
WHERE question_key = 'Q2';

-- Update Q2 options
UPDATE public.onboarding_options 
SET 
  option_value = 'City pressure, social obligations, information overload',
  image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/city-pressure.png',
  matching_roles = '["busy", "overwhelmed", "social"]'::jsonb
WHERE question_id = '55c8594b-8ebc-4be6-b0dd-97615987d479' AND option_key = 'A';

UPDATE public.onboarding_options 
SET 
  option_value = 'Emotional entanglement, relationship internal conflict, unspoken worries',
  image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/toxic-relationship.png',
  matching_roles = '["emotional", "relationship", "internal"]'::jsonb
WHERE question_id = '55c8594b-8ebc-4be6-b0dd-97615987d479' AND option_key = 'B';