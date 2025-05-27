
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          job_id: string
          applicant_id: string
          full_name: string
          email: string
          phone: string | null
          cv_url: string | null
          cover_letter: string | null
          skills: string[] | null
          status: 'pending' | 'under_review' | 'interview_scheduled' | 'rejected' | 'accepted'
          gdpr_consent: boolean
          gdpr_consent_date: string
          gdpr_marketing_consent: boolean | null
          application_source: string | null
          notes: string | null
          interview_date: string | null
          salary_expectation: number | null
          available_start_date: string | null
          anonymized: boolean
          data_retention_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id: string
          applicant_id: string
          full_name: string
          email: string
          phone?: string | null
          cv_url?: string | null
          cover_letter?: string | null
          skills?: string[] | null
          status?: 'pending' | 'under_review' | 'interview_scheduled' | 'rejected' | 'accepted'
          gdpr_consent: boolean
          gdpr_consent_date?: string
          gdpr_marketing_consent?: boolean | null
          application_source?: string | null
          notes?: string | null
          interview_date?: string | null
          salary_expectation?: number | null
          available_start_date?: string | null
          anonymized?: boolean
          data_retention_date?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id?: string
          applicant_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          cv_url?: string | null
          cover_letter?: string | null
          skills?: string[] | null
          status?: 'pending' | 'under_review' | 'interview_scheduled' | 'rejected' | 'accepted'
          gdpr_consent?: boolean
          gdpr_consent_date?: string
          gdpr_marketing_consent?: boolean | null
          application_source?: string | null
          notes?: string | null
          interview_date?: string | null
          salary_expectation?: number | null
          available_start_date?: string | null
          anonymized?: boolean
          data_retention_date?: string
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
          }
        ]
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          requirements: string[] | null
          location: string
          employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary'
          salary_min: number | null
          salary_max: number | null
          salary_currency: string
          remote_work: boolean
          benefits: string[] | null
          company_id: string
          department: string | null
          experience_level: 'entry' | 'mid' | 'senior' | 'executive'
          posted_by: string
          status: 'draft' | 'published' | 'closed' | 'filled'
          application_deadline: string | null
          start_date: string | null
          working_hours: string | null
          application_instructions: string | null
          gdpr_notice: string
          data_controller_info: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          requirements?: string[] | null
          location: string
          employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary'
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string
          remote_work?: boolean
          benefits?: string[] | null
          company_id: string
          department?: string | null
          experience_level: 'entry' | 'mid' | 'senior' | 'executive'
          posted_by: string
          status?: 'draft' | 'published' | 'closed' | 'filled'
          application_deadline?: string | null
          start_date?: string | null
          working_hours?: string | null
          application_instructions?: string | null
          gdpr_notice?: string
          data_controller_info?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          requirements?: string[] | null
          location?: string
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary'
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string
          remote_work?: boolean
          benefits?: string[] | null
          company_id?: string
          department?: string | null
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
          posted_by?: string
          status?: 'draft' | 'published' | 'closed' | 'filled'
          application_deadline?: string | null
          start_date?: string | null
          working_hours?: string | null
          application_instructions?: string | null
          gdpr_notice?: string
          data_controller_info?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          role: 'admin' | 'hr' | 'hiring_manager' | 'applicant'
          avatar_url: string | null
          phone: string | null
          linkedin_url: string | null
          github_url: string | null
          portfolio_url: string | null
          bio: string | null
          skills: string[] | null
          experience_years: number | null
          current_position: string | null
          current_company: string | null
          location: string | null
          preferred_salary: number | null
          job_seeking_status: 'actively_looking' | 'open_to_offers' | 'not_looking' | null
          gdpr_consent: boolean
          gdpr_consent_date: string
          gdpr_marketing_consent: boolean | null
          last_login: string | null
          email_verified: boolean
          profile_completion: number
          anonymized: boolean
          data_retention_date: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'hr' | 'hiring_manager' | 'applicant'
          avatar_url?: string | null
          phone?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          bio?: string | null
          skills?: string[] | null
          experience_years?: number | null
          current_position?: string | null
          current_company?: string | null
          location?: string | null
          preferred_salary?: number | null
          job_seeking_status?: 'actively_looking' | 'open_to_offers' | 'not_looking' | null
          gdpr_consent: boolean
          gdpr_consent_date?: string
          gdpr_marketing_consent?: boolean | null
          last_login?: string | null
          email_verified?: boolean
          profile_completion?: number
          anonymized?: boolean
          data_retention_date?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'hr' | 'hiring_manager' | 'applicant'
          avatar_url?: string | null
          phone?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          bio?: string | null
          skills?: string[] | null
          experience_years?: number | null
          current_position?: string | null
          current_company?: string | null
          location?: string | null
          preferred_salary?: number | null
          job_seeking_status?: 'actively_looking' | 'open_to_offers' | 'not_looking' | null
          gdpr_consent?: boolean
          gdpr_consent_date?: string
          gdpr_marketing_consent?: boolean | null
          last_login?: string | null
          email_verified?: boolean
          profile_completion?: number
          anonymized?: boolean
          data_retention_date?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          website: string | null
          logo_url: string | null
          industry: string | null
          size: string | null
          location: string | null
          founded_year: number | null
          linkedin_url: string | null
          culture_values: string[] | null
          benefits: string[] | null
          gdpr_contact_email: string
          data_protection_officer: string | null
          privacy_policy_url: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          website?: string | null
          logo_url?: string | null
          industry?: string | null
          size?: string | null
          location?: string | null
          founded_year?: number | null
          linkedin_url?: string | null
          culture_values?: string[] | null
          benefits?: string[] | null
          gdpr_contact_email: string
          data_protection_officer?: string | null
          privacy_policy_url: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          website?: string | null
          logo_url?: string | null
          industry?: string | null
          size?: string | null
          location?: string | null
          founded_year?: number | null
          linkedin_url?: string | null
          culture_values?: string[] | null
          benefits?: string[] | null
          gdpr_contact_email?: string
          data_protection_officer?: string | null
          privacy_policy_url?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          ip_address: string | null
          user_agent: string | null
          metadata: Json | null
          gdpr_related: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
          gdpr_related?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
          gdpr_related?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      gdpr_requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          request_type: 'data_export' | 'data_deletion' | 'data_rectification' | 'data_portability' | 'processing_restriction'
          status: 'pending' | 'in_progress' | 'completed' | 'rejected'
          requested_by_email: string
          verification_token: string | null
          verified_at: string | null
          processed_by: string | null
          processed_at: string | null
          completion_details: Json | null
          rejection_reason: string | null
          legal_basis: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          request_type: 'data_export' | 'data_deletion' | 'data_rectification' | 'data_portability' | 'processing_restriction'
          status?: 'pending' | 'in_progress' | 'completed' | 'rejected'
          requested_by_email: string
          verification_token?: string | null
          verified_at?: string | null
          processed_by?: string | null
          processed_at?: string | null
          completion_details?: Json | null
          rejection_reason?: string | null
          legal_basis?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          request_type?: 'data_export' | 'data_deletion' | 'data_rectification' | 'data_portability' | 'processing_restriction'
          status?: 'pending' | 'in_progress' | 'completed' | 'rejected'
          requested_by_email?: string
          verification_token?: string | null
          verified_at?: string | null
          processed_by?: string | null
          processed_at?: string | null
          completion_details?: Json | null
          rejection_reason?: string | null
          legal_basis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gdpr_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gdpr_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      anonymize_user_data: {
        Args: {
          user_id: string
        }
        Returns: void
      }
      cleanup_expired_data: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      application_status: 'pending' | 'under_review' | 'interview_scheduled' | 'rejected' | 'accepted'
      employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary'
      experience_level: 'entry' | 'mid' | 'senior' | 'executive'
      job_status: 'draft' | 'published' | 'closed' | 'filled'
      user_role: 'admin' | 'hr' | 'hiring_manager' | 'applicant'
      job_seeking_status: 'actively_looking' | 'open_to_offers' | 'not_looking'
      gdpr_request_type: 'data_export' | 'data_deletion' | 'data_rectification' | 'data_portability' | 'processing_restriction'
      gdpr_request_status: 'pending' | 'in_progress' | 'completed' | 'rejected'
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
  DefaultSchemaCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends DefaultSchemaCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = DefaultSchemaCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : DefaultSchemaCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][DefaultSchemaCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ['pending', 'under_review', 'interview_scheduled', 'rejected', 'accepted'] as const,
      employment_type: ['full_time', 'part_time', 'contract', 'internship', 'temporary'] as const,
      experience_level: ['entry', 'mid', 'senior', 'executive'] as const,
      job_status: ['draft', 'published', 'closed', 'filled'] as const,
      user_role: ['admin', 'hr', 'hiring_manager', 'applicant'] as const,
      job_seeking_status: ['actively_looking', 'open_to_offers', 'not_looking'] as const,
      gdpr_request_type: ['data_export', 'data_deletion', 'data_rectification', 'data_portability', 'processing_restriction'] as const,
      gdpr_request_status: ['pending', 'in_progress', 'completed', 'rejected'] as const,
    },
  },
} as const
