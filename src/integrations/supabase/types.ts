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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      custom_affirmations: {
        Row: {
          action: string
          affirmation: string
          category: string
          created_at: string
          id: string
          in_rotation: boolean
          reflection: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action?: string
          affirmation: string
          category?: string
          created_at?: string
          id?: string
          in_rotation?: boolean
          reflection?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          affirmation?: string
          category?: string
          created_at?: string
          id?: string
          in_rotation?: boolean
          reflection?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          action_status: string
          affirmation_day: number | null
          created_at: string
          energy: number | null
          entry_date: string
          id: string
          mood: number | null
          ritual_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          action_status?: string
          affirmation_day?: number | null
          created_at?: string
          energy?: number | null
          entry_date?: string
          id?: string
          mood?: number | null
          ritual_seconds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          action_status?: string
          affirmation_day?: number | null
          created_at?: string
          energy?: number | null
          entry_date?: string
          id?: string
          mood?: number | null
          ritual_seconds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          day: number
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day: number
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      gratitude_entries: {
        Row: {
          content: string
          created_at: string
          entry_date: string
          id: string
          position: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          entry_date?: string
          id?: string
          position?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          position?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      growth_events: {
        Row: {
          created_at: string
          id: string
          kind: string
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          points?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          affirmation_day: number | null
          body: string
          created_at: string
          entry_date: string
          id: string
          mood_tag: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          affirmation_day?: number | null
          body?: string
          created_at?: string
          entry_date?: string
          id?: string
          mood_tag?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          affirmation_day?: number | null
          body?: string
          created_at?: string
          entry_date?: string
          id?: string
          mood_tag?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      path_progress: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          step: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          step: number
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          step?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          journey_start: string
          onboarding_complete: boolean
          reminder_enabled: boolean
          reminder_repeat: number
          reminder_time: string
          reminder_times: string[]
          reminder_voice: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          journey_start?: string
          onboarding_complete?: boolean
          reminder_enabled?: boolean
          reminder_repeat?: number
          reminder_time?: string
          reminder_times?: string[]
          reminder_voice?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          journey_start?: string
          onboarding_complete?: boolean
          reminder_enabled?: boolean
          reminder_repeat?: number
          reminder_time?: string
          reminder_times?: string[]
          reminder_voice?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          display_name: string | null
          focus_areas: string[]
          haptics_enabled: boolean
          high_contrast: boolean
          reduced_motion: boolean
          text_size: string
          tone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          focus_areas?: string[]
          haptics_enabled?: boolean
          high_contrast?: boolean
          reduced_motion?: boolean
          text_size?: string
          tone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          focus_areas?: string[]
          haptics_enabled?: boolean
          high_contrast?: boolean
          reduced_motion?: boolean
          text_size?: string
          tone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_affirmations: {
        Row: {
          created_at: string
          duration_seconds: number
          id: string
          storage_path: string
          title: string
          transcript: string | null
          transcript_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          id?: string
          storage_path: string
          title?: string
          transcript?: string | null
          transcript_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          id?: string
          storage_path?: string
          title?: string
          transcript?: string | null
          transcript_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
