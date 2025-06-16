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
      avatars: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          intro: string | null
          name: string | null
          style: string | null
          tavus_template_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          image_url?: string | null
          intro?: string | null
          name?: string | null
          style?: string | null
          tavus_template_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          intro?: string | null
          name?: string | null
          style?: string | null
          tavus_template_id?: string | null
        }
        Relationships: []
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
      sessions: {
        Row: {
          ended_at: string | null
          id: string
          key_points: Json | null
          messages: Json | null
          sentiment: string | null
          started_at: string | null
          summary: string | null
          user_id: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          key_points?: Json | null
          messages?: Json | null
          sentiment?: string | null
          started_at?: string | null
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          key_points?: Json | null
          messages?: Json | null
          sentiment?: string | null
          started_at?: string | null
          summary?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
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
      users: {
        Row: {
          avatar_choice: string | null
          created_at: string | null
          email: string | null
          id: string
          language: string | null
          name: string
          onboarding_completed: boolean | null
          personality_type: string | null
          phone: string | null
        }
        Insert: {
          avatar_choice?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          name: string
          onboarding_completed?: boolean | null
          personality_type?: string | null
          phone?: string | null
        }
        Update: {
          avatar_choice?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          name?: string
          onboarding_completed?: boolean | null
          personality_type?: string | null
          phone?: string | null
        }
        Relationships: []
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
