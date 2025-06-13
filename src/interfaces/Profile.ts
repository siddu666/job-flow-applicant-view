
export interface Profile {
  id: string
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  current_location?: string | null
  role?: string | null
  availability?: string | null
  willing_to_relocate?: boolean | null
  visa_status?: string | null
  expected_salary_sek?: number | null
  job_seeking_status?: string | null
  skills?: string[] | null
  experience_years?: number | null
  bio?: string | null
  linkedin_url?: string | null
  github_url?: string | null
  portfolio_url?: string | null
  preferred_cities?: string[] | null
  certifications?: string[] | null
  cv_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  type: string
  experience_level?: string | null
  skills?: string[] | null
  posted_by: string
  created_at?: string | null
  updated_at?: string | null
}

export interface Application {
  job_id: string
  applicant_id: string
  cover_letter?: string | null
  cv_url?: string | null
  status?: string | null
  created_at?: string | null
}
