-- Upload images to bucket and update Q1 options to use correct Supabase bucket URLs
UPDATE public.onboarding_options 
SET image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/emotional-rollercoaster.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q1')
  AND option_key = 'A';

UPDATE public.onboarding_options 
SET image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/emotional-fog.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q1')
  AND option_key = 'B';