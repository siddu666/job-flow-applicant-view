
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Plus, Users, Eye, Download } from "lucide-react";
import JobPostForm from "@/components/JobPostForm";
import ApplicationReview from "@/components/ApplicationReview";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 156,
    pendingReviews: 23,
  };

  const recentJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      status: "Active",
      applications: 15,
      postedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Design Studio",
      status: "Active",
      applications: 8,
      postedDate: "2024-01-12",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataFlow Systems",
      status: "Closed",
      applications: 22,
      postedDate: "2024-01-10",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      jobTitle: "Senior Frontend Developer",
      applicantName: "John Doe",
      email: "john.doe@email.com",
      appliedDate: "2024-01-16",
      status: "Pending",
      skills: ["React", "TypeScript", "Node.js"],
    },
    {
      id: 2,
      jobTitle: "UX/UI Designer",
      applicantName: "Jane Smith",
      email: "jane.smith@email.com",
      appliedDate: "2024-01-15",
      status: "Reviewed",
      skills: ["Figma", "Adobe XD", "User Research"],
    },
    {
      id: 3,
      jobTitle: "Backend Engineer",
      applicantName: "Mike Johnson",
      email: "mike.johnson@email.com",
      appliedDate: "2024-01-14",
      status: "Pending",
      skills: ["Python", "PostgreSQL", "AWS"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CareerHub Admin</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/jobs">
                <Button variant="outline">View Jobs</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="post-job">Post Job</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                      <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
                    </div>
                    <Plus className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.pendingReviews}</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs and Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Postings</CardTitle>
                  <CardDescription>Latest jobs posted on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                          <p className="text-xs text-gray-500">Posted: {job.postedDate}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                            {job.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{job.applications} applications</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest job applications received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{app.applicantName}</h3>
                          <p className="text-sm text-gray-600">{app.jobTitle}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {app.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{app.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={app.status === "Pending" ? "outline" : "default"}>
                            {app.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{app.appliedDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Post Job Tab */}
          <TabsContent value="post-job">
            <JobPostForm />
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <ApplicationReview />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Detailed analytics and reporting features coming soon...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Advanced analytics dashboard will be available soon.</p>
                  <Button variant="outline" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
