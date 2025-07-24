UPDATE onboarding_options 
SET matching_roles = '["Sage", "Camille"]'::jsonb 
WHERE option_value = '城市高压生活压力' AND option_key = 'city-pressure';