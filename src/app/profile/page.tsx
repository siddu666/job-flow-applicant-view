'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { useUploadCV } from "@/hooks/useProfile"
import { Upload, FileText, Loader2 } from 'lucide-react'
import { useRoleRedirect } from '@/hooks/useRoleRedirect'

interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
  current_location: string;
  bio: string;
  skills: string[];
  experience_years: number | null;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  email: string;
  role: string;
  certifications: string[];
  preferred_cities: string[];
  willing_to_relocate: boolean;
  job_seeking_status: string;
  expected_salary_sek: number | null;
  cv_url: string | null;
}

const JOB_SEEKING_STATUS_OPTIONS = [
  { value: 'actively_looking', label: 'Actively Looking' },
  { value: 'not_looking', label: 'Not Looking' }
];

const SKILLS_SUGGESTIONS = [
  // Programming languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++',
  'Go', 'Ruby', 'PHP', 'Kotlin', 'Swift',
  // Web & frameworks
  'HTML', 'CSS', 'React', 'Vue.js', 'Angular', 'Next.js', 'Django', 'ASP.NET',
  // Backend & databases
  'Node.js', 'Express', 'SQL', 'PostgreSQL', 'MongoDB', 'GraphQL',
  // DevOps & cloud
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  // Tools & versioning
  'Git', 'CI/CD', 'Jenkins', 'JIRA', 'Terraform',
  // Architecture & best practices
  'Microservices', 'RESTful APIs', 'Unit Testing', 'Integration Testing',
  // Algorithms & performance
  'Data Structures', 'Algorithms', 'Concurrency',
  // Security & networking
  'Software Security', 'Networking Basics',
  // Soft skills
  'Problem Solving', 'Communication', 'Teamwork', 'Critical Thinking', 'Attention to Detail',
  'Adaptability', 'Resilience', 'Prompt Engineering (AI tools)', 'Continuous Learning'
];


const CITIES_SUGGESTIONS = [
  // Top 50 by population (2024)
  'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping',
  'Västerås', 'Örebro', 'Helsingborg', 'Jönköping', 'Norrköping',
  'Umeå', 'Lund', 'Borås', 'Huddinge', 'Nacka', 'Eskilstuna',
  'Halmstad', 'Gävle', 'Södertälje', 'Haninge', 'Sundsvall',
  'Växjö', 'Karlstad', 'Botkyrka', 'Järfälla', 'Kristianstad',
  'Kungsbacka', 'Solna', 'Luleå', 'Skellefteå', 'Täby',
  'Sollentuna', 'Kalmar', 'Mölndal', 'Varberg', 'Norrtälje',
  'Karlskrona', 'Östersund', 'Gotland', 'Falun', 'Trollhättan',
  'Nyköping', 'Skövde', 'Uddevalla', 'Sundbyberg', 'Örnsköldsvik',
  'Sigtuna', 'Hässleholm', 'Borlänge', 'Upplands Väsby',

  // Additional municipalities (selected alphabetically)
  'Alingsås', 'Borlänge', 'Eskilstuna', 'Habo', 'Kalix',
  'Lidingö', 'Mora', 'Skara', 'Strömstad', 'Åmål', 'Ängelholm'
];

// Component for tag input
interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  suggestions: string[];
  placeholder: string;
}

