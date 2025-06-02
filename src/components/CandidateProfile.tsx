import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useProfile, useUpdateProfile, useUploadCV } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Plus, X, User, FileText, Briefcase } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface FormData {
  first_name: string;
  last_name: string;
  phone: string;
  current_location: string;
  willing_to_relocate: boolean;
  preferred_cities: string[];
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  bio: string;
  skills: string[];
  certifications: string[];
  experience_years: number;
  expected_salary_sek: number;
  availability: string;
  job_seeking_status: string;
}

interface SkillsCardProps {
  formData: FormData;
  isEditing: boolean;
  removeSkill: (skillToRemove: string) => void;
  addSkill: () => void;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ formData, isEditing, removeSkill, addSkill }) => {
  const [newSkill, setNewSkill] = useState("");
  const [searchSkill, setSearchSkill] = useState("");

  const filteredSkills = formData.skills.filter((skill) =>
      skill.toLowerCase().includes(searchSkill.toLowerCase())
  );

  const MAX_SKILLS_DISPLAYED = 100;
  const skillsToShow = filteredSkills.slice(0, MAX_SKILLS_DISPLAYED);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkill();
    }
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
              type="text"
              placeholder="Search skills..."
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              className="mb-2 px-2 py-1 border rounded"
          />
          <div className="flex flex-wrap gap-2 max-h-48 overflow-auto">
            {skillsToShow.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                  {isEditing && (
                      <X
                          className="h-3 w-3 ml-2 cursor-pointer"
                          onClick={() => removeSkill(skill)}
                      />
                  )}
                </Badge>
            ))}
            {filteredSkills.length > MAX_SKILLS_DISPLAYED && (
                <div className="w-full text-center text-sm text-gray-500 mt-1">
                  Showing {MAX_SKILLS_DISPLAYED} of {filteredSkills.length} skills
                </div>
            )}
          </div>
          {isEditing && (
              <div className="flex gap-2 mt-2">
                <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a technical skill (e.g., React, Python, AWS)"
                    onKeyDown={handleKeyDown}
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
          )}
        </CardContent>
      </Card>
  );
};

