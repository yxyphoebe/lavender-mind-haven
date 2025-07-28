-- Update option B for the onboarding question about two weeks
UPDATE onboarding_options 
SET 
  option_value = 'Dancing with friends under Miami skies',
  image_url = '/onboarding-images/miami.png',
  updated_at = now()
WHERE option_value = 'Friends trip to Spain, street dancing, tapas, vibrant daily life';