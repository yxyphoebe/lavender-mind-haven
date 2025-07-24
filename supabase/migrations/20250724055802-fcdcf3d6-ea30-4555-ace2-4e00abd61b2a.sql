-- Update Q1 options to use the uploaded images
UPDATE public.onboarding_options 
SET image_url = '/lovable-uploads/291c86a5-511a-40ed-b907-45d770aaf6c0.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q1')
  AND option_key = 'A';

UPDATE public.onboarding_options 
SET image_url = '/lovable-uploads/f0fa740a-aa96-4236-9de6-5f555e656b8f.png'
WHERE question_id = (SELECT id FROM public.onboarding_questions WHERE question_key = 'Q1')
  AND option_key = 'B';