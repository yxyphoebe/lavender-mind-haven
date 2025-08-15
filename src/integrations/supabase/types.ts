export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chats: {
        Row: {
          attachments: Json | null
          conversation: Json | null
          conversation_started_at: string | null
          created_at: string
          id: string
          therapist_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          conversation?: Json | null
          conversation_started_at?: string | null
          created_at?: string
          id?: string
          therapist_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          conversation?: Json | null
          conversation_started_at?: string | null
          created_at?: string
          id?: string
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
      conversation_ratings: {
        Row: {
          created_at: string
          id: string
          rating: string
          session_id: string | null
          therapist_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: string
          session_id?: string | null
          therapist_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: string
          session_id?: string | null
          therapist_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_messages: {
        Row: {
          created_at: string
          id: string
          is_used: boolean
          language: string | null
          message_text: string | null
          message_type: string | null
          therapist_id: string | null
          therapist_name: string | null
          used_at: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_used?: boolean
          language?: string | null
          message_text?: string | null
          message_type?: string | null
          therapist_id?: string | null
          therapist_name?: string | null
          used_at?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_used?: boolean
          language?: string | null
          message_text?: string | null
          message_type?: string | null
          therapist_id?: string | null
          therapist_name?: string | null
          used_at?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      generation_prompts: {
        Row: {
          active: boolean
          created_at: string
          id: string
          language: string
          prompt_text: string
          prompt_type: string
          therapist_id: string
          therapist_name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          language: string
          prompt_text: string
          prompt_type: string
          therapist_id: string
          therapist_name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          language?: string
          prompt_text?: string
          prompt_type?: string
          therapist_id?: string
          therapist_name?: string
        }
        Relationships: []
      }
      onboarding_options: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          matching_roles: Json
          option_key: string
          option_order: number
          option_value: string
          question_id: string
          therapist_weights: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          matching_roles?: Json
          option_key: string
          option_order: number
          option_value: string
          question_id: string
          therapist_weights?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          matching_roles?: Json
          option_key?: string
          option_order?: number
          option_value?: string
          question_id?: string
          therapist_weights?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "onboarding_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_questions: {
        Row: {
          created_at: string
          id: string
          question_key: string
          question_order: number
          question_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_key: string
          question_order: number
          question_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          question_key?: string
          question_order?: number
          question_text?: string
          updated_at?: string
        }
        Relationships: []
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
          active: boolean
          age_range: string
          background_image_url: string | null
          background_music_url: string | null
          background_story: string | null
          created_at: string
          id: string
          image_url: string | null
          intro_video_url: string | null
          name: string
          style: string | null
          tavus_config: Json | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          age_range: string
          background_image_url?: string | null
          background_music_url?: string | null
          background_story?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          intro_video_url?: string | null
          name: string
          style?: string | null
          tavus_config?: Json | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          age_range?: string
          background_image_url?: string | null
          background_music_url?: string | null
          background_story?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          intro_video_url?: string | null
          name?: string
          style?: string | null
          tavus_config?: Json | null
          updated_at?: string
        }
        Relationships: []
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
          notifications_enabled: boolean
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
          notifications_enabled?: boolean
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
          notifications_enabled?: boolean
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_used_daily_messages: {
        Args: { max_days?: number; max_per_pair?: number }
        Returns: undefined
      }
      pick_and_use_random_daily_message: {
        Args: { therapist_id_input: string }
        Returns: {
          id: string
          message_text: string
        }[]
      }
      run_cleanup_if_8am_pacific: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
