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
      applications: {
        Row: {
          job_id: string
          applicant_id: string
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          status?: string | null
        }
        Insert: {
          job_id: string
          applicant_id: string
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          status?: string | null
        }
        Update: {
          job_id: string
          applicant_id: string
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string | null
          description: string
          experience_level: string | null
          id: string
          location: string
          posted_by: string
          requirements: string
          skills: string[] | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          experience_level?: string | null
          id?: string
          location: string
          posted_by: string
          requirements: string
          skills?: string[] | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          experience_level?: string | null
          id?: string
          location?: string
          posted_by?: string
          requirements?: string
          skills?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability: string | null
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          current_location: string | null
          cv_url: string | null
          visa_status: string | null
          email: string | null
          expected_salary_sek: number | null
          experience_years: number | null
          first_name: string | null
          github_url: string | null
          id: string
          job_seeking_status: string | null
          last_name: string | null
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          preferred_cities: string[] | null
          role: string | null
          skills: string[] | null
          updated_at: string | null
          willing_to_relocate: boolean | null
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          current_location?: string | null
          cv_url?: string | null
          email?: string | null
          expected_salary_sek?: number | null
          experience_years?: number | null
          first_name?: string | null
          github_url?: string | null
          id: string
          job_seeking_status?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_cities?: string[] | null
          role?: string | null
          skills?: string[] | null
          updated_at?: string | null
          willing_to_relocate?: boolean | null
        }
        Update: {
          availability?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          current_location?: string | null
          cv_url?: string | null
          email?: string | null
          expected_salary_sek?: number | null
          experience_years?: number | null
          first_name?: string | null
          github_url?: string | null
          id?: string
          job_seeking_status?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_cities?: string[] | null
          role?: string | null
          skills?: string[] | null
          updated_at?: string | null
          willing_to_relocate?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_candidate_match_score: {
        Args: {
          candidate_skills: string[]
          candidate_experience: number
          candidate_location: string
          job_skills: string[]
          job_experience_level: string
          job_location: string
        }
        Returns: number
      }
      delete_user_data: {
        Args: { user_id_to_delete: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
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
