
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useProfile } from '@/hooks/useProfile'
import { useJobById } from '@/hooks/useJobs'
import { useCreateApplication } from '@/hooks/useApplications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Briefcase, MapPin, DollarSign, Clock, User, FileText } from 'lucide-react'

export default function ApplyPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('job_id')

  const { data: profile, isLoading: profileLoading } = useProfile(user?.id)
  const { data: job, isLoading: jobLoading } = useJobById(jobId || '')
  const createApplication = useCreateApplication()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    availability: '',
    cover_letter: '',
    skills: [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
      return
    }

    if (!jobId) {
      router.push('/jobs')
      return
    }
  }, [user, authLoading, jobId, router])

  useEffect(() => {
    if (profile && user) {
      setFormData({
        full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.email || user.email || '',
        phone: profile.phone || '',
        availability: profile.availability || '',
        cover_letter: '',
        skills: profile.skills || [],
      })
    }
  }, [profile, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !jobId) return

    setIsSubmitting(true)

    try {
      const applicationData = {
        applicant_id: user.id,
        job_id: jobId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        availability: formData.availability,
        cover_letter: formData.cover_letter,
        skills: formData.skills,
        cv_url: profile?.cv_url || null,
        status: 'pending',
      }

      await createApplication.mutateAsync(applicationData)
      toast.success('Application submitted successfully!')
      router.push('/profile')
    } catch (error: any) {
      console.error('Application submission error:', error)
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }))
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  if (authLoading || profileLoading || jobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || !jobId) {
    return null
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're trying to apply for doesn't exist.</p>
          <Button onClick={() => router.push('/jobs')}>Browse Jobs</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Apply for Position</h1>
        <p className="text-gray-600">Complete your application below</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Job Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.type}
                </span>
                {job.salary_range && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary_range}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600 text-sm">{job.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Requirements</h4>
              <p className="text-gray-600 text-sm">{job.requirements}</p>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Application Form
              </CardTitle>
              <CardDescription>Your information has been pre-filled from your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
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
                <Label>Your Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  value={formData.cover_letter}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
                  placeholder="Tell us why you're interested in this position..."
                  rows={6}
                  required
                />
              </div>

              {profile?.cv_url && (
                <div className="space-y-2">
                  <Label>CV/Resume</Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">CV from your profile will be attached</span>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
