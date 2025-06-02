// types.ts
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_id: string
          availability: string | null
          cover_letter: string | null
          created_at: string | null
          cv_url: string | null
          email: string
          full_name: string
          id: string
          job_id: string
          phone: string | null
          skills: string[] | null
          status: string | null
        }
        Insert: {
          applicant_id: string
          availability?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          email: string
          full_name: string
          id?: string
          job_id: string
          phone?: string | null
          skills?: string[] | null
          status?: string | null
        }
        Update: {
          applicant_id?: string
          availability?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          email?: string
          full_name?: string
          id?: string
          job_id?: string
          phone?: string | null
          skills?: string[] | null
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
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
