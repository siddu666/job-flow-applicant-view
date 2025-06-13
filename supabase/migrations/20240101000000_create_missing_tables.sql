
-- Create profiles table with comprehensive fields
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  current_title TEXT,
  current_position TEXT,
  current_company TEXT,
  current_location TEXT,
  experience_years INTEGER,
  skills TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  education TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  hobbies TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  expected_salary TEXT,
  work_authorization TEXT,
  visa_status TEXT,
  bio TEXT,
  project_summary TEXT,
  cv_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  role TEXT DEFAULT 'candidate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  required_skills TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  remote_work_allowed BOOLEAN DEFAULT false,
  experience_required INTEGER,
  department TEXT,
  posted_by UUID REFERENCES auth.users,
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  application_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending',
  cover_letter TEXT,
  additional_notes TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users,
  interview_scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(job_id, applicant_id)
);

-- Create job_categories table
CREATE TABLE IF NOT EXISTS job_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create job_category_mappings table
CREATE TABLE IF NOT EXISTS job_category_mappings (
  job_id UUID REFERENCES jobs ON DELETE CASCADE,
  category_id UUID REFERENCES job_categories ON DELETE CASCADE,
  PRIMARY KEY (job_id, category_id)
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_category_mappings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs" ON jobs
FOR SELECT USING (is_active = true OR status = 'active');

CREATE POLICY "Admins can manage jobs" ON jobs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Applications policies
CREATE POLICY "Users can view their own applications" ON applications
FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Users can create applications" ON applications
FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Admins can view all applications" ON applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update applications" ON applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Job categories policies
CREATE POLICY "Anyone can view job categories" ON job_categories
FOR SELECT USING (true);

CREATE POLICY "Admins can manage job categories" ON job_categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Job category mappings policies
CREATE POLICY "Anyone can view job category mappings" ON job_category_mappings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage job category mappings" ON job_category_mappings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Insert default job categories
INSERT INTO job_categories (name, description, icon, color) VALUES
('Technology', 'Software development, IT, and tech roles', 'Code', '#3B82F6'),
('Marketing', 'Digital marketing, content, and growth roles', 'Megaphone', '#10B981'),
('Sales', 'Business development and sales positions', 'TrendingUp', '#F59E0B'),
('Design', 'UI/UX, graphic design, and creative roles', 'Palette', '#8B5CF6'),
('Operations', 'Business operations and management', 'Settings', '#6B7280'),
('Finance', 'Accounting, finance, and related roles', 'DollarSign', '#059669'),
('Human Resources', 'HR, recruitment, and people operations', 'Users', '#DC2626'),
('Customer Support', 'Customer service and support roles', 'MessageCircle', '#0891B2')
ON CONFLICT (name) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
