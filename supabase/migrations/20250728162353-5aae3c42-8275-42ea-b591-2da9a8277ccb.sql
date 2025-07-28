-- Update option B image URL to use full Supabase storage URL
UPDATE onboarding_options 
SET 
  image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/onboarding-images/miami.png',
  updated_at = now()
WHERE option_value = 'Dancing with friends under Miami skies';