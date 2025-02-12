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
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          id: number
          record_id: number | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          id?: number
          record_id?: number | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          id?: number
          record_id?: number | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      coach: {
        Row: {
          coach_id: number
          email_address: string | null
          first_name: string | null
          last_name: string | null
          phone_number: string | null
        }
        Insert: {
          coach_id?: number
          email_address?: string | null
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
        }
        Update: {
          coach_id?: number
          email_address?: string | null
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          away_team_id: number | null
          home_team_id: number | null
          id: number
          match_date: string | null
          match_time: string | null
          notes: string | null
          season_id: number | null
          status: Database["public"]["Enums"]["match_status"] | null
          venue: string | null
          weight_class: string | null
          winner_team_id: number | null
        }
        Insert: {
          away_team_id?: number | null
          home_team_id?: number | null
          id?: number
          match_date?: string | null
          match_time?: string | null
          notes?: string | null
          season_id?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          venue?: string | null
          weight_class?: string | null
          winner_team_id?: number | null
        }
        Update: {
          away_team_id?: number | null
          home_team_id?: number | null
          id?: number
          match_date?: string | null
          match_time?: string | null
          notes?: string | null
          season_id?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          venue?: string | null
          weight_class?: string | null
          winner_team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          role: string
          team_id: number | null
          updated_at: string
        }
        Insert: {
          full_name?: string | null
          id: string
          role?: string
          team_id?: number | null
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          id?: string
          role?: string
          team_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule: {
        Row: {
          location: string | null
          match_date: string
          match_id: number
          match_time: string
          schedule_id: number
        }
        Insert: {
          location?: string | null
          match_date: string
          match_id: number
          match_time: string
          schedule_id?: number
        }
        Update: {
          location?: string | null
          match_date?: string
          match_id?: number
          match_time?: string
          schedule_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          id: number
          match_id: number | null
          score: number
          team_id: number | null
        }
        Insert: {
          id?: number
          match_id?: number | null
          score: number
          team_id?: number | null
        }
        Update: {
          id?: number
          match_id?: number | null
          score?: number
          team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          end_date: string
          id: number
          is_active: boolean | null
          name: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: number
          is_active?: boolean | null
          name: string
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: number
          is_active?: boolean | null
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      standings: {
        Row: {
          draws: number | null
          losses: number | null
          points: number | null
          standing_id: number
          team_id: number
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          draws?: number | null
          losses?: number | null
          points?: number | null
          standing_id?: number
          team_id: number
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          draws?: number | null
          losses?: number | null
          points?: number | null
          standing_id?: number
          team_id?: number
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          coach: string
          id: number
          name: string
        }
        Insert: {
          coach: string
          id?: number
          name: string
        }
        Update: {
          coach?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          password_hash: string
          role: string
          team_id: number | null
          user_id: number
          username: string
        }
        Insert: {
          created_at?: string | null
          password_hash: string
          role: string
          team_id?: number | null
          user_id?: number
          username: string
        }
        Update: {
          created_at?: string | null
          password_hash?: string
          role?: string
          team_id?: number | null
          user_id?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
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
      match_status: "scheduled" | "in_progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
