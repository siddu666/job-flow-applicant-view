'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminCandidates } from '@/components/AdminCandidates'
import { EnhancedCandidateSearch } from '@/components/admin/EnhancedCandidateSearch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function AdminPageContent() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="search">Advanced Search</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-6">
            <AdminCandidates />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <EnhancedCandidateSearch />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">--</p>
                  <p className="text-gray-600">Active profiles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Applications This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">--</p>
                  <p className="text-gray-600">New applications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">--</p>
                  <p className="text-gray-600">Open positions</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPageContent />
    </ProtectedRoute>
  )
}