-- Create the daily_messages table
CREATE TABLE public.daily_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_name TEXT,
    therapist_id TEXT,
    therapist_name TEXT,
    message_text TEXT,
    message_type TEXT,
    language TEXT,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add CHECK constraint for message_type
ALTER TABLE public.daily_messages 
ADD CONSTRAINT check_message_type 
CHECK (message_type IN ('text_message', 'video', 'image'));

-- Create indexes for better query performance
CREATE INDEX idx_daily_messages_user_id ON public.daily_messages(user_id);
CREATE INDEX idx_daily_messages_therapist_id ON public.daily_messages(therapist_id);
CREATE INDEX idx_daily_messages_message_type ON public.daily_messages(message_type);
CREATE INDEX idx_daily_messages_language ON public.daily_messages(language);
CREATE INDEX idx_daily_messages_is_used ON public.daily_messages(is_used);

-- Create composite indexes for common query patterns
CREATE INDEX idx_daily_messages_user_unused ON public.daily_messages(user_id, is_used, created_at);
CREATE INDEX idx_daily_messages_therapist_composite ON public.daily_messages(therapist_id, message_type, language);

-- Enable Row Level Security
ALTER TABLE public.daily_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own messages
CREATE POLICY "Users can view their own messages"
ON public.daily_messages
FOR SELECT
USING (auth.uid() = user_id);

-- Authenticated users/system can insert messages
CREATE POLICY "Authenticated users can insert messages"
ON public.daily_messages
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update is_used field of their own messages
CREATE POLICY "Users can update their own message status"
ON public.daily_messages
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only service role can delete messages (admin function)
CREATE POLICY "Service role can delete messages"
ON public.daily_messages
FOR DELETE
USING (auth.jwt() ? 'service_role'::text);