const CandidateProfile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();
  const uploadCV = useUploadCV();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const swedishCities = [
    "Stockholm",
    "Gothenburg",
    "Malmö",
    "Uppsala",
    "Västerås",
    "Örebro",
    "Linköping",
    "Helsingborg",
    "Jönköping",
    "Norrköping",
    "Lund",
    "Umeå",
  ];

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    phone: "",
    current_location: "",
    willing_to_relocate: false,
    preferred_cities: [],
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    bio: "",
    skills: [],
    certifications: [],
    experience_years: 0,
    expected_salary_sek: 0,
    availability: "",
    job_seeking_status: "actively_looking",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        current_location: profile.current_location || "",
        willing_to_relocate: profile.willing_to_relocate || false,
        preferred_cities: profile.preferred_cities || [],
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        portfolio_url: profile.portfolio_url || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        certifications: profile.certifications || [],
        experience_years: profile.experience_years || 0,
        expected_salary_sek: profile.expected_salary_sek || 0,
        availability: profile.availability || "",
        job_seeking_status: profile.job_seeking_status || "actively_looking",
      });

      if (!profile.phone && !profile.current_location && !profile.skills?.length) {
        setIsEditing(true);
      }
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) return;

    await updateProfile.mutateAsync({
      id: user.id,
      updates: formData,
    });
    setIsEditing(false);
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!user?.id || !file) return;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF and Word documents are allowed");
        return;
      }

      try {
        const url = await uploadCV.mutateAsync({ id: user.id, file });

        await updateProfile.mutateAsync({
          id: user.id,
          updates: {
            ...formData,
            cv_url: url,
          },
        });
      } catch (error) {
        console.error("Error uploading CV:", error);
        toast.error("Failed to upload CV. Please try again.");
      }
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addCertification = () => {
    if (
        newCertification.trim() &&
        !formData.certifications.includes(newCertification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert !== certToRemove),
    }));
  };

  const togglePreferredCity = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      preferred_cities: prev.preferred_cities.includes(city)
          ? prev.preferred_cities.filter((c) => c !== city)
          : [...prev.preferred_cities, city],
    }));
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          {user && user.id !== "dbc5e54a-8ba0-49cb-84c2-57ac5dfb8858" && (
              <Link href="/jobs">
                <Button>Career At Justera Group</Button>
              </Link>
          )}
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={updateProfile.isPending}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    disabled={!isEditing}
                    placeholder="+46 70 123 45 67"
                />
              </div>
              <div>
                <Label htmlFor="current_location">Current Location</Label>
                <Select
                    value={formData.current_location}
                    onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, current_location: value }))
                    }
                    disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current city" />
                  </SelectTrigger>
                  <SelectContent>
                    {swedishCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                    id="willing_to_relocate"
                    checked={formData.willing_to_relocate}
                    onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, willing_to_relocate: !!checked }))
                    }
                    disabled={!isEditing}
                />
                <Label htmlFor="willing_to_relocate">
                  Willing to relocate within Sweden
                </Label>
              </div>

              {formData.willing_to_relocate && (
                  <div>
                    <Label>Preferred Cities for Relocation</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {swedishCities.map((city) => (
                          <div key={city} className="flex items-center space-x-2">
                            <Checkbox
                                id={`city-${city}`}
                                checked={formData.preferred_cities.includes(city)}
                                onCheckedChange={() => togglePreferredCity(city)}
                                disabled={!isEditing}
                            />
                            <Label htmlFor={`city-${city}`} className="text-sm">
                              {city}
                            </Label>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
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
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          experience_years: parseInt(e.target.value) || 0,
                        }))
                    }
                    disabled={!isEditing}
                    min="0"
                />
              </div>
              <div>
                <Label htmlFor="expected_salary_sek">Expected Salary (SEK/year)</Label>
                <Input
                    id="expected_salary_sek"
                    type="number"
                    value={formData.expected_salary_sek}
                    onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expected_salary_sek: parseInt(e.target.value) || 0,
                        }))
                    }
                    disabled={!isEditing}
                    min="0"
                    placeholder="500000"
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                    value={formData.availability}
                    onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, availability: value }))
                    }
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actively_looking">Actively Looking</SelectItem>
                  <SelectItem value="open_to_offers">Open to Offers</SelectItem>
                  <SelectItem value="not_looking">Not Looking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bio">Bio / About Me</Label>
              <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell us about yourself, your interests, and career goals..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <SkillsCard
            formData={formData}
            isEditing={isEditing}
            removeSkill={removeSkill}
            addSkill={addSkill}
        />

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {cert}
                    {isEditing && (
                        <X
                            className="h-3 w-3 ml-2 cursor-pointer"
                            onClick={() => removeCertification(cert)}
                        />
                    )}
                  </Badge>
              ))}
            </div>

            {isEditing && (
                <div className="flex gap-2">
                  <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add a certification (e.g., AWS Solutions Architect)"
                      onKeyDown={(e) => e.key === "Enter" && addCertification()}
                  />
                  <Button onClick={addCertification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Links */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, linkedin_url: e.target.value }))
                    }
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, github_url: e.target.value }))
                    }
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                />
              </div>
              <div>
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                    id="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, portfolio_url: e.target.value }))
                    }
                    disabled={!isEditing}
                    placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CV Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CV / Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.cv_url && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">CV uploaded successfully</span>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(profile.cv_url!, "_blank")}
                  >
                    View CV
                  </Button>
                </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Upload your CV (PDF or Word format, max 10MB)
              </p>
              <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
              />
              <Button
                  variant="outline"
                  onClick={() => document.getElementById("cv-upload")?.click()}
                  disabled={uploadCV.isPending}
              >
                {uploadCV.isPending ? "Uploading..." : "Choose File"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default CandidateProfile;