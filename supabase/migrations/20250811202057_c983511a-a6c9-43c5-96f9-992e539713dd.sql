
-- 为每位 Therapist 设置背景音乐 URL（仅在为空时填充），
-- 假设音乐文件位于公开桶 `music`，文件名为 "<TherapistName>.mp3"
UPDATE public.therapists
SET background_music_url =
  'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/music/'
  || replace(name, ' ', '%20') || '.mp3'
WHERE (background_music_url IS NULL OR background_music_url = '');
