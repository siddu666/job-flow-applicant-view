
export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
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
  role?: 'candidate' | 'admin';
  created_at?: string;
  updated_at?: string;
}
