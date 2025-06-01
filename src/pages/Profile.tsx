
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useProfile } from "@/hooks/useProfile";
import { useApplications } from "@/hooks/useApplications";
import { User, Briefcase, FileText, Settings, MapPin, Phone, Mail, Calendar, Star } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: applications, isLoading: isApplicationsLoading } = useApplications({ 
    applicantId: user?.id 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    currentLocation: "",
    experienceYears: "",
    expectedSalarySek: "",
    availability: "",
    jobSeekingStatus: "",
    willingToRelocate: false,
    skills: [] as string[],
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    certifications: [] as string[],
    preferredCities: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        currentLocation: profile.current_location || "",
        experienceYears: profile.experience_years?.toString() || "",
        expectedSalarySek: profile.expected_salary_sek?.toString() || "",
        availability: profile.availability || "",
        jobSeekingStatus: profile.job_seeking_status || "",
        willingToRelocate: profile.willing_to_relocate || false,
        skills: profile.skills || [],
        portfolioUrl: profile.portfolio_url || "",
        linkedinUrl: profile.linkedin_url || "",
        githubUrl: profile.github_url || "",
        certifications: profile.certifications || [],
        preferredCities: profile.preferred_cities || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      // Implementation for saving profile would go here
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your profile information and job applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <p className="text-gray-600">{profile?.current_location || "Location not set"}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{user?.email}</span>
                  </div>
                  
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  
                  {profile?.current_location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{profile.current_location}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Experience:</span>{" "}
                      <span>{profile?.experience_years ? `${profile.experience_years} years` : "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Salary:</span>{" "}
                      <span>{profile?.expected_salary_sek ? `${profile.expected_salary_sek} SEK/year` : "Not specified"}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="w-full"
                  variant={isEditing ? "outline" : "default"}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="+46 70 123 45 67"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentLocation">Current Location</Label>
                    <Input
                      id="currentLocation"
                      value={formData.currentLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentLocation: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Stockholm, Sweden"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="experienceYears">Years of Experience</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedSalarySek">Expected Salary (SEK/year)</Label>
                    <Input
                      id="expectedSalarySek"
                      type="number"
                      value={formData.expectedSalarySek}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedSalarySek: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="600000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">Immediately</SelectItem>
                        <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                        <SelectItem value="1-month">1 month</SelectItem>
                        <SelectItem value="2-months">2-3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.skills.length > 0 && (
                  <div>
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isApplicationsLoading ? (
                  <p className="text-gray-500">Loading applications...</p>
                ) : applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{application.job.title}</h3>
                          <Badge variant={
                            application.status === 'accepted' ? 'default' :
                            application.status === 'rejected' ? 'destructive' :
                            application.status === 'interview_scheduled' ? 'secondary' :
                            'outline'
                          }>
                            {application.status || 'pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Applied on {application.created_at ? format(new Date(application.created_at), 'PPP') : 'Unknown date'}
                        </p>
                        <p className="text-sm text-gray-700">{application.job.location}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No applications yet. <a href="/jobs" className="text-blue-600 hover:underline">Browse jobs</a> to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
