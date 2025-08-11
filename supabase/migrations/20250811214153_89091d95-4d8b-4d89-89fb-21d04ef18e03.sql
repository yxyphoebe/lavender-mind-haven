
-- 将 therapists.background_music_url 统一改为使用小写名字的音频文件
-- 路径：public/music/<lower(therapist_name)>.mp3
-- 空格 -> %20，只有当当前 URL 与计算出的“正确 URL”不一致时才更新

WITH computed AS (
  SELECT
    id,
    'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/music/' ||
    replace(lower(name), ' ', '%20') ||
    '.mp3' AS url
  FROM public.therapists
)
UPDATE public.therapists t
SET background_music_url = c.url
FROM computed c
WHERE t.id = c.id
  AND (t.background_music_url IS DISTINCT FROM c.url);
