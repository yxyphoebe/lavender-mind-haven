-- Add therapist_weights column to onboarding_options table
ALTER TABLE onboarding_options 
ADD COLUMN therapist_weights jsonb DEFAULT '{}'::jsonb;

-- Update Q3-B option to give Jade 2 points, Leo and Lani 1 point each
UPDATE onboarding_options 
SET therapist_weights = '{"Jade": 2, "Leo": 1, "Lani": 1}'::jsonb
WHERE option_value = 'Thriving in fast-paced city center life' 
  AND option_key = 'B' 
  AND question_id = (
    SELECT id FROM onboarding_questions 
    WHERE question_key = 'Q3' OR question_order = 3
  );