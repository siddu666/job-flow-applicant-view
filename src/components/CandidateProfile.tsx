
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
import { Upload, Plus, X, User, FileText, Briefcase, MapPin, Calendar, DollarSign, Search, CheckCircle, Edit3, Save } from "lucide-react";
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
  addSkill: (skill: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// Available skills from your skills.json
const availableSkills = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "React", "Angular", "Vue.js", "Node.js",
  "Express.js", "Django", "Flask", "Spring Boot", "ASP.NET", "PHP", "Ruby", "Go", "Rust", "Swift",
  "Kotlin", "HTML5", "CSS3", "SASS", "Tailwind CSS", "Bootstrap", "MongoDB", "PostgreSQL", "MySQL",
  "Redis", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git", "Jenkins", "CI/CD",
  "Machine Learning", "AI", "Data Science", "DevOps", "Agile", "Scrum", "Project Management",
  "UI/UX Design", "Figma", "Adobe Photoshop", "Illustrator", "REST APIs", "GraphQL", "Microservices",
  "TensorFlow", "PyTorch", "React Native", "Flutter", "iOS Development", "Android Development"
];

const SkillsCard: React.FC<SkillsCardProps> = ({ formData, isEditing, removeSkill, addSkill, setFormData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredAvailableSkills = availableSkills.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !formData.skills.includes(skill)
  );

  const handleAddSkillFromSearch = (skill: string) => {
    addSkill(skill);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      addSkill(searchTerm.trim());
      setSearchTerm("");
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/20 rounded-lg">
            <Briefcase className="h-5 w-5" />
          </div>
          Technical Skills
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {formData.skills.length} skills
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isEditing && (
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search and add skills (e.g., React, Python, AWS)..."
                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>
            
            {showSuggestions && filteredAvailableSkills.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredAvailableSkills.slice(0, 10).map((skill) => (
                  <div
                    key={skill}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleAddSkillFromSearch(skill)}
                  >
                    <Plus className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-3">
          {formData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="px-4 py-2 text-sm bg-white border-2 border-blue-200 text-blue-800 hover:bg-blue-50 transition-colors"
                >
                  {skill}
                  {isEditing && (
                    <X
                      className="h-4 w-4 ml-2 cursor-pointer hover:text-red-600"
                      onClick={() => removeSkill(skill)}
                    />
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg mb-2">No skills added yet</p>
              <p className="text-sm">Start by searching and adding your technical skills above</p>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Popular skills to add:</p>
            <div className="flex flex-wrap gap-2">
              {availableSkills.filter(skill => !formData.skills.includes(skill)).slice(0, 8).map((skill) => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSkillFromSearch(skill)}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {skill}
                </Button>
              ))}
            </div>
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
  const [newCertification, setNewCertification] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const swedishCities = [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro",
    "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå"
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
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (profile && isMounted) {
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
  }, [profile, isMounted]);

  const handleSave = async () => {
    if (!user?.id) return;

    await updateProfile.mutateAsync({
      userId: user.id,
      updates: formData,
    });

    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!user?.id || !file) return;

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
      const cv_url = await uploadCV.mutateAsync({ id: user.id, file });
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: {
          ...formData,
          cv_url: cv_url,
        },
      });
      toast.success("CV uploaded successfully!");
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to upload CV. Please try again.");
    }
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
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

  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {formData.first_name || formData.last_name ? 
                    `${formData.first_name} ${formData.last_name}` : 
                    'My Profile'
                  }
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  {formData.current_location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>{formData.current_location}</span>
                    </div>
                  )}
                  {formData.experience_years > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>{formData.experience_years} years experience</span>
                    </div>
                  )}
                  {formData.expected_salary_sek > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      <span>{formData.expected_salary_sek.toLocaleString()} SEK</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {user && user.id !== "dbc5e54a-8ba0-49cb-84c2-57ac5dfb8858" && (
                  <Link href="/jobs">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Career At Justera Group
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  disabled={updateProfile.isPending}
                  className={`px-6 py-3 font-semibold ${
                    isEditing 
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-5 w-5 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-5 w-5" />
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                      disabled={!isEditing}
                      className="border-2 border-gray-200 focus:border-green-500 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                      disabled={!isEditing}
                      className="border-2 border-gray-200 focus:border-green-500 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-gray-50 border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="+46 70 123 45 67"
                      className="border-2 border-gray-200 focus:border-green-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current_location" className="text-sm font-semibold text-gray-700">Current Location</Label>
                  <Select
                    value={formData.current_location}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, current_location: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-lg">
                      <SelectValue placeholder="Select your current city" />
                    </SelectTrigger>
                    <SelectContent>
                      {swedishCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="willing_to_relocate"
                      checked={formData.willing_to_relocate}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, willing_to_relocate: !!checked }))}
                      disabled={!isEditing}
                      className="border-2 border-gray-300"
                    />
                    <Label htmlFor="willing_to_relocate" className="text-sm font-medium">
                      Willing to relocate within Sweden
                    </Label>
                  </div>

                  {formData.willing_to_relocate && (
                    <div className="ml-6 space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Preferred Cities for Relocation</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {swedishCities.map((city) => (
                          <div key={city} className="flex items-center space-x-2">
                            <Checkbox
                              id={`city-${city}`}
                              checked={formData.preferred_cities.includes(city)}
                              onCheckedChange={() => togglePreferredCity(city)}
                              disabled={!isEditing}
                              className="border-2 border-gray-300"
                            />
                            <Label htmlFor={`city-${city}`} className="text-sm">{city}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience_years" className="text-sm font-semibold text-gray-700">Years of Experience</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData((prev) => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      min="0"
                      className="border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected_salary_sek" className="text-sm font-semibold text-gray-700">Expected Salary (SEK/year)</Label>
                    <Input
                      id="expected_salary_sek"
                      type="number"
                      value={formData.expected_salary_sek}
                      onChange={(e) => setFormData((prev) => ({ ...prev, expected_salary_sek: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      min="0"
                      placeholder="500000"
                      className="border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-sm font-semibold text-gray-700">Availability</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, availability: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 rounded-lg">
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
                  <div className="space-y-2">
                    <Label htmlFor="job_seeking_status" className="text-sm font-semibold text-gray-700">Job Seeking Status</Label>
                    <Select
                      value={formData.job_seeking_status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, job_seeking_status: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actively_looking">Actively Looking</SelectItem>
                        <SelectItem value="open_to_offers">Open to Offers</SelectItem>
                        <SelectItem value="not_looking">Not Looking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio / About Me</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself, your interests, and career goals..."
                    className="border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <SkillsCard
              formData={formData}
              isEditing={isEditing}
              removeSkill={removeSkill}
              addSkill={addSkill}
              setFormData={setFormData}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* CV Upload */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  CV / Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {profile?.cv_url && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">CV uploaded successfully</p>
                      <p className="text-xs text-green-600">Ready for applications</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(profile.cv_url!, "_blank")}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      View CV
                    </Button>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Upload your CV</p>
                  <p className="text-sm text-gray-600 mb-4">PDF or Word format, max 10MB</p>
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
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    {uploadCV.isPending ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Professional Links */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  Professional Links
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url" className="text-sm font-semibold text-gray-700">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                    className="border-2 border-gray-200 focus:border-cyan-500 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url" className="text-sm font-semibold text-gray-700">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                    className="border-2 border-gray-200 focus:border-cyan-500 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_url" className="text-sm font-semibold text-gray-700">Portfolio URL</Label>
                  <Input
                    id="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, portfolio_url: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="https://yourportfolio.com"
                    className="border-2 border-gray-200 focus:border-cyan-500 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  Certifications
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {formData.certifications.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {formData.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-2 bg-white border-2 border-yellow-200 text-yellow-800">
                        {cert}
                        {isEditing && (
                          <X
                            className="h-3 w-3 ml-2 cursor-pointer hover:text-red-600"
                            onClick={() => removeCertification(cert)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No certifications added yet</p>
                  </div>
                )}

                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add a certification (e.g., AWS Solutions Architect)"
                      onKeyDown={(e) => e.key === "Enter" && addCertification()}
                      className="border-2 border-gray-200 focus:border-yellow-500 rounded-lg"
                    />
                    <Button 
                      onClick={addCertification} 
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
