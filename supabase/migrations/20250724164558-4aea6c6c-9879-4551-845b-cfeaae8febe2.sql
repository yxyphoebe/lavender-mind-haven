-- Add Q3 question and options
INSERT INTO public.onboarding_questions (id, question_order, question_text, question_key)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, 'Picture your future. Which path feels most like coming home?', 'Q3');

-- Add Q3 Option A
INSERT INTO public.onboarding_options (id, question_id, option_order, option_value, option_key, image_url, matching_roles)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  '在海边醒来、慢悠悠度日',
  'A',
  'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/beach-women.png',
  '["Sage", "Camille"]'::jsonb
);

-- Add Q3 Option B
INSERT INTO public.onboarding_options (id, question_id, option_order, option_value, option_key, image_url, matching_roles)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567892',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2,
  '在城市中心快节奏生活中发光发热',
  'B',
  'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/successful-woman.png',
  '["Jade", "Leo", "Lani"]'::jsonb
);