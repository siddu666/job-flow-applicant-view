-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  current_location TEXT,
  visa_status TEXT,
  authorized_to_work BOOLEAN DEFAULT false,
  skills TEXT[],
  experience INTEGER,
  education TEXT,
  preferred_job_type TEXT,
  availability TEXT,
  cv_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'recruiter')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);
```

```sql
-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  experience_level TEXT,
  skills TEXT[],
  posted_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);
```

```sql
-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interviewed', 'accepted', 'rejected')),
  cover_letter TEXT,
  cv_url TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(job_id, applicant_id)
);
```

```sql
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;
```

```sql
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
```

```sql
-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

```sql
-- Create RLS policies for jobs
CREATE POLICY "Anyone can view jobs" ON jobs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Recruiters can create jobs" ON jobs
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Job creators can update their jobs" ON jobs
  FOR UPDATE TO authenticated 
  USING (posted_by = auth.uid());
```

```sql
-- Create RLS policies for applications
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT TO authenticated 
  USING (applicant_id = auth.uid());

CREATE POLICY "Recruiters can view applications for their jobs" ON applications
  FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM jobs j 
      JOIN profiles p ON p.id = auth.uid()
      WHERE j.id = applications.job_id 
      AND (j.posted_by = auth.uid() OR p.role IN ('admin', 'recruiter'))
    )
  );

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT TO authenticated 
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Recruiters can update application status" ON applications
  FOR UPDATE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM jobs j 
      JOIN profiles p ON p.id = auth.uid()
      WHERE j.id = applications.job_id 
      AND (j.posted_by = auth.uid() OR p.role IN ('admin', 'recruiter'))
    )
  );
```

```sql
-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_check_tokens table for periodic checks
CREATE TABLE IF NOT EXISTS activity_check_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table for GDPR compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  gdpr_related BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_check_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_logs
CREATE POLICY "Users can view their own activity logs" ON activity_logs
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert activity logs" ON activity_logs
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- RLS policies for activity_check_tokens
CREATE POLICY "Users can view their own tokens" ON activity_check_tokens
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "System can manage tokens" ON activity_check_tokens
  FOR ALL TO authenticated 
  USING (true);

-- RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_check_tokens_user_id ON activity_check_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_check_tokens_token ON activity_check_tokens(token);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_gdpr_related ON audit_logs(gdpr_related);
```

```sql
-- Storage policies for documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```