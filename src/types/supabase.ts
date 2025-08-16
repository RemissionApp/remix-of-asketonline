export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          birth_date: string | null;
          total_days: number;
          energy_points: number;
          goal: string | null;
          rank: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          birth_date?: string | null;
          total_days?: number;
          energy_points?: number;
          goal?: string | null;
          rank?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          birth_date?: string | null;
          total_days?: number;
          energy_points?: number;
          goal?: string | null;
          rank?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      pacts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          duration: number;
          reward: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          duration: number;
          reward?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          duration?: number;
          reward?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      pact_days: {
        Row: {
          id: string;
          pact_id: string;
          date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pact_id: string;
          date: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          pact_id?: string;
          date?: string;
          completed?: boolean;
          created_at?: string;
        };
      };
      universe_questions: {
        Row: {
          id: string;
          user_id: string;
          question: string;
          answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question: string;
          answer: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question?: string;
          answer?: string;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          title: string;
          description: string;
          icon: string;
          unlocked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_type: string;
          title: string;
          description: string;
          icon: string;
          unlocked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_type?: string;
          title?: string;
          description?: string;
          icon?: string;
          unlocked_at?: string | null;
          created_at?: string;
        };
      };
      missions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          requirements: Json;
          reward: Json;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          requirements: Json;
          reward: Json;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          requirements?: Json;
          reward?: Json;
          completed?: boolean;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          is_pro: boolean;
          subscription_start: string | null;
          subscription_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          is_pro?: boolean;
          subscription_start?: string | null;
          subscription_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          is_pro?: boolean;
          subscription_start?: string | null;
          subscription_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      full_horoscopes: {
        Row: {
          id: string;
          user_id: string;
          zodiac_sign: string;
          content: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          zodiac_sign: string;
          content: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          zodiac_sign?: string;
          content?: any;
          created_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
