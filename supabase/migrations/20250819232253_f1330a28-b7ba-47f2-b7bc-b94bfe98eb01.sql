-- Drop the problematic trigger that tries to update non-existent updated_at field
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;