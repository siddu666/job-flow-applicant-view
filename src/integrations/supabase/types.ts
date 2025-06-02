export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  location: string
  salary_range?: string
  company_id: string
  status: 'active' | 'closed' | 'draft'
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  applicant_id: string
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected'
  cover_letter?: string
  resume_url?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  description?: string
  website?: string
  logo_url?: string
  created_at: string
  updated_at: string
}
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          current_location: string | null
          visa_status: string | null
          authorized_to_work: boolean | null
          skills: string[] | null
          experience: number | null
          education: string | null
          preferred_job_type: string | null
          availability: string | null
          cv_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          role: 'user' | 'admin' | 'recruiter'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          current_location?: string | null
          visa_status?: string | null
          authorized_to_work?: boolean | null
          skills?: string[] | null
          experience?: number | null
          education?: string | null
          preferred_job_type?: string | null
          availability?: string | null
          cv_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          role?: 'user' | 'admin' | 'recruiter'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          current_location?: string | null
          visa_status?: string | null
          authorized_to_work?: boolean | null
          skills?: string[] | null
          experience?: number | null
          education?: string | null
          preferred_job_type?: string | null
          availability?: string | null
          cv_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          role?: 'user' | 'admin' | 'recruiter'
          created_at?: string
          updated_at?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          location: string
          type: string
          salary_range: string | null
          description: string
          requirements: string
          experience_level: string | null
          skills: string[] | null
          posted_by: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          type: string
          salary_range?: string | null
          description: string
          requirements: string
          experience_level?: string | null
          skills?: string[] | null
          posted_by: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          type?: string
          salary_range?: string | null
          description?: string
          requirements?: string
          experience_level?: string | null
          skills?: string[] | null
          posted_by?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          applicant_id: string
          status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected'
          cover_letter: string | null
          cv_url: string | null
          applied_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          applicant_id: string
          status?: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected'
          cover_letter?: string | null
          cv_url?: string | null
          applied_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          applicant_id?: string
          status?: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected'
          cover_letter?: string | null
          cv_url?: string | null
          applied_at?: string
          updated_at?: string | null
        }
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
