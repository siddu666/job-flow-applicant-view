'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  Save,
  Edit3,
  Award,
  Target,
  Settings
} from 'lucide-react'
import { useProfile, useUpdateProfile, Profile } from '@/hooks/useProfile'
import Loading from "@/components/Loading";
import {useAuth} from "@/contexts/auth-context";

const SKILLS_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'Angular', 'Vue.js', 'Next.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git'
]

// Tag Input Component
function TagInput({ tags, setTags, suggestions, placeholder }: {
  tags: string[]
  setTags: (tags: string[]) => void
  suggestions: string[]
  placeholder: string
}) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()])
    }
    setInputValue('')
    setShowSuggestions(false)
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const filteredSuggestions = suggestions.filter(
      suggestion =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(suggestion)
  )

  return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
          ))}
        </div>
        <div className="relative">
          <Input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setShowSuggestions(true)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag(inputValue)
                }
              }}
              placeholder={placeholder}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                        key={index}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-gray-100"
                        onClick={() => addTag(suggestion)}
                    >
                      {suggestion}
                    </button>
                ))}
              </div>
          )}
        </div>
      </div>
  )
}

export default function ProfilePage() {
  // Get userId from your auth context or wherever it's stored
  const context = useAuth()
  const userId = context.user?.id;

  const { data: initialProfile, isLoading, error } = useProfile(userId)
  const updateProfileMutation = useUpdateProfile()

  const [profile, setProfile] = useState<Partial<Profile>>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile)
    }
  }, [initialProfile])

  const handleSave = async () => {
    if (!userId) return

    try {
      await updateProfileMutation.mutateAsync({
        userId,
        updates: profile
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCertificationsChange = (value: string) => {
    const certifications = value.split(',').map(cert => cert.trim()).filter(cert => cert.length > 0)
    setProfile(prev => ({ ...prev, certifications }))
  }

  const getInitials = (profile: Partial<Profile>) => {
    const firstName = profile.first_name || ''
    const lastName = profile.last_name || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (isLoading) return <Loading />
  if (error) return <div>Error loading profile: {error.message}</div>

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your professional information</p>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {getInitials(profile)}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile.first_name} {profile.last_name}
                  </h2>

                  <div className="space-y-3 text-sm text-gray-600">
                    {profile.current_location && (
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{profile.current_location}</span>
                        </div>
                    )}

                    {profile.phone && (
                        <div className="flex items-center justify-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{profile.phone}</span>
                        </div>
                    )}

                    {profile.email && (
                        <div className="flex items-center justify-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{profile.email}</span>
                        </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {profile.experience_years || 0}
                      </div>
                      <div className="text-xs text-gray-500">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {profile.skills?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Skills</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Overview */}
              {profile.skills && profile.skills.length > 0 && (
                  <Card className="mt-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Top Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.slice(0, 8).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                        ))}
                        {profile.skills.length > 8 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 8} more
                            </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
              )}
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2">
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
                  <TabsTrigger value="skills" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Preferences
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                              id="first_name"
                              value={profile.first_name || ''}
                              onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                              disabled={!isEditing}
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                              id="last_name"
                              value={profile.last_name || ''}
                              onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                              disabled={!isEditing}
                              className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                              id="email"
                              type="email"
                              value={profile.email || ''}
                              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                              disabled={!isEditing}
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                              id="phone"
                              value={profile.phone || ''}
                              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                              disabled={!isEditing}
                              className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="current_location">Current Location</Label>
                        <Input
                            id="current_location"
                            value={profile.current_location || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, current_location: e.target.value }))}
                            disabled={!isEditing}
                            className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                            id="bio"
                            value={profile.bio || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            disabled={!isEditing}
                            rows={4}
                            className="resize-none mt-1"
                            placeholder="Tell us about yourself and your professional background..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Professional Information Tab */}
                <TabsContent value="professional">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Professional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="current_position">Current Position</Label>
                        <Input
                            id="current_position"
                            value={profile.current_location || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, current_position: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Senior Software Developer"
                            className="mt-1"
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
                              placeholder="45000"
                              className="mt-1"
                          />
                        </div>
                      </div>

                      

                      <div>
                        <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                        <Input
                            id="linkedin_profile"
                            type="url"
                            value={profile.linkedin_url || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, linkedin_profile: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="certifications">Certifications</Label>
                        <Textarea
                            id="certifications"
                            value={profile.certifications?.join(', ') || ''}
                            onChange={(e) => handleCertificationsChange(e.target.value)}
                            disabled={!isEditing}
                            placeholder="AWS Certified Developer, Google Cloud Professional"
                            rows={2}
                            className="resize-none mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate certifications with commas</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Skills & Expertise</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label>Technical Skills</Label>
                        {isEditing ? (
                            <TagInput
                                tags={profile.skills || []}
                                setTags={(skills) => setProfile(prev => ({ ...prev, skills }))}
                                suggestions={SKILLS_SUGGESTIONS}
                                placeholder="Add a skill and press Enter"
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {profile.skills && profile.skills.length > 0 ? (
                                  profile.skills.map((skill, index) => (
                                      <Badge key={index} variant="secondary">
                                        {skill}
                                      </Badge>
                                  ))
                              ) : (
                                  <p className="text-gray-500 text-sm">No skills added yet</p>
                              )}
                            </div>
                        )}
                      </div>

                      {profile.certifications && profile.certifications.length > 0 && (
                          <div>
                            <Label>Certifications</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {profile.certifications.map((cert, index) => (
                                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <Award className="h-3 w-3 mr-1" />
                                    {cert}
                                  </Badge>
                              ))}
                            </div>
                          </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Job Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="preferred_location">Preferred Work Location</Label>
                          <Input
                              id="preferred_location"
                              value={profile.preferred_cities || ''}
                              onChange={(e) => setProfile(prev => ({ ...prev, preferred_location: e.target.value }))}
                              disabled={!isEditing}
                              placeholder="Stockholm, Remote, Hybrid"
                              className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="work_authorization">Work Authorization</Label>
                          <Input
                              id="work_authorization"
                              value={profile.visa_status || ''}
                              onChange={(e) => setProfile(prev => ({ ...prev, work_authorization: e.target.value }))}
                              disabled={!isEditing}
                              placeholder="EU Citizen, Work Permit, etc."
                              className="mt-1"
                          />
                        </div>
                      </div>

                      {profile.expected_salary_sek && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-700">
                              <DollarSign className="h-5 w-5" />
                              <span className="font-medium">Salary Expectation</span>
                            </div>
                            <p className="text-blue-600 text-lg font-bold mt-1">
                              {profile.expected_salary_sek.toLocaleString()} SEK/month
                            </p>
                          </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
  )
}