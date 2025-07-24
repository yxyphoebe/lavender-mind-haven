-- Update the existing Q3 question text
UPDATE public.onboarding_questions 
SET question_text = 'Picture your future. Which path feels most like coming home?'
WHERE question_key = 'Q3' AND question_order = 3;

-- Delete the old Q3 options
DELETE FROM public.onboarding_options 
WHERE question_id = 'c66d76a9-a9fb-4020-a04e-f09b7b5b2888';

-- Add the new Q3 options
INSERT INTO public.onboarding_options (id, question_id, option_order, option_value, option_key, image_url, matching_roles)
VALUES 
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
    'c66d76a9-a9fb-4020-a04e-f09b7b5b2888',
    1,
    'Waking up by the seaside, living at a leisurely pace',
    'A',
    'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/beach-women.png',
    '["Sage", "Camille"]'::jsonb
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567892',
    'c66d76a9-a9fb-4020-a04e-f09b7b5b2888',
    2,
    'Thriving in fast-paced city center life',
    'B',
    'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/successful-woman.png',
    '["Jade", "Leo", "Lani"]'::jsonb
  );