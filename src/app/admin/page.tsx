"use client";

import { useState } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminCandidates } from "@/components/admin/AdminCandidates";
import EnhancedCandidateSearch from "@/components/admin/EnhancedCandidateSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobManagement from "@/components/admin/JobManagement";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component for loading states

function AdminPageContent() {
  const [activeTab, setActiveTab] = useState("candidates");
  const [isLoading, setIsLoading] = useState(true); // Simulate loading state

  // Simulate data fetching
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  });

  return (
      <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">Admin Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex justify-start bg-indigo-50 p-1 rounded-lg mb-6">
              <TabsTrigger
                  value="candidates"
                  className="px-4 py-2 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Candidates
              </TabsTrigger>
              <TabsTrigger
                  value="search"
                  className="px-4 py-2 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Advanced Search
              </TabsTrigger>
              <TabsTrigger
                  value="jobs"
                  className="px-4 py-2 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Job Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="candidates" className="space-y-6">
              <Card className="shadow-lg border border-indigo-100">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-indigo-700">Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminCandidates />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="search" className="space-y-6">
              <Card className="shadow-lg border border-indigo-100">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-indigo-700">Advanced Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedCandidateSearch />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-lg border border-indigo-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-indigo-700">Total Candidates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-8 w-20" />
                    ) : (
                        <p className="text-3xl font-bold text-indigo-800">0</p>
                    )}
                    <p className="text-gray-600">Active profiles</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border border-indigo-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-indigo-700">Applications This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-8 w-20" />
                    ) : (
                        <p className="text-3xl font-bold text-indigo-800">0</p>
                    )}
                    <p className="text-gray-600">New applications</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border border-indigo-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-indigo-700">Active Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-8 w-20" />
                    ) : (
                        <p className="text-3xl font-bold text-indigo-800">0</p>
                    )}
                    <p className="text-gray-600">Open positions</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <Card className="shadow-lg border border-indigo-100">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-indigo-700">Job Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <JobManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}

export default function AdminPage() {
  return (
      <ProtectedRoute requiredRole="admin">
        <AdminPageContent />
      </ProtectedRoute>
  );
}
