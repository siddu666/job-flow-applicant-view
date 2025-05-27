import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Users, Eye, Download } from "lucide-react";
import JobPostForm from "@/components/JobPostForm";
import ApplicationReview from "@/components/ApplicationReview";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { signOut } = useAuth();

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
      location: "Stockholm",
      status: "Active",
      applications: 15,
      postedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Cloud Solutions Architect",
      location: "Gothenburg",
      status: "Active",
      applications: 8,
      postedDate: "2024-01-12",
    },
    {
      id: 3,
      title: "DevOps Engineer",
      location: "Malmö",
      status: "Closed",
      applications: 22,
      postedDate: "2024-01-10",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      jobTitle: "Senior Frontend Developer",
      applicantName: "Erik Andersson",
      email: "erik.andersson@email.com",
      appliedDate: "2024-01-16",
      status: "Pending",
      skills: ["React", "TypeScript", "Node.js"],
    },
    {
      id: 2,
      jobTitle: "Cloud Solutions Architect",
      applicantName: "Anna Lindström",
      email: "anna.lindstrom@email.com",
      appliedDate: "2024-01-15",
      status: "Reviewed",
      skills: ["AWS", "Azure", "Docker"],
    },
    {
      id: 3,
      jobTitle: "DevOps Engineer",
      applicantName: "Lars Johansson",
      email: "lars.johansson@email.com",
      appliedDate: "2024-01-14",
      status: "Pending",
      skills: ["Kubernetes", "CI/CD", "Python"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">Justera Group AB</span>
                <p className="text-xs text-gray-600">Admin Portal</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/jobs">
                <Button variant="outline">View Jobs</Button>
              </Link>
              <Button variant="ghost" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

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
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total IT Positions</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                    </div>
                    <Building className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active IT Positions</p>
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
                      <p className="text-sm font-medium text-gray-600">Total IT Applications</p>
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
                      <p className="text-sm font-medium text-gray-600">Pending IT Reviews</p>
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
                  <CardTitle>Recent IT Job Postings</CardTitle>
                  <CardDescription>Latest IT positions posted at Justera Group AB</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.location}, Sweden</p>
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
                  <CardDescription>Latest IT job applications received</CardDescription>
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
                <CardTitle>IT Recruitment Analytics & Reports</CardTitle>
                <CardDescription>
                  Detailed analytics for IT positions and recruitment metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Advanced IT recruitment analytics dashboard will be available soon.</p>
                  <Button variant="outline" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Generate IT Recruitment Report
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
