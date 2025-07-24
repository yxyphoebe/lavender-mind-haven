-- Add Q4 to onboarding questions
INSERT INTO public.onboarding_questions (question_order, question_text, question_key)
VALUES (4, 'If time and plans melted away, how would you spend two weeks just for you?', 'time_freedom');

-- Get the question ID for Q4 to add options
DO $$
DECLARE
    q4_id uuid;
BEGIN
    SELECT id INTO q4_id FROM public.onboarding_questions WHERE question_key = 'time_freedom';
    
    -- Add Option A: Solo Bali trip
    INSERT INTO public.onboarding_options (
        question_id, 
        option_order, 
        option_value, 
        option_key, 
        matching_roles,
        image_url
    ) VALUES (
        q4_id,
        1,
        'Solo trip to Bali, beachside journaling and self-reflection',
        'solo_bali',
        '["Elena", "Elias", "Sage"]'::jsonb,
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=800&fit=crop'
    );
    
    -- Add Option B: Spain with friends
    INSERT INTO public.onboarding_options (
        question_id, 
        option_order, 
        option_value, 
        option_key, 
        matching_roles,
        image_url
    ) VALUES (
        q4_id,
        2,
        'Friends trip to Spain, street dancing, tapas, vibrant daily life',
        'spain_friends',
        '["Lani", "Leo"]'::jsonb,
        'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=800&fit=crop'
    );
END $$;