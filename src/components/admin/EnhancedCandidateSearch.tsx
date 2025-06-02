'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Filter, Download, User, MapPin, Briefcase, Calendar } from 'lucide-react'
import { useAllCandidates, useCandidateStats, CandidateSearchFilters } from '@/hooks/useAllCandidates'

export default function EnhancedCandidateSearch() {
  const [filters, setFilters] = useState<CandidateSearchFilters>({})
  const [searchTerm, setSearchTerm] = useState('')

  const { data: candidates = [], isLoading } = useAllCandidates(filters)
  const { data: stats } = useCandidateStats()

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, searchTerm }))
  }

  const handleExperienceChange = (value: string) => {
    setFilters(prev => ({ ...prev, experienceLevel: value }))
  }

  // Location and job type filtering will be implemented later

  const handleVisaStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, visaStatus: value }))
  }

  const handleAvailabilityChange = (value: string) => {
    setFilters(prev => ({ ...prev, availability: value }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  const exportCandidates = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Location', 'Experience', 'Visa Status', 'Availability', 'Skills'].join(','),
      ...candidates.map(candidate => [
        `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim(),
        candidate.email,
        candidate.phone || '',
        candidate.current_location || '',
        candidate.experience_years?.toString() || '',
        candidate.visa_status || '',
        candidate.availability || '',
        candidate.skills?.join('; ') || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `candidates-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading candidates...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Candidates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search by name, email, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button className="w-full" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            <Select onValueChange={handleExperienceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Experience</SelectItem>
                <SelectItem value="0">Entry Level (0-1 years)</SelectItem>
                <SelectItem value="2">Junior (2-3 years)</SelectItem>
                <SelectItem value="4">Mid-level (4-6 years)</SelectItem>
                <SelectItem value="7">Senior (7+ years)</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={handleVisaStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Visa Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Status</SelectItem>
                {stats && Object.keys(stats.byVisaStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {status} ({stats.byVisaStatus[status]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleAvailabilityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Availability</SelectItem>
                {stats && Object.keys(stats.byAvailability).map(availability => (
                  <SelectItem key={availability} value={availability}>
                    {availability} ({stats.byAvailability[availability]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
            <Button variant="outline" onClick={exportCandidates}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            Showing {candidates.length} candidates {stats && `of ${stats.total} total`}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${candidate.first_name} ${candidate.last_name}`} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {candidate.first_name} {candidate.last_name}
                    </h3>
                    <div className="flex gap-2">
                      {candidate.visa_status && (
                        <Badge variant="secondary">{candidate.visa_status}</Badge>
                      )}
                      {candidate.availability && (
                        <Badge variant="outline">{candidate.availability}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {candidate.email}
                    </div>
                    {candidate.current_location && (
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {candidate.current_location}
                      </div>
                    )}
                    {candidate.experience_years !== null && (
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4" />
                        {candidate.experience_years} years experience
                      </div>
                    )}
                  </div>

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    Joined {candidate.created_at}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {candidates.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No candidates found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}