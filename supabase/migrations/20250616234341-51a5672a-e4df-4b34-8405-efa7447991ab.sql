
-- Create a table for therapists
CREATE TABLE public.therapists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age_range TEXT NOT NULL,
  image_url TEXT,
  intro_video_url TEXT,
  style TEXT,
  background_story TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to make therapists publicly readable
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to SELECT therapists (public read access)
CREATE POLICY "Anyone can view therapists" 
  ON public.therapists 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to INSERT therapists (for admin purposes)
CREATE POLICY "Authenticated users can create therapists" 
  ON public.therapists 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy that allows authenticated users to UPDATE therapists (for admin purposes)
CREATE POLICY "Authenticated users can update therapists" 
  ON public.therapists 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to DELETE therapists (for admin purposes)
CREATE POLICY "Authenticated users can delete therapists" 
  ON public.therapists 
  FOR DELETE 
  TO authenticated
  USING (true);
