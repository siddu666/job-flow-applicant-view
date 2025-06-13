
export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  current_title?: string;
  current_position?: string;
  current_company?: string;
  current_location?: string;
  experience_years?: number;
  skills?: string[];
  tools?: string[];
  education?: string[];
  certifications?: string[];
  hobbies?: string[];
  languages?: string[];
  expected_salary?: string;
  work_authorization?: string;
  visa_status?: string;
  bio?: string;
  project_summary?: string;
  cv_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  required_skills?: string[];
  preferred_skills?: string[];
  benefits?: string[];
  remote_work_allowed?: boolean;
  experience_required?: number;
  department?: string;
  posted_by?: string;
  is_active?: boolean;
  application_deadline?: string;
  created_at?: string;
  updated_at?: string;
  skills?: string[]; // Alias for required_skills
  status?: string;
}

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  cover_letter?: string;
  additional_notes?: string;
  applied_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  interview_scheduled_at?: string;
  created_at: string;
  updated_at: string;
}
