
-- Complete database reset to fix all issues
-- This should be run in your Supabase SQL editor

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_access" ON profiles;

DROP POLICY IF EXISTS "Public jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Users can insert their own job" ON jobs;
DROP POLICY IF EXISTS "Users can update own job" ON jobs;
DROP POLICY IF EXISTS "jobs_select_all" ON jobs;
DROP POLICY IF EXISTS "jobs_insert_authenticated" ON jobs;
DROP POLICY IF EXISTS "jobs_update_own" ON jobs;

DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
DROP POLICY IF EXISTS "Users can update own applications" ON applications;
DROP POLICY IF EXISTS "applications_select_own" ON applications;
DROP POLICY IF EXISTS "applications_insert_own" ON applications;
DROP POLICY IF EXISTS "applications_update_own" ON applications;
DROP POLICY IF EXISTS "applications_job_poster_access" ON applications;

-- Disable RLS on all tables
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS applications DISABLE ROW LEVEL SECURITY;

-- Drop and recreate tables to ensure clean state
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Recreate profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  current_location TEXT,
  role TEXT DEFAULT 'candidate',
  availability TEXT,
  willing_to_relocate BOOLEAN DEFAULT false,
  visa_status TEXT,
  expected_salary_sek INTEGER,
  job_seeking_status TEXT,
  skills TEXT[],
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  preferred_cities TEXT[],
  certifications TEXT[],
  cv_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  experience_level TEXT,
  skills TEXT[],
  posted_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate applications table
CREATE TABLE applications (
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  cv_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (job_id, applicant_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create simple, safe policies for profiles
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for jobs
CREATE POLICY "jobs_select" ON jobs
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "jobs_insert" ON jobs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "jobs_update" ON jobs
  FOR UPDATE TO authenticated
  USING (auth.uid() = posted_by);

-- Create policies for applications
CREATE POLICY "applications_select" ON applications
  FOR SELECT TO authenticated
  USING (
    auth.uid() = applicant_id OR
    EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.posted_by = auth.uid())
  );

CREATE POLICY "applications_insert" ON applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "applications_update" ON applications
  FOR UPDATE TO authenticated
  USING (auth.uid() = applicant_id);

-- Create useful functions
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_candidate_match_score(
  candidate_skills TEXT[],
  candidate_experience INTEGER,
  candidate_location TEXT,
  job_skills TEXT[],
  job_experience_level TEXT,
  job_location TEXT
)
RETURNS INTEGER AS $$
DECLARE
  skill_match_score INTEGER := 0;
  experience_score INTEGER := 0;
  location_score INTEGER := 0;
  total_score INTEGER := 0;
BEGIN
  -- Calculate skill match (40% weight)
  SELECT (
    ARRAY_LENGTH(
      ARRAY(
        SELECT UNNEST(candidate_skills) 
        INTERSECT 
        SELECT UNNEST(job_skills)
      ), 1
    ) * 100 / GREATEST(ARRAY_LENGTH(job_skills, 1), 1)
  ) INTO skill_match_score;
  
  -- Calculate experience match (35% weight)
  CASE job_experience_level
    WHEN 'entry level' THEN
      IF candidate_experience <= 2 THEN experience_score := 100;
      ELSE experience_score := GREATEST(0, 100 - (candidate_experience - 2) * 20);
      END IF;
    WHEN 'mid level' THEN
      IF candidate_experience BETWEEN 2 AND 5 THEN experience_score := 100;
      ELSE experience_score := GREATEST(0, 100 - ABS(candidate_experience - 3.5) * 20);
      END IF;
    WHEN 'senior level' THEN
      IF candidate_experience >= 5 THEN experience_score := 100;
      ELSE experience_score := GREATEST(0, candidate_experience * 20);
      END IF;
    ELSE experience_score := 70;
  END CASE;
  
  -- Calculate location match (25% weight)
  IF LOWER(candidate_location) = LOWER(job_location) THEN
    location_score := 100;
  ELSIF LOWER(job_location) LIKE '%remote%' THEN
    location_score := 90;
  ELSE
    location_score := 30;
  END IF;
  
  -- Calculate weighted total
  total_score := (
    skill_match_score * 0.4 + 
    experience_score * 0.35 + 
    location_score * 0.25
  )::INTEGER;
  
  RETURN GREATEST(0, LEAST(100, total_score));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_user_data(user_id_to_delete UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM applications WHERE applicant_id = user_id_to_delete;
  DELETE FROM jobs WHERE posted_by = user_id_to_delete;
  DELETE FROM profiles WHERE id = user_id_to_delete;
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
