
'use client'

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import JobRecommendations from "@/components/JobRecommendations";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    current_location: "",
    bio: "",
    experience_years: 0,
    job_seeking_status: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        current_location: profile.current_location || "",
        bio: profile.bio || "",
        experience_years: profile.experience_years || 0,
        job_seeking_status: profile.job_seeking_status || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        id: user!.id,
        updates: formData,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        current_location: profile.current_location || "",
        bio: profile.bio || "",
        experience_years: profile.experience_years || 0,
        job_seeking_status: profile.job_seeking_status || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Justera Group AB
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                  Jobs
                </Link>
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                    Admin
                  </Link>
                )}
                <Button onClick={signOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, first_name: e.target.value }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, last_name: e.target.value }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="current_location">Location</Label>
                    <Input
                      id="current_location"
                      value={formData.current_location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, current_location: e.target.value }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="job_seeking_status">Job Seeking Status</Label>
                    <Select
                      value={formData.job_seeking_status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, job_seeking_status: value }))
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actively_looking">Actively Looking</SelectItem>
                        <SelectItem value="open_to_opportunities">Open to Opportunities</SelectItem>
                        <SelectItem value="not_looking">Not Looking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Recommendations */}
            <div className="lg:col-span-2">
              <JobRecommendations />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
