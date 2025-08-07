-- First, update the check constraint to allow 'welcome' prompt type
ALTER TABLE generation_prompts 
DROP CONSTRAINT IF EXISTS check_prompt_type;

ALTER TABLE generation_prompts 
ADD CONSTRAINT check_prompt_type 
CHECK (prompt_type IN ('text', 'welcome'));

-- Then add welcome prompt for Sage
INSERT INTO generation_prompts (
  therapist_id,
  therapist_name,
  prompt_type,
  language,
  prompt_text,
  active
) VALUES (
  '6f359330-3e4a-4b63-83de-60a54da84f06',
  'Sage',
  'welcome',
  'en',
  'Hey, I''ve been waiting for you. 🌿
Let''s begin gently — how are you feeling today?',
  true
);