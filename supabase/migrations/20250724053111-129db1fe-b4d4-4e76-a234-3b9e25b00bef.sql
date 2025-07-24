-- Fix image URLs to use existing images in the project
UPDATE public.onboarding_options 
SET image_url = '/lovable-uploads/e5145042-25e5-46f0-9113-483ac08026d6.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q1')
  AND option_key = 'A';

UPDATE public.onboarding_options 
SET image_url = '/lovable-uploads/e5145042-25e5-46f0-9113-483ac08026d6.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q1')
  AND option_key = 'B';