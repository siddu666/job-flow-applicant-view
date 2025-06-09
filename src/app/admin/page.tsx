
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/useProfile';
import {ProtectedRoute} from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Target, BarChart3 } from 'lucide-react';
import { Suspense } from 'react';
import AdminCandidates from '@/components/admin/AdminCandidates';
import JobManagement from '@/components/admin/JobManagement';
import JobCandidateRecommendations from '@/components/admin/JobCandidateRecommendations';
import ApplicationReview from '@/components/ApplicationReview';

function AdminDashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.first_name || 'Admin'}</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Loading...</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Loading...</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Smart</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="jobs">Job Management</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-6">
            <Suspense fallback={<div>Loading candidates...</div>}>
              <AdminCandidates />
            </Suspense>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Suspense fallback={<div>Loading job management...</div>}>
              <JobManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Suspense fallback={<div>Loading recommendations...</div>}>
              <JobCandidateRecommendations />
            </Suspense>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Suspense fallback={<div>Loading applications...</div>}>
              <ApplicationReview />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
