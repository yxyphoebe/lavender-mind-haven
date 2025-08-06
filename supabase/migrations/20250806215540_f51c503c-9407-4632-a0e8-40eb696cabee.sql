-- Create conversation ratings table
CREATE TABLE public.conversation_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id UUID,
  session_id UUID,
  rating TEXT NOT NULL CHECK (rating IN ('thumbs_up', 'thumbs_down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversation_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own ratings" 
ON public.conversation_ratings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ratings" 
ON public.conversation_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.conversation_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);