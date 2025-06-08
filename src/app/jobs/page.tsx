
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Briefcase, MapPin, Search, Filter, Calendar } from 'lucide-react'
import { useJobs } from '@/hooks/useJobs'
import Loading from '@/components/Loading'

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  
  const { jobs: jobsData, loading, error, searchJobs } = useJobs()

  useEffect(() => {
    // Load initial jobs
    searchJobs({})
  }, [searchJobs])

  const handleSearch = () => {
    searchJobs({
      title: searchTerm,
      location: locationFilter,
      experience_level: experienceFilter,
      job_type: typeFilter
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setExperienceFilter('')
    setTypeFilter('')
    searchJobs({})
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Career Opportunity
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exciting career opportunities with leading companies across Sweden and beyond
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Search & Filter Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search by job title, company, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full"
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="Stockholm">Stockholm</SelectItem>
                  <SelectItem value="Gothenburg">Gothenburg</SelectItem>
                  <SelectItem value="Malmö">Malmö</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>

              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid-level">Mid-level</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{jobsData?.length || 0}</span> job opportunities
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">Error loading jobs: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Jobs Grid */}
        {jobsData && jobsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsData.map((job) => (
              <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {job.title}
                      </CardTitle>
                    </div>
                    <Briefcase className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Location and Type */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location || 'Location TBD'}</span>
                    </div>
                  </div>

                  {/* Experience Level */}
                  {job.experience_level && (
                    <div className="mb-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {job.experience_level}
                      </Badge>
                    </div>
                  )}

                  {/* Description */}
                  {job.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {job.description}
                    </p>
                  )}

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Posted Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 border-t pt-3">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>

                  {/* Apply Button */}
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:scale-105 transition-transform">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Jobs Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || locationFilter || experienceFilter || typeFilter
                  ? 'No jobs match your current search criteria. Try adjusting your filters.'
                  : 'No job opportunities are currently available. Check back soon for new openings!'}
              </p>
              {(searchTerm || locationFilter || experienceFilter || typeFilter) && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
