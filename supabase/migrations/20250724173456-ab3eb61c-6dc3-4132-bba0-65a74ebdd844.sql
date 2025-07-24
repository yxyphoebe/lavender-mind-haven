-- Upload images to storage and update option keys and URLs for Q4
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES 
  ('onboarding-images', 'quite-beach.png', null, '{"content-type": "image/png"}'::jsonb),
  ('onboarding-images', 'spain-party.png', null, '{"content-type": "image/png"}'::jsonb)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Update option keys and image URLs
UPDATE public.onboarding_options 
SET 
  option_key = 'A',
  image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images//quite-beach.png'
WHERE option_key = 'solo_bali';

UPDATE public.onboarding_options 
SET 
  option_key = 'B', 
  image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images//spain-party.png'
WHERE option_key = 'spain_friends';