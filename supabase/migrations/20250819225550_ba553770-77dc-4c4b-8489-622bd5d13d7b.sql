-- Remove unused columns from users table
ALTER TABLE public.users 
DROP COLUMN IF EXISTS avatar_choice,
DROP COLUMN IF EXISTS personality_type,
DROP COLUMN IF EXISTS preferred_language;

-- Add therapist_name column
ALTER TABLE public.users 
ADD COLUMN therapist_name TEXT;

-- Update the handle_new_user function to better sync user names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.users (
    id,
    name,
    email,
    created_at,
    onboarding_completed,
    last_active,
    timezone
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'given_name' || ' ' || NEW.raw_user_meta_data->>'family_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    NOW(),
    false,
    NOW(),
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  );
  RETURN NEW;
END;
$function$;