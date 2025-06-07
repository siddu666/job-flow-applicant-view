'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

// Define the Profile interface
interface Profile {
  first_name: string
  last_name: string
  phone: string
  current_location: string
  bio: string
  skills: string[]
  experience_years: number | null
  linkedin_url: string
  github_url: string
  portfolio_url: string
  email: string
  role: string
  certifications: string[]
  preferred_cities: string[]
  willing_to_relocate: boolean
  job_seeking_status: string
  expected_salary_sek: number | null
  cv_url: string | null
}

const JOB_SEEKING_STATUS_OPTIONS = [
  { value: 'actively_looking', label: 'Actively Looking' },
  { value: 'open_to_offers', label: 'Open to Offers' },
  { value: 'not_looking', label: 'Not Looking' }
]

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const uploadCV = useUploadCV()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isUploadingCV, setIsUploadingCV] = useState(false)

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }
  }, [user, loading, router])

  // Fetch profile data
  useEffect(() => {
    if (user?.id) {
      fetchProfile()
    }
  }, [user?.id, fetchProfile])

  const fetchProfile = async () => {
    if (!user?.id) return

    try {
      setIsProfileLoading(true)

      const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

      if (error) {
        // If profile doesn't exist, that's okay - we'll create one on submit
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
          toast.error('Failed to load profile data')
        }
        return
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
          cv_url: data.cv_url || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) {
      toast.error('Please log in to upload a CV')
      return
    }

    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    try {
      setIsUploadingCV(true)
      const result = await uploadCV.mutateAsync({ userId: user.id, file })

      if (result?.cv_url) {
        setProfile(prev => ({ ...prev, cv_url: result.cv_url }))
        toast.success('CV uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading CV:', error)
      toast.error('Failed to upload CV')
    } finally {
      setIsUploadingCV(false)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      toast.error('Please log in to update your profile')
      return
    }

    setIsLoading(true)

    try {
      // Validate required fields
      if (!profile.first_name.trim() || !profile.last_name.trim()) {
        toast.error('First name and last name are required')
        return
      }

      const profileData = {
        id: user.id,
        ...profile,
        // Ensure arrays are properly formatted
        skills: Array.isArray(profile.skills) ? profile.skills.filter(skill => skill.trim()) : [],
        certifications: Array.isArray(profile.certifications) ? profile.certifications.filter(cert => cert.trim()) : [],
        preferred_cities: Array.isArray(profile.preferred_cities) ? profile.preferred_cities.filter(city => city.trim()) : [],
        // Ensure proper data types
        experience_years: profile.experience_years ? Number(profile.experience_years) : null,
        expected_salary_sek: profile.expected_salary_sek ? Number(profile.expected_salary_sek) : null,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
          .from('profiles')
          .upsert(profileData, {
            onConflict: 'id'
          })

      if (error) {
        throw error
      }

      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkillsChange = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
    setProfile(prev => ({ ...prev, skills: skillsArray }))
  }

  const handleCertificationsChange = (value: string) => {
    const certificationsArray = value.split(',').map(cert => cert.trim()).filter(cert => cert.length > 0)
    setProfile(prev => ({ ...prev, certifications: certificationsArray }))
  }

  const handlePreferredCitiesChange = (value: string) => {
    const citiesArray = value.split(',').map(city => city.trim()).filter(city => city.length > 0)
    setProfile(prev => ({ ...prev, preferred_cities: citiesArray }))
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
    )
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!user) {
    return null
  }

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-2 text-gray-600">Manage your professional information to improve job matching</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Keep your profile up to date to get the best job recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProfileLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <p className="text-gray-600">Loading profile data...</p>
                    </div>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="first_name">First Name *</Label>
                          <Input
                              id="first_name"
                              value={profile.first_name}
                              onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                              placeholder="Enter your first name"
                              required
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
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="your.email@example.com"
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
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="current_location">Current Location</Label>
                          <Input
                              id="current_location"
                              value={profile.current_location}
                              onChange={(e) => setProfile(prev => ({ ...prev, current_location: e.target.value }))}
                              placeholder="Stockholm, Sweden"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Current Role/Title</Label>
                          <Input
                              id="role"
                              value={profile.role}
                              onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                              placeholder="Software Developer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>

                      <div>
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself, your experience, and your career goals..."
                            rows={4}
                            className="resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="experience_years">Years of Experience</Label>
                          <Input
                              id="experience_years"
                              type="number"
                              min="0"
                              max="50"
                              value={profile.experience_years || ''}
                              onChange={(e) => setProfile(prev => ({
                                ...prev,
                                experience_years: e.target.value ? parseInt(e.target.value) : null
                              }))}
                              placeholder="5"
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
                              onChange={(e) => setProfile(prev => ({
                                ...prev,
                                expected_salary_sek: e.target.value ? parseInt(e.target.value) : null
                              }))}
                              placeholder="45000"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="skills">Skills</Label>
                        <Textarea
                            id="skills"
                            value={profile.skills.join(', ')}
                            onChange={(e) => handleSkillsChange(e.target.value)}
                            placeholder="JavaScript, React, Node.js, Python, SQL"
                            rows={3}
                            className="resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                      </div>

                      <div>
                        <Label htmlFor="certifications">Certifications</Label>
                        <Textarea
                            id="certifications"
                            value={profile.certifications.join(', ')}
                            onChange={(e) => handleCertificationsChange(e.target.value)}
                            placeholder="AWS Certified Developer, Google Cloud Professional"
                            rows={2}
                            className="resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate certifications with commas</p>
                      </div>
                    </div>

                    {/* Job Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Job Preferences</h3>

                      <div>
                        <Label htmlFor="job_seeking_status">Job Seeking Status</Label>
                        <Select
                            value={profile.job_seeking_status}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, job_seeking_status: value }))}
                        >
                          <SelectTrigger>
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

                      <div>
                        <Label htmlFor="preferred_cities">Preferred Cities</Label>
                        <Textarea
                            id="preferred_cities"
                            value={profile.preferred_cities.join(', ')}
                            onChange={(e) => handlePreferredCitiesChange(e.target.value)}
                            placeholder="Stockholm, Gothenburg, Malmö"
                            rows={2}
                            className="resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate cities with commas</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                            id="willing_to_relocate"
                            checked={profile.willing_to_relocate}
                            onCheckedChange={(checked) =>
                                setProfile(prev => ({ ...prev, willing_to_relocate: Boolean(checked) }))
                            }
                        />
                        <Label htmlFor="willing_to_relocate">Willing to relocate</Label>
                      </div>
                    </div>

                    {/* Professional Links */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Professional Links</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                          <Input
                              id="linkedin_url"
                              type="url"
                              value={profile.linkedin_url}
                              onChange={(e) => setProfile(prev => ({ ...prev, linkedin_url: e.target.value }))}
                              placeholder="https://linkedin.com/in/yourprofile"
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
                          />
                        </div>
                      </div>
                    </div>

                    {/* CV Upload */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">CV Upload</h3>
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
                          className="w-full sm:w-auto"
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
  )
}