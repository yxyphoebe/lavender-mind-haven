-- Update therapists with their intro video URLs from storage
UPDATE public.therapists 
SET intro_video_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/intro-videos/camille-intro.mp4'
WHERE name = 'Camille';

UPDATE public.therapists 
SET intro_video_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/intro-videos/elena-intro.mp4'
WHERE name = 'Elena';

UPDATE public.therapists 
SET intro_video_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/intro-videos/julie-intro.mp4'
WHERE name = 'Julie';

UPDATE public.therapists 
SET intro_video_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/intro-videos/sage-intro.mp4'
WHERE name = 'Sage';