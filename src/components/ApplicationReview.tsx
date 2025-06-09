'use client'

import React, { useState } from "react";
import { useAllCandidates } from "@/hooks/useAllCandidates";
import { useApplications } from "@/hooks/useApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  User
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Profile } from "@/interfaces/Profile";
import { useAuth } from "@/contexts/auth-context";
import { generateCVSignedUrl } from "@/hooks/useProfile";
import { toast } from "sonner";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs";
import { Loader2, Briefcase, Building, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  employment_type?: string;
  salary_range?: string;
}

// Define types based on the database schema
interface Application {
  job_id: string;
  applicant_id: string;
  cover_letter?: string | null;
  created_at?: string | null;
  cv_url?: string | null;
  status?: string | null;
  // Extended fields that would come from joins with applicants/users table
  applicant?: {
    id: string;
    full_name?: string;
    email?: string;
    phone?: string;
    availability?: string;
    skills?: string[];
  };
  job?: Job;
}

// Define status type for better type safety
type ApplicationStatus = "pending" | "under_review" | "interview_scheduled" | "accepted" | "rejected";

export const ApplicationReview = () => {
  const { applications = [], isLoading } = useApplications();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');

  const filteredApplications = applications.filter((app: Application) =>
      statusFilter === "all" || app.status === statusFilter
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "under_review": return "bg-blue-100 text-blue-800";
      case "interview_scheduled": return "bg-purple-100 text-purple-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string): string => {
    return status?.replace('_', ' ').toUpperCase() || "PENDING";
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApp(application);
    // Auto-switch to detail tab when viewing details
    const detailTab = document.querySelector('[data-value="detail"]') as HTMLElement;
    if (detailTab) {
      detailTab.click();
    }
  };
  const getInitials = (profile: Profile) => {
    const firstName = profile.first_name?.[0] || '';
    const lastName = profile.last_name?.[0] || '';
    return firstName + lastName || 'U';
  };

  const handleCVAccess = async (cvPath: string, action: 'view' | 'download', candidateName?: string) => {
    if (!cvPath) {
      toast.error("No CV available");
      return;
    }

    try {
      const signedUrl = await generateCVSignedUrl(cvPath);
      if (!signedUrl) {
        toast.error("Unable to access CV. Please try again.");
        return;
      }

      if (action === 'view') {
        window.open(signedUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = signedUrl;
        link.download = candidateName ? `${candidateName}_CV.pdf` : 'CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error accessing CV:', error);
      toast.error("Failed to access CV. Please try again.");
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-pulse text-gray-500">Loading applications...</div>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Application Reviews</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </span>
            <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as ApplicationStatus | 'all')}>
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
                    <p className="text-gray-500">
                      {statusFilter === "all"
                          ? "No applications found."
                          : `No applications with status "${formatStatus(statusFilter)}".`
                      }
                    </p>
                  </CardContent>
                </Card>
            ) : (
                filteredApplications.map((application: Application) => (
                    <Card key={`${application.job_id}-${application.applicant_id}`} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={`https://avatar.vercel.sh/${application.applicant?.email}.png`} />
                              <AvatarFallback>
                                {application.applicant?.full_name?.[0]?.toUpperCase() || 'A'}
                              </AvatarFallback>
                            </Avatar>

                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">
                                {application.applicant?.full_name || 'Anonymous Applicant'}
                              </h3>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {application.applicant?.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {application.applicant.email}
                                    </div>
                                )}
                                {application.applicant?.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {application.applicant.phone}
                                    </div>
                                )}
                                {application.applicant?.availability && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Available: {application.applicant.availability}
                                    </div>
                                )}
                                {application.created_at && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Applied: {new Date(application.created_at).toLocaleDateString()}
                                    </div>
                                )}
                              </div>

                              {application.applicant?.skills && application.applicant.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {application.applicant.skills.slice(0, 3).map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {skill}
                                        </Badge>
                                    ))}
                                    {application.applicant.skills.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{application.applicant.skills.length - 3} more
                                        </Badge>
                                    )}
                                  </div>
                              )}

                              {application.cv_url && (
                                  <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-md">
                                    <FileText className="h-4 w-4 text-green-600" />
                                    <span className="text-green-700 text-xs font-medium">CV Available</span>
                                    <div className="flex gap-1 ml-auto">
                                       <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCVAccess(application.cv_url || '', 'view', application.applicant?.full_name);
                                            }}
                                          >
                                            <ExternalLink className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCVAccess(application.cv_url || '', 'download', application.applicant?.full_name);
                                            }}
                                          >
                                            <FileText className="h-4 w-4" />
                                          </Button>
                                    </div>
                                  </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Badge className={getStatusColor(application.status || "pending")}>
                              {formatStatus(application.status || "pending")}
                            </Badge>

                            <div className="flex gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(application);
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
                    <CardTitle className="flex items-center justify-between">
                      <span>Application Details</span>
                      <Badge className={getStatusColor(selectedApp.status || "pending")}>
                        {formatStatus(selectedApp.status || "pending")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Applicant Information</h4>
                        <div className="space-y-2 text-sm">
                          {selectedApp.applicant?.full_name && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {selectedApp.applicant.full_name}
                              </div>
                          )}
                          {selectedApp.applicant?.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {selectedApp.applicant.email}
                              </div>
                          )}
                          {selectedApp.applicant?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {selectedApp.applicant.phone}
                              </div>
                          )}
                          {selectedApp.applicant?.availability && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Available: {selectedApp.applicant.availability}
                              </div>
                          )}
                          {selectedApp.created_at && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Applied: {new Date(selectedApp.created_at).toLocaleDateString()}
                              </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedApp.applicant?.skills && selectedApp.applicant.skills.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedApp.applicant.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                            ))}
                          </div>
                        </div>
                    )}

                    {selectedApp.cv_url && (
                        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-3 text-blue-800 flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            CV/Resume
                          </h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-blue-700">
                              <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-sm">Resume Attached</span>
                            </div>
                            <div className="flex space-x-2">
                             <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCVAccess(selectedApp.cv_url || '', 'view', selectedApp.applicant?.full_name)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCVAccess(selectedApp.cv_url || '', 'download', selectedApp.applicant?.full_name)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
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

export default ApplicationReview;