
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Briefcase, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  UserCheck,
} from 'lucide-react'
import { useAllCandidates } from '@/hooks/useAllCandidates'
import { useJobs } from '@/hooks/useJobs'
import Loading from '@/components/Loading'
import { Profile } from '@/interfaces/Profile'

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCandidates, setFilteredCandidates] = useState<Profile[]>([])
  
  const { data: candidates, isLoading: candidatesLoading, error: candidatesError } = useAllCandidates()
  const { jobs, loading: jobsLoading } = useJobs()

  useEffect(() => {
    if (candidates && Array.isArray(candidates)) {
      const filtered = candidates.filter(candidate => {
        const searchLower = searchTerm.toLowerCase()
        return (
          candidate.first_name?.toLowerCase().includes(searchLower) ||
          candidate.last_name?.toLowerCase().includes(searchLower) ||
          candidate.email?.toLowerCase().includes(searchLower) ||
          candidate.skills?.some(skill => skill.toLowerCase().includes(searchLower))
        )
      })
      setFilteredCandidates(filtered)
    }
  }, [candidates, searchTerm])

  const getFullName = (candidate: Profile) => {
    return `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Unknown Name'
  }

  const getInitials = (candidate: Profile) => {
    const firstName = candidate.first_name || ''
    const lastName = candidate.last_name || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (candidatesLoading || jobsLoading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage candidates, jobs, and applications</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Candidates</p>
                  <p className="text-3xl font-bold text-blue-600">{candidates?.length || 0}</p>
                </div>
                <Users className="h-12 w-12 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-green-600">{jobs?.length || 0}</p>
                </div>
                <Briefcase className="h-12 w-12 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified Profiles</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {candidates?.filter(c => c.first_name && c.last_name && c.email).length || 0}
                  </p>
                </div>
                <UserCheck className="h-12 w-12 text-purple-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {candidates?.filter(c => {
                      if (!c.created_at) return false
                      const created = new Date(c.created_at)
                      const now = new Date()
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                    }).length || 0}
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Candidates Tab */}
          <TabsContent value="candidates">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Candidate Management
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {candidatesError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    Error loading candidates: {String(candidatesError)}
                  </div>
                )}
                
                {filteredCandidates && filteredCandidates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCandidates.map((candidate) => (
                      <Card key={candidate.email} className="group hover:shadow-lg transition-all duration-300 border border-gray-100">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                {getInitials(candidate)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate text-gray-900">
                                {getFullName(candidate)}
                              </h3>

                              <div className="space-y-1 text-sm text-gray-600">
                                {candidate.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{candidate.email}</span>
                                  </div>
                                )}

                                {candidate.current_location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    <span>{candidate.current_location}</span>
                                  </div>
                                )}

                                {candidate.experience_years && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    <span>{candidate.experience_years} years experience</span>
                                  </div>
                                )}

                                {candidate.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    <span>{candidate.phone}</span>
                                  </div>
                                )}
                              </div>

                              {/* Skills */}
                              {candidate.skills && candidate.skills.length > 0 && (
                                <div className="mt-3">
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.skills.slice(0, 3).map((skill, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {candidate.skills.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{candidate.skills.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Salary Expectation */}
                              {candidate.expected_salary_sek && (
                                <div className="mt-2 text-sm text-green-600 font-medium">
                                  {candidate.expected_salary_sek.toLocaleString()} SEK/month
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-4">
                                <div className="text-xs text-gray-500">
                                  {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : 'No date'}
                                </div>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Candidates Found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'No candidates match your search criteria.' : 'No candidates have registered yet.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  Job Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobs && jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <Card key={job.id} className="border border-gray-100 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {job.title}
                              </h3>
                            </div>
                            <Briefcase className="h-6 w-6 text-green-500" />
                          </div>

                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            {job.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{job.location}</span>
                              </div>
                            )}
                          </div>

                          {job.skills && job.skills.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {job.skills.slice(0, 4).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {job.skills.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{job.skills.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                            </div>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Jobs Posted</h3>
                    <p className="text-gray-500">No job opportunities have been posted yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Candidate Registration Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="font-bold text-blue-600">
                        {candidates?.filter(c => {
                          if (!c.created_at) return false
                          const created = new Date(c.created_at)
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return created >= weekAgo
                        }).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-bold text-green-600">
                        {candidates?.filter(c => {
                          if (!c.created_at) return false
                          const created = new Date(c.created_at)
                          const now = new Date()
                          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                        }).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="font-bold text-purple-600">{candidates?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Complete Profiles</span>
                      <span className="font-bold text-green-600">
                        {candidates?.filter(c => 
                          c.first_name && c.last_name && c.email && c.current_location && c.skills?.length
                        ).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">With Skills</span>
                      <span className="font-bold text-blue-600">
                        {candidates?.filter(c => c.skills && c.skills.length > 0).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">With LinkedIn</span>
                      <span className="font-bold text-purple-600">
                        {candidates?.filter(c => c.linkedin_url).length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
