'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Award, Code, Heart, Languages, FileText, Upload, 
  CheckCircle, AlertCircle, Edit, Download, Eye,
  Github, Linkedin, Calendar
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useProfile } from '@/hooks/useProfile'
import { CVProcessingService } from '@/lib/cv-processing-service'
import ProfileEditor from './ProfileEditor'
import Modal from '@/components/ui/Modal'
import { Profile } from '@/interfaces/Profile'
import { toast } from 'sonner'

const CandidateProfile = () => {
  const { user } = useAuth()
  const { data: profile, isLoading, refetch } = useProfile(user?.id)
  const [isUploading, setIsUploading] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cvProcessingService = new CVProcessingService()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user?.id) return

    setIsUploading(true)
    try {
      const result = await cvProcessingService.processCV(file, user.id)

      if (result.success) {
        toast.success('CV processed successfully!')
        refetch()
      } else if (result.rejected) {
        toast.error(`CV rejected: ${result.rejectionReason}`)
      } else {
        toast.error(`Processing failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error processing CV:', error)
      toast.error('Failed to process CV')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleProfileUpdated = (updatedProfile: Profile) => {
    refetch()
  }

  const handleViewCV = () => {
    if (profile?.cv_url) {
      window.open(`/api/files/${profile.cv_url}`, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  const InfoSection = ({ 
    title, 
    icon: Icon, 
    children, 
    gradient 
  }: { 
    title: string
    icon: React.ElementType
    children: React.ReactNode
    gradient: string
  }) => (
    <Card className="border-0 shadow-lg h-full">
      <CardHeader className={`${gradient} text-white rounded-t-lg`}>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/20 rounded-lg">
            <Icon className="h-5 w-5" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1">
        {children}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-xl text-gray-600">
            {profile.current_position || 'Professional'} 
            {profile.current_company && ` at ${profile.current_company}`}
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowEditor(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <InfoSection 
              title="Personal Information" 
              icon={User}
              gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">{profile.phone}</span>
                    </div>
                  )}
                  {profile.current_location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">{profile.current_location}</span>
                    </div>
                  )}
                  {profile.experience_years && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">{profile.experience_years} years experience</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(profile.linkedin_url || profile.github_url) && (
                  <div className="flex gap-3 pt-2">
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      </a>
                    )}
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </Button>
                      </a>
                    )}
                  </div>
                )}

                {profile.bio && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-2">Professional Summary</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            </InfoSection>

            {/* Technical Skills */}
            <InfoSection 
              title="Technical Skills" 
              icon={Code}
              gradient="bg-gradient-to-r from-green-500 to-emerald-500"
            >
              <div className="space-y-4">
                {profile.skills && profile.skills.length > 0 ? (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}

                {profile.tools && profile.tools.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-3">Tools & Software</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.tools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="border-green-300 text-green-700">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </InfoSection>

            {/* Work Experience & Projects */}
            <InfoSection 
              title="Experience & Projects" 
              icon={Briefcase}
              gradient="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <div className="space-y-4">
                {profile.current_position && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Current Role</h4>
                    <p className="text-gray-700">
                      {profile.current_position}
                      {profile.current_company && ` at ${profile.current_company}`}
                    </p>
                  </div>
                )}

                {profile.project_summary && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-2">Project Summary</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{profile.project_summary}</p>
                  </div>
                )}
              </div>
            </InfoSection>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* CV Upload */}
            <InfoSection 
              title="CV / Resume" 
              icon={FileText}
              gradient="bg-gradient-to-r from-orange-500 to-red-500"
            >
              <div className="space-y-4">
                {profile.cv_url ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">CV uploaded successfully</p>
                        <p className="text-xs text-green-600">Ready for applications</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleViewCV}>
                        <Eye className="h-4 w-4 mr-2" />
                        View CV
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Update CV
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      {isUploading ? 'Processing CV...' : 'Click to upload your CV/Resume'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX (max 10MB)</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>
            </InfoSection>

            {/* Education */}
            <InfoSection 
              title="Education" 
              icon={GraduationCap}
              gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              <div className="space-y-3">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div key={index} className="p-3 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-indigo-800 font-medium">{edu}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No education information added</p>
                )}
              </div>
            </InfoSection>

            {/* Certifications */}
            <InfoSection 
              title="Certifications" 
              icon={Award}
              gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
            >
              <div className="space-y-2">
                {profile.certifications && profile.certifications.length > 0 ? (
                  profile.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="w-full justify-start border-yellow-300 text-yellow-800">
                      <Award className="h-3 w-3 mr-2" />
                      {cert}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No certifications added</p>
                )}
              </div>
            </InfoSection>

            {/* Personal Interests */}
            <InfoSection 
              title="Interests & Languages" 
              icon={Heart}
              gradient="bg-gradient-to-r from-pink-500 to-rose-500"
            >
              <div className="space-y-4">
                {profile.hobbies && profile.hobbies.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Hobbies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.map((hobby, index) => (
                        <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800">
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.languages && profile.languages.length > 0 && (
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="border-pink-300 text-pink-700">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(!profile.hobbies || profile.hobbies.length === 0) && 
                 (!profile.languages || profile.languages.length === 0) && (
                  <p className="text-gray-500 text-sm">No personal interests or languages added</p>
                )}
              </div>
            </InfoSection>
          </div>
        </div>
      </div>

      {/* Profile Editor Modal */}
      <Modal isOpen={showEditor} onClose={() => setShowEditor(false)}>
        <ProfileEditor 
          profile={profile}
          onProfileUpdated={handleProfileUpdated}
          onClose={() => setShowEditor(false)}
        />
      </Modal>
    </div>
  )
}

export default CandidateProfile