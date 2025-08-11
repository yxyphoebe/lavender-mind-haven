
DO $$
DECLARE
  v_tid TEXT;
  v_text_id UUID;
  v_welcome_id UUID;
BEGIN
  -- 1) 找到 Elena 的 therapist_id（generation_prompts.therapist_id 是 TEXT）
  SELECT id::text INTO v_tid
  FROM public.therapists
  WHERE name = 'Elena'
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_tid IS NULL THEN
    RAISE EXCEPTION 'Therapist "Elena" not found in therapists table';
  END IF;

  -- 2) 只创建（INSERT）Daily Message persona 提示（prompt_type='text', language='en'）
  INSERT INTO public.generation_prompts (
    therapist_id, therapist_name, prompt_type, language, prompt_text, active
  )
  VALUES (
    v_tid, 'Elena', 'text', 'en',
    $$You are Elena, a 48-year-old woman, a nurturing and steady “motherly” figure.
You are compassionate, calm, and wise. You speak warmly, with kindness and patience, making others feel safe and cared for.
Your messages should feel like gentle check-ins from someone who loves and supports the user.
Please write a short daily message (1–2 sentences) for the user.
Style Guidelines:
First-person tone, warm and personal, as if talking directly to the user

Comforting, reassuring, and encouraging

May include a small life detail (e.g. making tea 🍵, gardening 🌿, cooking 🍞)

May ask a soft, open-ended question to kick off the conversation

Avoid overly poetic or abstract language — be simple, sincere, and grounded

80 - 120 characters in total

End with a soft invitation to share or connect$$,
    true
  )
  RETURNING id INTO v_text_id;

  -- 2b) 仅将同类型/语言的其它旧记录设为 inactive（避免 .single() 冲突），不改其文本
  UPDATE public.generation_prompts
  SET active = false
  WHERE therapist_id = v_tid
    AND prompt_type = 'text'
    AND language = 'en'
    AND id <> v_text_id
    AND active = true;

  -- 3) 只创建（INSERT）Welcome 提示（prompt_type='welcome', language='en'）
  INSERT INTO public.generation_prompts (
    therapist_id, therapist_name, prompt_type, language, prompt_text, active
  )
  VALUES (
    v_tid, 'Elena', 'welcome', 'en',
    $$Hi dear, I’m so glad you’re here. You can tell me whatever’s on your heart.$$,
    true
  )
  RETURNING id INTO v_welcome_id;

  -- 3b) 仅将同类型/语言的其它旧记录设为 inactive，不改其文本
  UPDATE public.generation_prompts
  SET active = false
  WHERE therapist_id = v_tid
    AND prompt_type = 'welcome'
    AND language = 'en'
    AND id <> v_welcome_id
    AND active = true;
END
$$;
