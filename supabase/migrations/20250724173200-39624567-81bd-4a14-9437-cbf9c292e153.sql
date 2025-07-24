-- Update Q4 option images with correct URLs
UPDATE public.onboarding_options 
SET image_url = '/src/assets/quite-beach.png'
WHERE option_key = 'solo_bali';

UPDATE public.onboarding_options 
SET image_url = '/src/assets/spain-party.png'
WHERE option_key = 'spain_friends';