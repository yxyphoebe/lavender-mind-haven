-- Update Q2 option A ("城市高压") to remove Elias from matching_roles
UPDATE onboarding_options 
SET matching_roles = '["Sage", "Camille"]'::jsonb
WHERE option_value = '城市高压';