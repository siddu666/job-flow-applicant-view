
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useProfile, useUpdateProfile, useUploadCV } from '@/hooks/useProfile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Upload, FileText, Briefcase, MapPin, Phone, Mail, User, Award } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(user?.id)
  const updateProfile = useUpdateProfile()
  const uploadCV = useUploadCV()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    current_location: '',
    expected_salary_sek: '',
    preferred_cities: [] as string[],
    availability: '',
    skills: [] as string[],
    portfolio_url: '',
    certifications: [] as string[],
    linkedin_url: '',
    github_url: '',
    job_seeking_status: '',
    experience_years: '',
    willing_to_relocate: false,
  })

  const [newSkill, setNewSkill] = useState('')
  const [newCertification, setNewCertification] = useState('')
  const [newCity, setNewCity] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        current_location: profile.current_location || '',
        expected_salary_sek: profile.expected_salary_sek?.toString() || '',
        preferred_cities: profile.preferred_cities || [],
        availability: profile.availability || '',
        skills: profile.skills || [],
        portfolio_url: profile.portfolio_url || '',
        certifications: profile.certifications || [],
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        job_seeking_status: profile.job_seeking_status || '',
        experience_years: profile.experience_years?.toString() || '',
        willing_to_relocate: profile.willing_to_relocate || false,
      })
    }
  }, [profile, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setIsUpdating(true)

    try {
      let cvUrl = profile?.cv_url

      // Upload CV if a new file is selected
      if (cvFile) {
        const uploadResult = await uploadCV.mutateAsync({ id: user.id, file: cvFile })
        cvUrl = uploadResult
      }

      const updates = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        bio: formData.bio,
        current_location: formData.current_location,
        expected_salary_sek: formData.expected_salary_sek ? parseInt(formData.expected_salary_sek) : null,
        preferred_cities: formData.preferred_cities,
        availability: formData.availability,
        skills: formData.skills,
        portfolio_url: formData.portfolio_url,
        certifications: formData.certifications,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        job_seeking_status: formData.job_seeking_status,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        willing_to_relocate: formData.willing_to_relocate,
        cv_url: cvUrl,
        updated_at: new Date().toISOString(),
      }

      await updateProfile.mutateAsync({ id: user.id, updates })
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCertification.trim()] }))
      setNewCertification('')
    }
  }

  const removeCertification = (cert: string) => {
    setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c !== cert) }))
  }

  const addCity = () => {
    if (newCity.trim() && !formData.preferred_cities.includes(newCity.trim())) {
      setFormData(prev => ({ ...prev, preferred_cities: [...prev.preferred_cities, newCity.trim()] }))
      setNewCity('')
    }
  }

  const removeCity = (city: string) => {
    setFormData(prev => ({ ...prev, preferred_cities: prev.preferred_cities.filter(c => c !== city) }))
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600">{profileError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your professional profile and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+46 70 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentLocation">Current Location</Label>
              <Input
                id="currentLocation"
                value={formData.current_location}
                onChange={(e) => setFormData(prev => ({ ...prev, current_location: e.target.value }))}
                placeholder="Stockholm, Sweden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Information
            </CardTitle>
            <CardDescription>Your work experience and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Years of Experience</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                  placeholder="5"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedSalary">Expected Salary (SEK)</Label>
                <Input
                  id="expectedSalary"
                  type="number"
                  value={formData.expected_salary_sek}
                  onChange={(e) => setFormData(prev => ({ ...prev, expected_salary_sek: e.target.value }))}
                  placeholder="50000"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately</SelectItem>
                  <SelectItem value="2_weeks">2 weeks notice</SelectItem>
                  <SelectItem value="1_month">1 month notice</SelectItem>
                  <SelectItem value="2_months">2 months notice</SelectItem>
                  <SelectItem value="3_months">3 months notice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobSeekingStatus">Job Seeking Status</Label>
              <Select value={formData.job_seeking_status} onValueChange={(value) => setFormData(prev => ({ ...prev, job_seeking_status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actively_looking">Actively Looking</SelectItem>
                  <SelectItem value="passively_looking">Open to Opportunities</SelectItem>
                  <SelectItem value="not_looking">Not Looking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="willingToRelocate"
                checked={formData.willing_to_relocate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, willing_to_relocate: !!checked }))}
              />
              <Label htmlFor="willingToRelocate">Willing to relocate</Label>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your technical and professional skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                  {skill} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preferred Cities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Preferred Cities
            </CardTitle>
            <CardDescription>Cities where you'd like to work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Add a city"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
              />
              <Button type="button" onClick={addCity}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.preferred_cities.map((city, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCity(city)}>
                  {city} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
            <CardDescription>Your professional certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add a certification"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
              />
              <Button type="button" onClick={addCertification}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCertification(cert)}>
                  {cert} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Links & Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Links & Documents</CardTitle>
            <CardDescription>Your portfolio, social links, and CV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
              <Input
                id="portfolioUrl"
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                placeholder="https://your-portfolio.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cv">CV/Resume</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                {profile?.cv_url && (
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      View Current CV
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isUpdating} className="w-full">
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating Profile...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </form>
    </div>
  )
}
