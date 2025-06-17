
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can create therapists" ON public.therapists;
DROP POLICY IF EXISTS "Authenticated users can update therapists" ON public.therapists;
DROP POLICY IF EXISTS "Authenticated users can delete therapists" ON public.therapists;

-- Update the existing policy to allow anyone to view therapists (keep this one)
-- CREATE POLICY "Anyone can view therapists" ON public.therapists FOR SELECT USING (true);
-- (This policy already exists, so we don't need to recreate it)

-- Create a more permissive policy for inserting therapists (for initial population)
CREATE POLICY "Anyone can create therapists" 
  ON public.therapists 
  FOR INSERT 
  WITH CHECK (true);

-- Create policies for authenticated users to manage therapists
CREATE POLICY "Authenticated users can update therapists" 
  ON public.therapists 
  FOR UPDATE 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete therapists" 
  ON public.therapists 
  FOR DELETE 
  TO authenticated
  USING (true);
