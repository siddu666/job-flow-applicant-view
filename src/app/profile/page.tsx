'use client'

import { useState, useEffect } from 'react'
import { useProfile, useUpdateProfile, useUploadCV } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Upload, Download, User, Briefcase, FileText, Settings } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const { data: profile, isLoading, error } = useProfile()
  const updateProfile = useUpdateProfile()
  const uploadCV = useUploadCV()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    current_location: '',
    bio: '',
    skills: [] as string[],
    experience_years: 0,
    expected_salary_sek: 0,
    availability: '',
    willing_to_relocate: false,
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    job_seeking_status: '',
  })

  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        current_location: profile.current_location || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        experience_years: profile.experience_years || 0,
        expected_salary_sek: profile.expected_salary_sek || 0,
        availability: profile.availability || '',
        willing_to_relocate: profile.willing_to_relocate || false,
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        portfolio_url: profile.portfolio_url || '',
        job_seeking_status: profile.job_seeking_status || '',
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync(formData)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB')
        return
      }

      if (!file.type.includes('pdf')) {
        toast.error('Please upload a PDF file')
        return
      }

      try {
        await uploadCV.mutateAsync(file)
      } catch (error) {
        console.error('Error uploading CV:', error)
      }
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading profile</h1>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600">Manage your profile information and preferences</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Professional
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="current_location">Current Location</Label>
                  <Input
                    id="current_location"
                    value={formData.current_location}
                    onChange={(e) => handleInputChange('current_location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expected_salary_sek">Expected Salary (SEK)</Label>
                    <Input
                      id="expected_salary_sek"
                      type="number"
                      value={formData.expected_salary_sek}
                      onChange={(e) => handleInputChange('expected_salary_sek', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="2_weeks">2 weeks notice</SelectItem>
                      <SelectItem value="1_month">1 month notice</SelectItem>
                      <SelectItem value="3_months">3 months notice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="job_seeking_status">Job Seeking Status</Label>
                  <Select value={formData.job_seeking_status} onValueChange={(value) => handleInputChange('job_seeking_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actively_looking">Actively Looking</SelectItem>
                      <SelectItem value="open_to_opportunities">Open to Opportunities</SelectItem>
                      <SelectItem value="not_looking">Not Looking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Skills</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" onClick={handleAddSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveSkill(skill)}>
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio_url">Portfolio URL</Label>
                    <Input
                      id="portfolio_url"
                      type="url"
                      value={formData.portfolio_url}
                      onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cv_upload">CV/Resume</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      id="cv_upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('cv_upload')?.click()}
                      disabled={uploadCV.isPending}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadCV.isPending ? 'Uploading...' : 'Upload CV'}
                    </Button>
                    {profile.cv_url && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.open(profile.cv_url!, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        View Current CV
                      </Button>
                    )}
                  </div>
                  {profile.cv_url && (
                    <p className="text-sm text-green-600 mt-2">CV uploaded successfully</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="willing_to_relocate"
                    checked={formData.willing_to_relocate}
                    onCheckedChange={(checked) => handleInputChange('willing_to_relocate', checked)}
                  />
                  <Label htmlFor="willing_to_relocate">Willing to relocate</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updateProfile.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}