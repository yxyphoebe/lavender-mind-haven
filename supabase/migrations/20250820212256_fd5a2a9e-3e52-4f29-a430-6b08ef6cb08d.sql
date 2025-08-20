-- Fix the inconsistent therapist data for user PY
UPDATE users 
SET selected_therapist_id = '6f359330-3e4a-4b63-83de-60a54da84f06'
WHERE email = 'yxyphoebe@gmail.com' AND therapist_name = 'Sage';