const TagInput = ({ tags, setTags, suggestions, placeholder }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredSuggestions(
        suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(suggestion)
        )
    );
  }, [inputValue, suggestions, tags]);

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
              <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
            {tag}
                <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                >
              ×
            </button>
          </span>
          ))}
        </div>
        <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full"
        />
        {inputValue && filteredSuggestions.length > 0 && (
            <div className="border rounded-md max-h-32 overflow-y-auto">
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                      key={index}
                      type="button"
                      onClick={() => handleAddTag(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    {suggestion}
                  </button>
              ))}
            </div>
        )}
      </div>
  );
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const uploadCV = useUploadCV();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    phone: '',
    current_location: '',
    bio: '',
    skills: [],
    experience_years: null,
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    email: '',
    role: '',
    certifications: [],
    preferred_cities: [],
    willing_to_relocate: false,
    job_seeking_status: '',
    expected_salary_sek: null,
    cv_url: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isUploadingCV, setIsUploadingCV] = useState(false);

  useRoleRedirect();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
      return
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setIsProfileLoading(true);

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile data');
          return;
        }

        if (data) {
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            phone: data.phone || '',
            current_location: data.current_location || '',
            bio: data.bio || '',
            skills: Array.isArray(data.skills) ? data.skills : [],
            experience_years: data.experience_years || null,
            linkedin_url: data.linkedin_url || '',
            github_url: data.github_url || '',
            portfolio_url: data.portfolio_url || '',
            email: data.email || user.email || '',
            role: data.role || '',
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            preferred_cities: Array.isArray(data.preferred_cities) ? data.preferred_cities : [],
            willing_to_relocate: Boolean(data.willing_to_relocate),
            job_seeking_status: data.job_seeking_status || '',
            expected_salary_sek: data.expected_salary_sek || null,
            cv_url: data.cv_url || null
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsProfileLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id, user?.email]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) {
      toast.error('Please log in to upload a CV');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploadingCV(true);
      const result = await uploadCV.mutateAsync({ userId: user.id, file });

      if (result?.cv_url) {
        setProfile(prev => ({ ...prev, cv_url: result.cv_url }));
        toast.success('CV uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error('Failed to upload CV');
    } finally {
      setIsUploadingCV(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('Please log in to update your profile');
      return;
    }

    setIsLoading(true);

    try {
      if (!profile.first_name.trim() || !profile.last_name.trim()) {
        toast.error('First name and last name are required');
        return;
      }

      const profileData = {
        id: user.id,
        ...profile,
        skills: Array.isArray(profile.skills) ? profile.skills.filter(skill => skill.trim()) : [],
        certifications: Array.isArray(profile.certifications) ? profile.certifications.filter(cert => cert.trim()) : [],
        preferred_cities: Array.isArray(profile.preferred_cities) ? profile.preferred_cities.filter(city => city.trim()) : [],
        experience_years: profile.experience_years ? Number(profile.experience_years) : null,
        expected_salary_sek: profile.expected_salary_sek ? Number(profile.expected_salary_sek) : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });

      if (error) throw error;

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificationsChange = (value: string) => {
    const certificationsArray = value.split(',').map(cert => cert.trim()).filter(cert => cert.length > 0);
    setProfile(prev => ({ ...prev, certifications: certificationsArray }));
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Your Professional Profile
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Craft your digital presence and unlock amazing career opportunities
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {isProfileLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" style={{animationDelay: '0.2s', animationDirection: 'reverse'}}></div>
                      </div>
                      <p className="text-slate-300 text-lg">Loading your profile data...</p>
                    </div>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="first_name">First Name *</Label>
                          <Input
                              id="first_name"
                              value={profile.first_name}
                              onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                              placeholder="Enter your first name"
                              required
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="last_name">Last Name *</Label>
                          <Input
                              id="last_name"
                              value={profile.last_name}
                              onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                              placeholder="Enter your last name"
                              required
                              className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="your.email@example.com"
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                              id="phone"
                              type="tel"
                              value={profile.phone}
                              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+46 70 123 45 67"
                              className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="current_location">Current Location</Label>
                          <Input
                              id="current_location"
                              value={profile.current_location}
                              onChange={(e) => setProfile(prev => ({ ...prev, current_location: e.target.value }))}
                              placeholder="Stockholm, Sweden"
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Current Role/Title</Label>
                          <Input
                              id="role"
                              value={profile.role}
                              onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                              placeholder="Software Developer"
                              className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
                      <div>
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself, your experience, and your career goals..."
                            rows={4}
                            className="resize-none mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="experience_years">Years of Experience</Label>
                          <Input
                              id="experience_years"
                              type="number"
                              min="0"
                              max="50"
                              value={profile.experience_years || ''}
                              onChange={(e) => setProfile(prev => ({ ...prev, experience_years: e.target.value ? parseInt(e.target.value) : null }))}
                              placeholder="5"
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expected_salary_sek">Expected Salary (SEK/month)</Label>
                          <Input
                              id="expected_salary_sek"
                              type="number"
                              min="0"
                              step="1000"
                              value={profile.expected_salary_sek || ''}
                              onChange={(e) => setProfile(prev => ({ ...prev, expected_salary_sek: e.target.value ? parseInt(e.target.value) : null }))}
                              placeholder="45000"
                              className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Skills</h3>
                        <div>
                          <Label>Add Your Skills</Label>
                          <TagInput
                              tags={profile.skills}
                              setTags={(skills) => setProfile(prev => ({ ...prev, skills }))}
                              suggestions={SKILLS_SUGGESTIONS}
                              placeholder="Add a skill and press Enter"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="certifications">Certifications</Label>
                        <Textarea
                            id="certifications"
                            value={profile.certifications.join(', ')}
                            onChange={(e) => handleCertificationsChange(e.target.value)}
                            placeholder="AWS Certified Developer, Google Cloud Professional"
                            rows={2}
                            className="resize-none mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate certifications with commas</p>
                      </div>
                    </div>

                    {/* Job Preferences */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Job Preferences</h3>
                      <div>
                        <Label htmlFor="job_seeking_status">Job Seeking Status</Label>
                        <Select
                            value={profile.job_seeking_status}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, job_seeking_status: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select your job seeking status" />
                          </SelectTrigger>
                          <SelectContent>
                            {JOB_SEEKING_STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Preferred Cities</h3>
                        <div>
                          <Label>Add Preferred Cities</Label>
                          <TagInput
                              tags={profile.preferred_cities}
                              setTags={(cities) => setProfile(prev => ({ ...prev, preferred_cities: cities }))}
                              suggestions={CITIES_SUGGESTIONS}
                              placeholder="Add a city and press Enter"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                            id="willing_to_relocate"
                            checked={profile.willing_to_relocate}
                            onCheckedChange={(checked) => setProfile(prev => ({ ...prev, willing_to_relocate: Boolean(checked) }))}
                        />
                        <Label htmlFor="willing_to_relocate">Willing to relocate</Label>
                      </div>
                    </div>

                    {/* Professional Links */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Professional Links</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                          <Input
                              id="linkedin_url"
                              type="url"
                              value={profile.linkedin_url}
                              onChange={(e) => setProfile(prev => ({ ...prev, linkedin_url: e.target.value }))}
                              placeholder="https://linkedin.com/in/yourprofile"
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="github_url">GitHub URL</Label>
                          <Input
                              id="github_url"
                              type="url"
                              value={profile.github_url}
                              onChange={(e) => setProfile(prev => ({ ...prev, github_url: e.target.value }))}
                              placeholder="https://github.com/yourusername"
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio_url">Portfolio URL</Label>
                          <Input
                              id="portfolio_url"
                              type="url"
                              value={profile.portfolio_url}
                              onChange={(e) => setProfile(prev => ({ ...prev, portfolio_url: e.target.value }))}
                              placeholder="https://yourportfolio.com"
                              className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CV Upload */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">CV Upload</h3>
                      <div>
                        <Label htmlFor="cv-upload">Upload CV</Label>
                        <div className="mt-2">
                          <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                              id="cv-upload"
                              disabled={isUploadingCV}
                          />
                          <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploadingCV}
                              className="w-full sm:w-auto"
                          >
                            {isUploadingCV ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                            ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Choose File
                                </>
                            )}
                          </Button>
                          <p className="text-sm text-gray-500 mt-1">
                            Supported formats: PDF, DOC, DOCX (max 5MB)
                          </p>
                        </div>

                        {profile.cv_url && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-green-600 mr-2" />
                                <span className="text-sm text-green-800">CV uploaded successfully</span>
                              </div>
                              <a
                                  href={profile.cv_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-green-600 hover:text-green-800 underline ml-6"
                              >
                                View Current CV
                              </a>
                            </div>
                        )}
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
                      <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push('/jobs')}
                          className="w-full sm:w-auto"
                      >
                        View Jobs
                      </Button>
                      <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                        ) : (
                            'Update Profile'
                        )}
                      </Button>
                    </div>
                  </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}