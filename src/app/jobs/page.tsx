'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Clock, DollarSign } from 'lucide-react'

export default function JobsPage() {
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Stockholm, Sweden',
      type: 'Full-time',
      salary: '80,000 - 120,000 SEK',
      description: 'We are looking for a senior frontend developer to join our team...',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      postedAt: '2 days ago'
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'InnovateInc',
      location: 'Gothenburg, Sweden',
      type: 'Full-time',
      salary: '75,000 - 110,000 SEK',
      description: 'Join our backend team to build scalable systems...',
      skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      postedAt: '1 week ago'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'Malmö, Sweden',
      type: 'Contract',
      salary: '600 - 800 SEK/hour',
      description: 'Create amazing user experiences for our clients...',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      postedAt: '3 days ago'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Next Job</h1>
        <div className="flex gap-4 mb-6">
          <Input placeholder="Search jobs..." className="max-w-md" />
          <Input placeholder="Location..." className="max-w-sm" />
          <Button>Search</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-blue-600">
                    {job.company}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{job.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.postedAt}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button>Apply Now</Button>
                <Button variant="outline">Save Job</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}