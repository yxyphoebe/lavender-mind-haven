-- Add image_url field to assistants table
ALTER TABLE public.assistants 
ADD COLUMN image_url text;

-- Update the feedback assistant with the image URL
UPDATE public.assistants 
SET image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/therapist-images/assistant.png'
WHERE role = 'feedback' AND active = true;