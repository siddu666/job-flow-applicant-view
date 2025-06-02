
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useJobs } from '@/hooks/useJobs'
import { useApplications } from '@/hooks/useApplications'
import { useProfile } from '@/hooks/useProfile'
import { JobPostForm } from '@/components/JobPostForm'
import { Briefcase, Users, FileText, Plus, Eye, Edit, Trash } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { profile, isLoading: profileLoading } = useProfile()
  const { jobs, createJob, deleteJob, isLoading: jobsLoading } = useJobs()
  const { useAllApplications } = useApplications()
  const { data: applications = [], isLoading: applicationsLoading } = useAllApplications()
  
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    if (!loading && !profileLoading) {
      if (!user) {
        router.push('/auth')
        return
      }
      
      if (profile?.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.')
        router.push('/profile')
        return
      }
    }
  }, [user, profile, loading, profileLoading, router])

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return null
  }

  const handleDeleteJob = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewing': return 'bg-blue-100 text-blue-800'
      case 'interviewed': return 'bg-purple-100 text-purple-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage jobs, applications, and candidates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="jobs">Job Management</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Job Postings</h2>
            <Button onClick={() => setShowJobForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </div>

          {showJobForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Job</CardTitle>
              </CardHeader>
              <CardContent>
                <JobPostForm 
                  onSubmit={(jobData) => {
                    createJob({
                      ...jobData,
                      posted_by: user.id,
                    })
                    setShowJobForm(false)
                  }}
                  onCancel={() => setShowJobForm(false)}
                />
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {jobsLoading ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No jobs posted yet</div>
            ) : (
              jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>
                          {job.company} • {job.location} • {job.type}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{job.description.substring(0, 200)}...</p>
                    {job.skills && (
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <h2 className="text-2xl font-semibold">Applications</h2>
          
          <div className="space-y-4">
            {applicationsLoading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No applications received yet</div>
            ) : (
              applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {application.profiles?.first_name} {application.profiles?.last_name}
                        </CardTitle>
                        <CardDescription>
                          Applied for: {application.jobs?.title} at {application.jobs?.company}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Email:</strong> {application.profiles?.email}</p>
                      <p><strong>Phone:</strong> {application.profiles?.phone}</p>
                      <p><strong>Applied:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>
                      {application.cover_letter && (
                        <div>
                          <strong>Cover Letter:</strong>
                          <p className="text-sm text-gray-600 mt-1">{application.cover_letter}</p>
                        </div>
                      )}
                      {application.cv_url && (
                        <div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={application.cv_url} target="_blank" rel="noopener noreferrer">
                              View CV
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
