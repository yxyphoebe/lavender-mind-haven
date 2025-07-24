-- Fix Q4 question ordering - change time_freedom to Q4 and move current Q4 to Q5

-- First, update the current Q4 question to become Q5
UPDATE public.onboarding_questions 
SET 
  question_key = 'Q5',
  question_order = 5
WHERE question_key = 'Q4';

-- Then update the time_freedom question to become Q4
UPDATE public.onboarding_questions 
SET question_key = 'Q4'
WHERE question_key = 'time_freedom';