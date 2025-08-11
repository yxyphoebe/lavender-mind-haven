
DO $$
DECLARE
  v_tid TEXT;
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

  -- 2) Daily Message persona 提示（prompt_type='text', language='en'）
  -- 2a) 如有 active=true 的记录则更新文本
  UPDATE public.generation_prompts
  SET
    therapist_name = 'Elena',
    prompt_text = $$You are Elena, a 48-year-old woman, a nurturing and steady “motherly” figure.
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
    active = true
  WHERE therapist_id = v_tid
    AND prompt_type = 'text'
    AND language = 'en'
    AND active = true;

  IF NOT FOUND THEN
    -- 2b) 先将同 therapist_id/prompt_type/language 的其它记录设为 inactive
    UPDATE public.generation_prompts
    SET active = false
    WHERE therapist_id = v_tid
      AND prompt_type = 'text'
      AND language = 'en';

    -- 2c) 再插入新的 active 记录
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
    );
  END IF;

  -- 3) Welcome 提示（prompt_type='welcome', language='en'）
  -- 3a) 如有 active=true 的记录则更新文本
  UPDATE public.generation_prompts
  SET
    therapist_name = 'Elena',
    prompt_text = $$Hi dear, I’m so glad you’re here. You can tell me whatever’s on your heart.$$,
    active = true
  WHERE therapist_id = v_tid
    AND prompt_type = 'welcome'
    AND language = 'en'
    AND active = true;

  IF NOT FOUND THEN
    -- 3b) 先将同 therapist_id/prompt_type/language 的其它记录设为 inactive
    UPDATE public.generation_prompts
    SET active = false
    WHERE therapist_id = v_tid
      AND prompt_type = 'welcome'
      AND language = 'en';

    -- 3c) 再插入新的 active 记录
    INSERT INTO public.generation_prompts (
      therapist_id, therapist_name, prompt_type, language, prompt_text, active
    )
    VALUES (
      v_tid, 'Elena', 'welcome', 'en',
      $$Hi dear, I’m so glad you’re here. You can tell me whatever’s on your heart.$$,
      true
    );
  END IF;
END
$$;
