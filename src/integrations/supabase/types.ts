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
      achievements: {
        Row: {
          achievement_type: string
          created_at: string
          description: string
          icon: string
          id: string
          title: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_type: string
          created_at?: string
          description: string
          icon: string
          id?: string
          title: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_type?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          title?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      astro_profiles: {
        Row: {
          birth_date: string
          birth_place: string | null
          birth_time: string | null
          created_at: string
          id: string
          last_reading: Json | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          id?: string
          last_reading?: Json | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          id?: string
          last_reading?: Json | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cosmic_artifacts: {
        Row: {
          artifact_id: string
          description: string
          effects: Json
          id: string
          is_active: boolean
          name: string
          obtained_at: string
          obtained_from_mission: string | null
          rarity: string
          type: string
          user_id: string
        }
        Insert: {
          artifact_id: string
          description: string
          effects?: Json
          id?: string
          is_active?: boolean
          name: string
          obtained_at?: string
          obtained_from_mission?: string | null
          rarity: string
          type: string
          user_id: string
        }
        Update: {
          artifact_id?: string
          description?: string
          effects?: Json
          id?: string
          is_active?: boolean
          name?: string
          obtained_at?: string
          obtained_from_mission?: string | null
          rarity?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_limits: {
        Row: {
          cosmic_missions_count: number
          created_at: string
          date: string
          id: string
          meditations_count: number
          universe_questions_count: number
          updated_at: string
          user_id: string
          voice_calls_count: number
        }
        Insert: {
          cosmic_missions_count?: number
          created_at?: string
          date?: string
          id?: string
          meditations_count?: number
          universe_questions_count?: number
          updated_at?: string
          user_id: string
          voice_calls_count?: number
        }
        Update: {
          cosmic_missions_count?: number
          created_at?: string
          date?: string
          id?: string
          meditations_count?: number
          universe_questions_count?: number
          updated_at?: string
          user_id?: string
          voice_calls_count?: number
        }
        Relationships: []
      }
      daily_reflections: {
        Row: {
          answer: string
          created_at: string
          day_number: number
          id: string
          mission_id: string
          question: string
          reflection_type: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          day_number: number
          id?: string
          mission_id: string
          question: string
          reflection_type?: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          day_number?: number
          id?: string
          mission_id?: string
          question?: string
          reflection_type?: string
          user_id?: string
        }
        Relationships: []
      }
      detailed_horoscopes: {
        Row: {
          content: Json
          created_at: string
          date: string
          id: string
          user_id: string
          zodiac_sign: string
        }
        Insert: {
          content: Json
          created_at?: string
          date: string
          id?: string
          user_id: string
          zodiac_sign: string
        }
        Update: {
          content?: Json
          created_at?: string
          date?: string
          id?: string
          user_id?: string
          zodiac_sign?: string
        }
        Relationships: []
      }
      email_verification_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: []
      }
      full_horoscopes: {
        Row: {
          content: Json
          created_at: string
          id: string
          user_id: string
          zodiac_sign: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          user_id: string
          zodiac_sign: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          user_id?: string
          zodiac_sign?: string
        }
        Relationships: []
      }
      mission_choices: {
        Row: {
          choice_event_id: string
          choice_id: string
          chosen_at: string
          consequences: Json
          id: string
          mission_id: string
          user_id: string
        }
        Insert: {
          choice_event_id: string
          choice_id: string
          chosen_at?: string
          consequences?: Json
          id?: string
          mission_id: string
          user_id: string
        }
        Update: {
          choice_event_id?: string
          choice_id?: string
          chosen_at?: string
          consequences?: Json
          id?: string
          mission_id?: string
          user_id?: string
        }
        Relationships: []
      }
      mission_progress: {
        Row: {
          accepted_at: string
          completed: boolean
          completed_at: string | null
          id: string
          last_updated_at: string
          mission_id: string
          progress: Json
          user_id: string
        }
        Insert: {
          accepted_at?: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          last_updated_at?: string
          mission_id: string
          progress?: Json
          user_id: string
        }
        Update: {
          accepted_at?: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          last_updated_at?: string
          mission_id?: string
          progress?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_progress_detailed: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          data: Json
          day_number: number
          id: string
          mission_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          data?: Json
          day_number: number
          id?: string
          mission_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          data?: Json
          day_number?: number
          id?: string
          mission_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          completed: boolean
          created_at: string
          description: string
          id: string
          requirements: Json
          reward: Json
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description: string
          id?: string
          requirements: Json
          reward: Json
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string
          id?: string
          requirements?: Json
          reward?: Json
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      numerology_descriptions: {
        Row: {
          created_at: string
          description_data: Json
          id: string
          language: string
          reading_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description_data: Json
          id?: string
          language?: string
          reading_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          description_data?: Json
          id?: string
          language?: string
          reading_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "numerology_descriptions_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: false
            referencedRelation: "numerology_readings"
            referencedColumns: ["id"]
          },
        ]
      }
      numerology_readings: {
        Row: {
          birth_date: string
          created_at: string
          id: string
          matrix_data: Json
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date: string
          created_at?: string
          id?: string
          matrix_data: Json
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string
          created_at?: string
          id?: string
          matrix_data?: Json
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pact_days: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          pact_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          id?: string
          pact_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          pact_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pact_days_pact_id_fkey"
            columns: ["pact_id"]
            isOneToOne: false
            referencedRelation: "pacts"
            referencedColumns: ["id"]
          },
        ]
      }
      pacts: {
        Row: {
          break_reason: string | null
          created_at: string
          duration: number
          id: string
          reward: string | null
          status: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          break_reason?: string | null
          created_at?: string
          duration: number
          id?: string
          reward?: string | null
          status?: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          break_reason?: string | null
          created_at?: string
          duration?: number
          id?: string
          reward?: string | null
          status?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_mission: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          energy_points: number
          goal: string | null
          id: string
          name: string
          rank: string
          total_days: number
          updated_at: string
        }
        Insert: {
          active_mission?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          energy_points?: number
          goal?: string | null
          id: string
          name: string
          rank?: string
          total_days?: number
          updated_at?: string
        }
        Update: {
          active_mission?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          energy_points?: number
          goal?: string | null
          id?: string
          name?: string
          rank?: string
          total_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_active_mission_fkey"
            columns: ["active_mission"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string
          device_info: Json | null
          id: string
          is_active: boolean
          settings: Json
          subscription: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          id?: string
          is_active?: boolean
          settings?: Json
          subscription: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          id?: string
          is_active?: boolean
          settings?: Json
          subscription?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      raw_horoscopes: {
        Row: {
          content: string
          created_at: string
          detailed: boolean
          id: string
          language: string
          zodiac_sign: string
        }
        Insert: {
          content: string
          created_at?: string
          detailed?: boolean
          id?: string
          language: string
          zodiac_sign: string
        }
        Update: {
          content?: string
          created_at?: string
          detailed?: boolean
          id?: string
          language?: string
          zodiac_sign?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          is_pro: boolean
          original_transaction_id: string | null
          platform: string | null
          product_id: string | null
          revenuecat_user_id: string | null
          store_transaction_id: string | null
          subscription_end: string | null
          subscription_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_pro?: boolean
          original_transaction_id?: string | null
          platform?: string | null
          product_id?: string | null
          revenuecat_user_id?: string | null
          store_transaction_id?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_pro?: boolean
          original_transaction_id?: string | null
          platform?: string | null
          product_id?: string | null
          revenuecat_user_id?: string | null
          store_transaction_id?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      universe_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "universe_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "universe_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      universe_chat_sessions: {
        Row: {
          created_at: string
          id: string
          last_message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      universe_questions: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding_state: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_step: string | null
          onboarding_step_completed: boolean | null
          preferences_step_completed: boolean | null
          profile_step_completed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: string | null
          onboarding_step_completed?: boolean | null
          preferences_step_completed?: boolean | null
          profile_step_completed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: string | null
          onboarding_step_completed?: boolean | null
          preferences_step_completed?: boolean | null
          profile_step_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_progress_summary: {
        Row: {
          achievements_count: number | null
          artifacts_count: number | null
          completed_missions_count: number | null
          energy_points: number | null
          id: string | null
          missions_count: number | null
          rank: string | null
          total_days: number | null
        }
        Insert: {
          achievements_count?: never
          artifacts_count?: never
          completed_missions_count?: never
          energy_points?: number | null
          id?: string | null
          missions_count?: never
          rank?: string | null
          total_days?: number | null
        }
        Update: {
          achievements_count?: never
          artifacts_count?: never
          completed_missions_count?: never
          energy_points?: number | null
          id?: string | null
          missions_count?: never
          rank?: string | null
          total_days?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      batch_delete_user_data: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      create_verification_code: {
        Args: { p_code: string; p_email: string }
        Returns: string
      }
      validate_verification_code: {
        Args: { p_code: string; p_email: string }
        Returns: boolean
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
