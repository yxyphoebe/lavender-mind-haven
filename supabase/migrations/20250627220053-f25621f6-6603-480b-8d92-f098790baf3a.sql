
-- 创建 chats 表来存储聊天记录
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  therapist_id UUID REFERENCES public.therapists(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'ai')),
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 为 chats 表启用 RLS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：用户只能查看自己的聊天记录
CREATE POLICY "Users can view their own chats" 
  ON public.chats 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

-- 创建 RLS 策略：用户只能插入自己的聊天记录
CREATE POLICY "Users can insert their own chats" 
  ON public.chats 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

-- 创建 RLS 策略：用户只能更新自己的聊天记录
CREATE POLICY "Users can update their own chats" 
  ON public.chats 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

-- 创建 RLS 策略：用户只能删除自己的聊天记录
CREATE POLICY "Users can delete their own chats" 
  ON public.chats 
  FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- 创建索引以提高查询性能
CREATE INDEX idx_chats_user_id ON public.chats(user_id);
CREATE INDEX idx_chats_therapist_id ON public.chats(therapist_id);
CREATE INDEX idx_chats_created_at ON public.chats(created_at);

-- 创建触发器来自动更新 updated_at 字段
CREATE TRIGGER update_chats_updated_at 
  BEFORE UPDATE ON public.chats 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
