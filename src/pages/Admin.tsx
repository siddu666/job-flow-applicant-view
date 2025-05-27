import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobPostForm from "@/components/JobPostForm";
import ApplicationReview from "@/components/ApplicationReview.tsx";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation and other existing code */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">IT Recruitment Dashboard</h1>
            <p className="text-gray-600">Manage IT positions and applications for Justera Group AB</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="post-job">Post IT Position</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              {/* Overview content goes here */}
            </TabsContent>

            {/* Post Job Tab */}
            <TabsContent value="post-job">
              <JobPostForm />
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <ApplicationReview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default Admin;
