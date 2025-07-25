export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
