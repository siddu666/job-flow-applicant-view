
-- Fix infinite recursion policy error
-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Disable RLS temporarily to clear any problematic state
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "profiles_admin_access" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Similar fixes for jobs table
DROP POLICY IF EXISTS "Public jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Users can insert their own job" ON jobs;
DROP POLICY IF EXISTS "Users can update own job" ON jobs;

ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select_all" ON jobs
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "jobs_insert_authenticated" ON jobs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "jobs_update_own" ON jobs
  FOR UPDATE TO authenticated
  USING (auth.uid() = posted_by);

-- Fix applications table policies
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
DROP POLICY IF EXISTS "Users can update own applications" ON applications;

ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applications_select_own" ON applications
  FOR SELECT TO authenticated
  USING (auth.uid() = applicant_id);

CREATE POLICY "applications_insert_own" ON applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "applications_update_own" ON applications
  FOR UPDATE TO authenticated
  USING (auth.uid() = applicant_id);

-- Allow job posters to view applications for their jobs
CREATE POLICY "applications_job_poster_access" ON applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.posted_by = auth.uid()
    )
  );
