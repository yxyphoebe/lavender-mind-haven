
-- 删除不再需要的 message 和 message_type 字段
ALTER TABLE public.chats 
DROP COLUMN message,
DROP COLUMN message_type;
