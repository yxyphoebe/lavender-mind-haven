export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          message: string
          message_type: string
          therapist_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          message: string
          message_type: string
          therapist_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          message?: string
          message_type?: string
          therapist_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gratitudes: {
        Row: {
          created_at: string | null
          id: string
          item1: string | null
          item2: string | null
          item3: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item1?: string | null
          item2?: string | null
          item3?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item1?: string | null
          item2?: string | null
          item3?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gratitudes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gratitudes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          source_session_id: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          source_session_id?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          source_session_id?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_source_session_id_fkey"
            columns: ["source_session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_responses: {
        Row: {
          answer_value: string
          answer_weight: number | null
          created_at: string | null
          id: string
          question_key: string
          question_text: string
          user_id: string
        }
        Insert: {
          answer_value: string
          answer_weight?: number | null
          created_at?: string | null
          id?: string
          question_key: string
          question_text: string
          user_id: string
        }
        Update: {
          answer_value?: string
          answer_weight?: number | null
          created_at?: string | null
          id?: string
          question_key?: string
          question_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_memories: {
        Row: {
          content: string
          created_at: string | null
          emotional_tone: string | null
          id: string
          importance_score: number | null
          keywords: string[] | null
          memory_type: string
          session_id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          emotional_tone?: string | null
          id?: string
          importance_score?: number | null
          keywords?: string[] | null
          memory_type: string
          session_id: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          emotional_tone?: string | null
          id?: string
          importance_score?: number | null
          keywords?: string[] | null
          memory_type?: string
          session_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_memories_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          ai_insights: Json | null
          attachments: Json | null
          ended_at: string | null
          id: string
          key_points: Json | null
          messages: Json | null
          mood_after: string | null
          mood_before: string | null
          sentiment: string | null
          session_duration: number | null
          session_notes: string | null
          session_rating: number | null
          session_type: string | null
          started_at: string | null
          summary: string | null
          therapist_id: string | null
          user_id: string | null
        }
        Insert: {
          ai_insights?: Json | null
          attachments?: Json | null
          ended_at?: string | null
          id?: string
          key_points?: Json | null
          messages?: Json | null
          mood_after?: string | null
          mood_before?: string | null
          sentiment?: string | null
          session_duration?: number | null
          session_notes?: string | null
          session_rating?: number | null
          session_type?: string | null
          started_at?: string | null
          summary?: string | null
          therapist_id?: string | null
          user_id?: string | null
        }
        Update: {
          ai_insights?: Json | null
          attachments?: Json | null
          ended_at?: string | null
          id?: string
          key_points?: Json | null
          messages?: Json | null
          mood_after?: string | null
          mood_before?: string | null
          sentiment?: string | null
          session_duration?: number | null
          session_notes?: string | null
          session_rating?: number | null
          session_type?: string | null
          started_at?: string | null
          summary?: string | null
          therapist_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_recommendations: {
        Row: {
          created_at: string | null
          id: string
          reasoning: Json | null
          recommendation_score: number
          therapist_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reasoning?: Json | null
          recommendation_score: number
          therapist_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reasoning?: Json | null
          recommendation_score?: number
          therapist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_recommendations_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapist_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          age_range: string
          background_story: string | null
          created_at: string
          id: string
          image_url: string | null
          intro_video_url: string | null
          name: string
          style: string | null
          updated_at: string
        }
        Insert: {
          age_range: string
          background_story?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          intro_video_url?: string | null
          name: string
          style?: string | null
          updated_at?: string
        }
        Update: {
          age_range?: string
          background_story?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          intro_video_url?: string | null
          name?: string
          style?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_emotions: {
        Row: {
          context: string | null
          emotion_type: string
          id: string
          intensity: number
          recorded_at: string | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          context?: string | null
          emotion_type: string
          id?: string
          intensity: number
          recorded_at?: string | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          context?: string | null
          emotion_type?: string
          id?: string
          intensity?: number
          recorded_at?: string | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_emotions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_emotions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string | null
          goal_description: string | null
          goal_title: string
          id: string
          progress_percentage: number | null
          status: string | null
          target_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goal_description?: string | null
          goal_title: string
          id?: string
          progress_percentage?: number | null
          status?: string | null
          target_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goal_description?: string | null
          goal_title?: string
          id?: string
          progress_percentage?: number | null
          status?: string | null
          target_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          data_sharing_consent: boolean | null
          id: string
          notification_enabled: boolean | null
          preferred_communication_style: string | null
          preferred_session_length: number | null
          session_reminders: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_sharing_consent?: boolean | null
          id?: string
          notification_enabled?: boolean | null
          preferred_communication_style?: string | null
          preferred_session_length?: number | null
          session_reminders?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_sharing_consent?: boolean | null
          id?: string
          notification_enabled?: boolean | null
          preferred_communication_style?: string | null
          preferred_session_length?: number | null
          session_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_choice: string | null
          created_at: string | null
          email: string | null
          id: string
          language: string | null
          last_active: string | null
          name: string
          onboarding_completed: boolean | null
          personality_type: string | null
          phone: string | null
          preferred_language: string | null
          selected_therapist_id: string | null
          timezone: string | null
        }
        Insert: {
          avatar_choice?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          last_active?: string | null
          name: string
          onboarding_completed?: boolean | null
          personality_type?: string | null
          phone?: string | null
          preferred_language?: string | null
          selected_therapist_id?: string | null
          timezone?: string | null
        }
        Update: {
          avatar_choice?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          last_active?: string | null
          name?: string
          onboarding_completed?: boolean | null
          personality_type?: string | null
          phone?: string | null
          preferred_language?: string | null
          selected_therapist_id?: string | null
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_selected_therapist_id_fkey"
            columns: ["selected_therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string | null
          id: string
          prompt_text: string | null
          response_text: string | null
          session_id: string | null
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt_text?: string | null
          response_text?: string | null
          session_id?: string | null
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt_text?: string | null
          response_text?: string | null
          session_id?: string | null
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
