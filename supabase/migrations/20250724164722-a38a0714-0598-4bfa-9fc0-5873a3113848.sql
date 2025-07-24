-- Update Q3 options to English
UPDATE public.onboarding_options 
SET option_value = 'Waking up by the seaside, living at a leisurely pace'
WHERE question_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND option_key = 'A';

UPDATE public.onboarding_options 
SET option_value = 'Thriving in fast-paced city center life'
WHERE question_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND option_key = 'B';