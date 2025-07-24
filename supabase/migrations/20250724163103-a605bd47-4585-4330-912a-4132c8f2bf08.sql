-- Update Q2 option matching roles to correct therapists
UPDATE public.onboarding_options 
SET matching_roles = '["Sage", "Camille", "Elias"]'::jsonb
WHERE question_id = '55c8594b-8ebc-4be6-b0dd-97615987d479' AND option_key = 'A';

UPDATE public.onboarding_options 
SET matching_roles = '["Jade", "Leo", "Elena"]'::jsonb
WHERE question_id = '55c8594b-8ebc-4be6-b0dd-97615987d479' AND option_key = 'B';