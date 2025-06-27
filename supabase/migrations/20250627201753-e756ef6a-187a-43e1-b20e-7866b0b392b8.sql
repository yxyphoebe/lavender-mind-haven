
-- 创建存储桶来存储用户上传的图片和视频
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-media', 'chat-media', true);

-- 为存储桶创建访问策略
CREATE POLICY "Users can upload their own media files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media files"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 扩展messages表来支持媒体附件
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]';
