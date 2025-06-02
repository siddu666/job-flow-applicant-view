'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { useCreateJob } from '@/hooks/useJobs'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

interface JobPostFormProps {
  onSubmit?: (jobData: any) => void
  onCancel?: () => void
  onClose?: () => void
  initialData?: any
}

export function JobPostForm({ onSubmit, onCancel, onClose, initialData }: JobPostFormProps) {
  const { user } = useAuth()
  const createJobMutation = useCreateJob()

  const [formData, setFormData] = useState<{
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    requirements: string;
    skills: string[];
    salary_min?: number;
    salary_max?: number;
    experience_level?: string
  }>({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    experience_level: initialData?.experience_level || '',
    skills: initialData?.skills || [],
  })

  const [skillInput, setSkillInput] = useState('')

  const swedishCities = [
    'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro',
    'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå',
    'Gävle', 'Borås', 'Eskilstuna', 'Karlstad', 'Täby', 'Remote (Sweden)'
  ]

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Junior (1-3 years)',
    'Mid Level (3-5 years)',
    'Senior (5-8 years)',
    'Lead (8+ years)',
    'Principal (10+ years)'
  ]

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Consultant',
    'Internship'
  ]

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    }
    setSkillInput('')
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('You must be logged in to post a job')
      return
    }

    if (!formData.title || !formData.company || !formData.description || !formData.requirements || !formData.location || !formData.type) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (onSubmit) {
        onSubmit({
          ...formData,
          posted_by: user.id,
        })
      } else {
        await createJobMutation.mutateAsync({
          ...formData,
          posted_by: user.id,
        })
        toast.success('Job posted successfully!')
      }

      const closeHandler = onClose || onCancel
      if (closeHandler) closeHandler()
    } catch (error) {
      console.error('Error posting job:', error)
      toast.error('Failed to post job. Please try again.')
    }
  }

  const closeHandler = onClose || onCancel

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g. Senior Software Developer"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Select value={formData.location} onValueChange={(value) => handleSelectChange('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select location in Sweden" />
            </SelectTrigger>
            <SelectContent>
              {swedishCities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Employment Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              {employmentTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary_range">Salary Range</Label>
          <Input
            id="salary_range"
            value={formData.salary_range as string}
            onChange={(e) => handleInputChange('salary_range', e.target.value)}
            placeholder="e.g., 50,000 - 70,000 SEK"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience_level">Experience Level</Label>
          <Select value={formData.experience_level} onValueChange={(value) => handleSelectChange('experience_level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Skills</Label>
        <div className="flex space-x-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput.trim()))}
          />
          <Button type="button" onClick={() => addSkill(skillInput.trim())}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the role, responsibilities, and what makes this position exciting..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements *</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => handleInputChange('requirements', e.target.value)}
          placeholder="List the required qualifications, experience, and skills..."
          rows={4}
          required
        />
      </div>

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={createJobMutation.isPending}
        >
          {createJobMutation.isPending ? 'Posting...' : (initialData ? 'Update Job' : 'Post Job')}
        </Button>
        {closeHandler && (
          <Button type="button" variant="outline" onClick={closeHandler} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default JobPostForm