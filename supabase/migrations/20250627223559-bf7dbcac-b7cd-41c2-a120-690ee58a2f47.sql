
-- 修改 chats 表结构，将对话作为一个整体存储
ALTER TABLE public.chats 
ADD COLUMN conversation JSONB DEFAULT '[]'::jsonb,
ADD COLUMN conversation_started_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 为了保持向后兼容，我们先保留现有字段
-- 新的 conversation 字段将包含完整的对话数组
-- 每个对话包含 user_message, ai_response, timestamp 等信息

-- 添加索引提高查询性能
CREATE INDEX idx_chats_conversation_started_at ON public.chats(conversation_started_at);
