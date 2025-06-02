
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useProfile, useUpdateProfile, useUploadCV, useDeleteCV } from '@/hooks/useProfile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { 
  Loader2, 
  User, 
  Briefcase, 
  FileText, 
  Settings, 
  Upload,
  Download,
  Trash2,
  Plus,
  X
} from 'lucide-react'

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  const { data: profile, isLoading: profileLoading, error } = useProfile(user?.id)
  const updateProfile = useUpdateProfile()
  const uploadCV = useUploadCV()
  const deleteCV = useDeleteCV()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    current_location: '',
    willing_to_relocate: false,
    preferred_cities: [] as string[],
    experience_years: 0,
    expected_salary_sek: '',
    availability: '',
    skills: [] as string[],
    portfolio_url: '',
    certifications: [] as string[],
    linkedin_url: '',
    github_url: '',
    bio: '',
    job_seeking_status: '',
    date_of_birth: '',
    nationality: '',
    work_authorization: '',
    visa_status: '',
    education: [] as any[],
    work_experience: [] as any[],
    languages: [] as string[],
  })

  const [newSkill, setNewSkill] = useState('')
  const [newCertification, setNewCertification] = useState('')
  const [newLanguage, setNewLanguage] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
      return
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        current_location: profile.current_location || '',
        willing_to_relocate: profile.willing_to_relocate || false,
        preferred_cities: profile.preferred_cities || [],
        experience_years: profile.experience_years || 0,
        expected_salary_sek: profile.expected_salary_sek?.toString() || '',
        availability: profile.availability || '',
        skills: profile.skills || [],
        portfolio_url: profile.portfolio_url || '',
        certifications: profile.certifications || [],
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        bio: profile.bio || '',
        job_seeking_status: profile.job_seeking_status || '',
        date_of_birth: profile.date_of_birth || '',
        nationality: profile.nationality || '',
        work_authorization: profile.work_authorization || '',
        visa_status: profile.visa_status || '',
        education: profile.education || [],
        work_experience: profile.work_experience || [],
        languages: profile.languages || [],
      })
    }
  }, [profile])

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">There was an error loading your profile.</p>
          <Button onClick={() => router.push('/onboarding')}>
            Complete Setup
          </Button>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const handleSave = async () => {
    try {
      const updates = {
        ...formData,
        expected_salary_sek: formData.expected_salary_sek ? parseInt(formData.expected_salary_sek) : null,
        updated_at: new Date().toISOString(),
      }

      await updateProfile.mutateAsync({
        userId: user.id,
        updates
      })

      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleCVUpload = async () => {
    if (!cvFile) return

    try {
      await uploadCV.mutateAsync({
        userId: user.id,
        file: cvFile
      })
      setCvFile(null)
      toast.success('CV uploaded successfully!')
    } catch (error: any) {
      console.error('CV upload error:', error)
      toast.error(error.message || 'Failed to upload CV')
    }
  }

  const handleCVDelete = async () => {
    try {
      await deleteCV.mutateAsync(user.id)
      toast.success('CV deleted successfully!')
    } catch (error: any) {
      console.error('CV delete error:', error)
      toast.error(error.message || 'Failed to delete CV')
    }
  }

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  const addCertification = () => {
    if (newCertification && !formData.certifications.includes(newCertification)) {
      setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCertification] }))
      setNewCertification('')
    }
  }

  const removeCertification = (cert: string) => {
    setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c !== cert) }))
  }

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData(prev => ({ ...prev, languages: [...prev.languages, newLanguage] }))
      setNewLanguage('')
    }
  }

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.profile_picture_url || ''} />
                  <AvatarFallback>
                    {formData.first_name?.[0]}{formData.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {formData.first_name} {formData.last_name}
                  </h3>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    value={formData.current_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_location: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary (SEK)</Label>
                  <Input
                    id="expectedSalary"
                    type="number"
                    value={formData.expected_salary_sek}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_salary_sek: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
                    disabled={!isEditing}
                  >
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
                  <Select
                    value={formData.job_seeking_status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, job_seeking_status: value }))}
                    disabled={!isEditing}
                  >
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
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button type="button" onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {language}
                      {isEditing && (
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeLanguage(language)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add a language"
                      onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                    />
                    <Button type="button" onClick={addLanguage} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Certifications</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {cert}
                      {isEditing && (
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeCertification(cert)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add a certification"
                      onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                    />
                    <Button type="button" onClick={addCertification} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                <Input
                  id="portfolioUrl"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={formData.github_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>CV/Resume</Label>
                  {profile.cv_url ? (
                    <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 rounded-md">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm flex-1">CV uploaded</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCVDelete}
                        disabled={deleteCV.isPending}
                      >
                        {deleteCV.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 mt-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      />
                      {cvFile && (
                        <Button onClick={handleCVUpload} disabled={uploadCV.isPending}>
                          {uploadCV.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload CV
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="workAuthorization">Work Authorization</Label>
                <Input
                  id="workAuthorization"
                  value={formData.work_authorization}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_authorization: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visaStatus">Visa Status</Label>
                <Input
                  id="visaStatus"
                  value={formData.visa_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, visa_status: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="willingToRelocate"
                  checked={formData.willing_to_relocate}
                  onChange={(e) => setFormData(prev => ({ ...prev, willing_to_relocate: e.target.checked }))}
                  disabled={!isEditing}
                />
                <Label htmlFor="willingToRelocate">Willing to relocate</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
