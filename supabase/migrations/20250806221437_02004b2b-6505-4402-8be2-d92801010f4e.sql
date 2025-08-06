-- Make therapist-images bucket public for image access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'therapist-images';

-- Update therapist image URLs to use storage bucket images
UPDATE public.therapists 
SET image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/therapist-images/camille.png'
WHERE name = 'Camille';

UPDATE public.therapists 
SET image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/therapist-images/elena.png'
WHERE name = 'Elena';

UPDATE public.therapists 
SET image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/therapist-images/sage.png'
WHERE name = 'Sage';

UPDATE public.therapists 
SET image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/therapist-images/julie.png'
WHERE name = 'Julie';