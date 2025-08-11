
-- 将 Elena 的背景图与音乐填入 therapists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.therapists WHERE name = 'Elena') THEN
    UPDATE public.therapists
    SET
      background_image_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/background-images/elena.png',
      background_music_url = 'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/music/elena.mp3',
      updated_at = now()
    WHERE name = 'Elena';
  ELSE
    INSERT INTO public.therapists (
      name,
      age_range,
      style,
      background_image_url,
      background_music_url
    )
    VALUES (
      'Elena',
      '45',
      'Warm grounded woman, speaks like caring mother, firm yet gentle with deep life experience',
      'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/background-images/elena.png',
      'https://vsiiedactvlzdvprwgkq.supabase.co/storage/v1/object/public/music/elena.mp3'
    );
  END IF;
END
$$;
