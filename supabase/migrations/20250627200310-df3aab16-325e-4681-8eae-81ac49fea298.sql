
-- 首先更新现有的 users 表，添加一些必要的字段
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS selected_therapist_id uuid REFERENCES public.therapists(id),
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT now();

-- 创建 onboarding_responses 表来存储用户的问卷回答
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  question_key text NOT NULL,
  question_text text NOT NULL,
  answer_value text NOT NULL,
  answer_weight integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now()
);

-- 创建 user_preferences 表来存储用户偏好设置
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  notification_enabled boolean DEFAULT true,
  session_reminders boolean DEFAULT true,
  data_sharing_consent boolean DEFAULT false,
  preferred_session_length integer DEFAULT 30, -- 分钟
  preferred_communication_style text DEFAULT 'balanced',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 更新 sessions 表，增加更多字段来存储会话详情
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS therapist_id uuid REFERENCES public.therapists(id),
ADD COLUMN IF NOT EXISTS session_type text DEFAULT 'chat', -- 'chat', 'video', 'voice'
ADD COLUMN IF NOT EXISTS session_duration integer, -- 秒
ADD COLUMN IF NOT EXISTS mood_before text,
ADD COLUMN IF NOT EXISTS mood_after text,
ADD COLUMN IF NOT EXISTS session_rating integer CHECK (session_rating >= 1 AND session_rating <= 5),
ADD COLUMN IF NOT EXISTS session_notes text,
ADD COLUMN IF NOT EXISTS ai_insights jsonb DEFAULT '{}';

-- 创建 session_memories 表来存储会话记忆和关键信息
CREATE TABLE IF NOT EXISTS public.session_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  memory_type text NOT NULL, -- 'insight', 'breakthrough', 'concern', 'goal', 'pattern'
  title text NOT NULL,
  content text NOT NULL,
  keywords text[] DEFAULT '{}',
  emotional_tone text, -- 'positive', 'neutral', 'negative', 'mixed'
  importance_score integer DEFAULT 1 CHECK (importance_score >= 1 AND importance_score <= 10),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 创建 user_goals 表来跟踪用户的目标和进展
CREATE TABLE IF NOT EXISTS public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  goal_title text NOT NULL,
  goal_description text,
  target_date date,
  status text DEFAULT 'active', -- 'active', 'completed', 'paused', 'abandoned'
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 创建 user_emotions 表来跟踪用户的情绪变化
CREATE TABLE IF NOT EXISTS public.user_emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
  emotion_type text NOT NULL, -- 'anxiety', 'depression', 'happiness', 'anger', 'fear', etc.
  intensity integer NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
  context text,
  recorded_at timestamp with time zone DEFAULT now()
);

-- 创建 therapist_recommendations 表来存储推荐算法的结果
CREATE TABLE IF NOT EXISTS public.therapist_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid REFERENCES public.therapists(id) ON DELETE CASCADE NOT NULL,
  recommendation_score decimal(3,2) NOT NULL CHECK (recommendation_score >= 0 AND recommendation_score <= 1),
  reasoning jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, therapist_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_selected_therapist ON public.users(selected_therapist_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_therapist ON public.sessions(user_id, therapist_id);
CREATE INDEX IF NOT EXISTS idx_session_memories_user ON public.session_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_session_memories_session ON public.session_memories(session_id);
CREATE INDEX IF NOT EXISTS idx_user_emotions_user_date ON public.user_emotions(user_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user ON public.onboarding_responses(user_id);

-- 启用所有新表的行级安全性
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_recommendations ENABLE ROW LEVEL SECURITY;

-- 为新表创建 RLS 策略
-- onboarding_responses 策略
CREATE POLICY "Users can manage their own onboarding responses" 
  ON public.onboarding_responses 
  FOR ALL 
  USING (auth.uid() = user_id);

-- user_preferences 策略
CREATE POLICY "Users can manage their own preferences" 
  ON public.user_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);

-- session_memories 策略
CREATE POLICY "Users can manage their own session memories" 
  ON public.session_memories 
  FOR ALL 
  USING (auth.uid() = user_id);

-- user_goals 策略
CREATE POLICY "Users can manage their own goals" 
  ON public.user_goals 
  FOR ALL 
  USING (auth.uid() = user_id);

-- user_emotions 策略
CREATE POLICY "Users can manage their own emotions" 
  ON public.user_emotions 
  FOR ALL 
  USING (auth.uid() = user_id);

-- therapist_recommendations 策略
CREATE POLICY "Users can view their own recommendations" 
  ON public.therapist_recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create recommendations" 
  ON public.therapist_recommendations 
  FOR INSERT 
  WITH CHECK (true);

-- 创建触发器来自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON public.user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_memories_updated_at 
  BEFORE UPDATE ON public.session_memories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at 
  BEFORE UPDATE ON public.user_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
