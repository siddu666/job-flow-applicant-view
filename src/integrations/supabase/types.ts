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