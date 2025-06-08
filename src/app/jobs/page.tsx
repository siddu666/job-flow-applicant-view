'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MapPin, Clock, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useAllJobs } from '@/hooks/useJobs'

export default function JobsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience_level: '',
    page: 1,
    limit: 10,
  })

  const { data: jobsData, isLoading, error } = useAllJobs()

  const handleApply = (jobId:any) => {
    if (!user) {
      // Redirect to sign-in page if user is not authenticated
      router.push('/signin')
    } else {
      // Proceed to job application if user is authenticated
      router.push(`/apply?job_id=${jobId}`)
    }
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Jobs</h1>
          <p className="text-gray-600">Find your perfect job opportunity</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                      placeholder="Search jobs..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                      className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value, page: 1 }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Type</label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value, page: 1 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level</label>
                <Select value={filters.experience_level} onValueChange={(value) => setFilters(prev => ({ ...prev, experience_level: value, page: 1 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-levels">All levels</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {isLoading ? (
            <div className="text-center py-8">Loading jobs...</div>
        ) : error ? (
            <div className="text-center py-8 text-red-600">Error loading jobs: {error.message}</div>
        ) : (
            <div className="space-y-4">
              {jobsData?.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                            <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                              {job.type}
                      </span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" asChild>
                            <Link href={`/jobs/${job.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button onClick={() => handleApply(job.id)}>
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{job.description}</p>

                      {job.experience_level && (
                          <div className="mb-3">
                            <Badge variant="outline">{job.experience_level}</Badge>
                          </div>
                      )}

                      {job.skills && job.skills.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Required Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                      )}
                    </CardContent>
                  </Card>
              ))}

              {jobsData?.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No jobs found matching your criteria.</p>
                  </div>
              )}
            </div>
        )}
      </div>
  )
}
