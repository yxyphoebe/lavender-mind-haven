-- Add background image and music URL columns to therapists table
ALTER TABLE public.therapists 
ADD COLUMN background_image_url text,
ADD COLUMN background_music_url text;