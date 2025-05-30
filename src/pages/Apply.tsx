import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Upload, MapPin, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const Apply = () => {
  const { jobId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  console.log(user)

  const { data: profile } = useProfile(user.id);
  console.log(profile)

  // Updated formData to use strings for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    experience: "", // Changed to string
    expectedSalary: "", // Changed to string
    availability: "",
    coverLetter: "",
    skills: [] as string[],
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  // Pre-populate form with profile data
  useEffect(() => {
    if (profile && user) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: user.email || "",
        phone: profile.phone || "",
        location: profile.current_location || "",
        experience: profile.experience_years?.toString() || "",
        expectedSalary: profile.expected_salary_sek?.toString() || "",
        availability: profile.availability || "",
        coverLetter: "",
        skills: profile.skills || [],
        portfolioUrl: profile.portfolio_url || "",
        linkedinUrl: profile.linkedin_url || "",
        githubUrl: profile.github_url || "",
      });
    }
  }, [profile, user]);

  // Mock job data - in real app, this would come from API
  const job = {
    id: jobId,
    title: "Senior Frontend Developer",
    company: "Justera Group AB",
    location: "Stockholm, Sweden",
    type: "Full-time",
    salary_range: "500,000 - 700,000 SEK",
    skills: ["React", "TypeScript", "Node.js"],
    description: "We're looking for a senior frontend developer to join our growing team...",
  };

  const availableSkills = [
    "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "C#",
    "Angular", "Vue.js", "Next.js", "Express.js", "ASP.NET", "Spring Boot",
    "AWS", "Azure", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "MySQL",
    "Git", "Agile", "Scrum", "DevOps", "CI/CD", "REST APIs", "GraphQL"
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use existing CV from profile if no new file uploaded
      let cvUrl = profile?.cv_url;
      
      if (cvFile) {
        // Upload new CV file
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${user?.id}/cv-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, cvFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        cvUrl = publicUrl;
      }

      const applicationData = {
        applicant_id: user?.id,
        job_id: jobId,
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || null,
        availability: formData.availability || null,
        cover_letter: formData.coverLetter || null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        cv_url: cvUrl || null,
        status: "pending",
      };

      const { error } = await supabase
        .from("applications")
        .insert([applicationData]);

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your application has been successfully submitted to Justera Group AB.",
      });

      // Reset form
      setFormData(prev => ({ ...prev, coverLetter: "" }));
      setCvFile(null);

    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Justera Group AB</span>
            </Link>
            <div className="flex gap-2">
              <Link to="/profile">
                <Button variant="outline">My Profile</Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline">Back to Jobs</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <CardDescription className="text-lg font-medium text-gray-900">
              Justera Group AB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.type}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {job.salary_range}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pre-filled notice */}
        {profile && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-blue-800">
                <strong>Great!</strong> We've pre-filled this form with your profile information. 
                You can update any fields as needed before submitting your application.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Please review and update your information below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+46 70 123 45 67"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Stockholm, Sweden"
                />
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="expectedSalary">Expected Salary (SEK/year)</Label>
                  <Input
                    id="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedSalary: e.target.value }))}
                    placeholder="600000"
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Available to Start</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
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

              {/* Skills */}
              <div>
                <Label>Technical Skills</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional URLs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                  <Input
                    id="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub Profile</Label>
                  <Input
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/yourprofile"
                  />
                </div>
              </div>

              {/* CV Upload */}
              <div>
                <Label htmlFor="cv">CV/Resume {profile?.cv_url ? "" : "*"}</Label>
                {profile?.cv_url && (
                  <p className="text-sm text-green-600 mb-2">
                    ✓ We'll use your CV from your profile. Upload a new one to replace it.
                  </p>
                )}
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                      {cvFile && (
                        <p className="text-sm text-blue-600 mt-2">Selected: {cvFile.name}</p>
                      )}
                    </div>
                    <input
                      id="cv"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                  placeholder="Tell us why you're the perfect fit for this role at Justera Group AB..."
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Submit Application to Justera Group AB
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Apply;
