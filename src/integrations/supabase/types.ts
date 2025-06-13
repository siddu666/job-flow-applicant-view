
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
          job_id?: string
          applicant_id?: string
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
          visa_status?: string | null
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
          visa_status?: string | null
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
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
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
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
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
