'use client'

import React, { useState } from "react";
import { useApplications } from "@/hooks/useApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, Phone, FileText, ExternalLink, Mail } from "lucide-react";

// Define a type for the application data
interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  availability: string | null;
  skills: string[] | null;
  status: string | null;
  cv_url: string | null;
  cover_letter: string | null;
  // Add other fields as necessary
}

export const ApplicationReview = () => {
  const { applications = [], isLoading, updateApplicationStatus } = useApplications();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplications = applications.filter(app =>
      statusFilter === "all" || app.status === statusFilter
  );

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus({ applicationId, status: newStatus });
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "under_review": return "bg-blue-100 text-blue-800";
      case "interview_scheduled": return "bg-purple-100 text-purple-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading applications...</div>;
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Application Reviews</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Applications List</TabsTrigger>
            {selectedApp && <TabsTrigger value="detail">Application Detail</TabsTrigger>}
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No applications found.</p>
                  </CardContent>
                </Card>
            ) : (
                filteredApplications.map((application) => (
                    <Card key={application.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={`https://avatar.vercel.sh/${application.email}.png`} />
                              <AvatarFallback>
                                {`${application.full_name?.[0] || ''}`.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {application.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {application.phone}
                                    </div>
                                )}
                                {application.availability && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Available: {application.availability}
                                    </div>
                                )}
                              </div>

                              {application.skills && application.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {application.skills.slice(0, 3).map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {skill}
                                        </Badge>
                                    ))}
                                    {application.skills.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{application.skills.length - 3} more
                                        </Badge>
                                    )}
                                  </div>
                              )}

                              {application.cv_url && (
                                  <div className="flex items-center gap-1">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <a
                                        href={application.cv_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                      View CV
                                      <ExternalLink className="h-3 w-3 inline ml-1" />
                                    </a>
                                  </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Badge className={getStatusColor(application.status || "pending")}>
                              {application.status?.replace('_', ' ').toUpperCase() || "PENDING"}
                            </Badge>

                            <div className="flex gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedApp(application);
                                  }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))
            )}
          </TabsContent>

          {selectedApp && (
              <TabsContent value="detail">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Applicant Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {selectedApp.full_name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {selectedApp.email}
                          </div>
                          {selectedApp.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {selectedApp.phone}
                              </div>
                          )}
                          {selectedApp.availability && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Available: {selectedApp.availability}
                              </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Application Status</h4>
                        <Select
                            value={selectedApp.status || "pending"}
                            onValueChange={(value) => handleStatusUpdate(selectedApp.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {selectedApp.skills && selectedApp.skills.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedApp.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                            ))}
                          </div>
                        </div>
                    )}

                    {selectedApp.cv_url && (
                        <div>
                          <h4 className="font-semibold mb-3">CV/Resume</h4>
                          <a
                              href={selectedApp.cv_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            View CV/Resume
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                    )}

                    {selectedApp.cover_letter && (
                        <div>
                          <h4 className="font-semibold mb-3">Cover Letter</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">
                              {selectedApp.cover_letter}
                            </p>
                          </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                          variant="outline"
                          onClick={() => setSelectedApp(null)}
                      >
                        Back to List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
          )}
        </Tabs>
      </div>
  );
};
