-- Update Q1 Option A: Change matching_roles from [Sage, Camille, Elias] to [Sage, Camille, Elena]
UPDATE onboarding_options 
SET matching_roles = '["Sage", "Camille", "Elena"]'::jsonb
WHERE question_id = (SELECT id FROM onboarding_questions WHERE question_key = 'Q1')
AND option_key = 'A';

-- Update Q2 Option B: Change matching_roles from [Jade, Leo, Elena] to [Elena, Camille]
UPDATE onboarding_options 
SET matching_roles = '["Elena", "Camille"]'::jsonb
WHERE question_id = (SELECT id FROM onboarding_questions WHERE question_key = 'Q2')
AND option_key = 'B';