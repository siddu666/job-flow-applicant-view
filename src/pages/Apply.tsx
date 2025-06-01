import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Upload, MapPin, Clock, DollarSign, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { useProfile } from "@/hooks/useProfile";
import { useJobById } from "@/hooks/useJobs";

interface Skill {
  name: string;
  proficiency: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  expectedSalary: string;
  availability: string;
  coverLetter: string;
  skills: Skill[];
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
}

const Apply = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { toast } = useToast();
  const { user } = useAuth();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [customLocation, setCustomLocation] = useState("");

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useProfile(user?.id);
  const { data: job, isLoading: isJobLoading, error: jobError } = useJobById(jobId as string);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    expectedSalary: "",
    availability: "",
    coverLetter: "",
    skills: [],
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  const availableSkills = [
    { name: "React", proficiency: "" },
    { name: "TypeScript", proficiency: "" },
    { name: "JavaScript", proficiency: "" },
    { name: "Node.js", proficiency: "" },
    { name: "Python", proficiency: "" },
    { name: "Java", proficiency: "" },
    { name: "C#", proficiency: "" },
    { name: "Angular", proficiency: "" },
    { name: "Vue.js", proficiency: "" },
    { name: "Next.js", proficiency: "" },
    { name: "Express.js", proficiency: "" },
    { name: "ASP.NET", proficiency: "" },
    { name: "Spring Boot", proficiency: "" },
    { name: "AWS", proficiency: "" },
    { name: "Azure", proficiency: "" },
    { name: "Docker", proficiency: "" },
    { name: "Kubernetes", proficiency: "" },
    { name: "PostgreSQL", proficiency: "" },
    { name: "MongoDB", proficiency: "" },
    { name: "MySQL", proficiency: "" },
    { name: "Git", proficiency: "" },
    { name: "Agile", proficiency: "" },
    { name: "Scrum", proficiency: "" },
    { name: "DevOps", proficiency: "" },
    { name: "CI/CD", proficiency: "" },
    { name: "REST APIs", proficiency: "" },
    { name: "GraphQL", proficiency: "" },
  ];

  useEffect(() => {
    if (profile && user) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: user.email || "",
        phone: profile.phone || "",
        experience: profile.experience_years?.toString() || "",
        expectedSalary: profile.expected_salary_sek?.toString() || "",
        availability: profile.availability || "",
        coverLetter: "",
        skills: profile.skills?.map(skill => ({ name: skill, proficiency: "" })) || [],
        portfolioUrl: profile.portfolio_url || "",
        linkedinUrl: profile.linkedin_url || "",
        githubUrl: profile.github_url || "",
      });
    }
  }, [profile, user]);

  const handleSkillToggle = (skill: Skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.some(s => s.name === skill.name)
          ? prev.skills.filter(s => s.name !== skill.name)
          : [...prev.skills, skill]
    }));
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() !== "") {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: customSkill, proficiency: "" }]
      }));
      setCustomSkill("");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setCvFile(file);
    }
  };

  const uploadCV = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/cv-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload CV: ${uploadError.message}`);
    }

    const twoYearsInSeconds = 2 * 365 * 24 * 60 * 60;
    const { data, error: signedUrlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(fileName, twoYearsInSeconds);

    if (signedUrlError || !data) {
      console.error('Error generating signed URL:', signedUrlError);
      throw new Error(`Failed to generate signed URL: ${signedUrlError?.message}`);
    }

    // Use optional chaining to safely access signedUrl
    const signedUrl = data.signedUrl;
    return signedUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    if (!user?.id) {
      throw new Error("User ID is required to fetch profile.");
    }
    e.preventDefault();
    setIsUploading(true);

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    if (!profile?.cv_url && !cvFile) {
      toast({
        title: "CV Required",
        description: "Please upload your CV to continue.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    try {
      let cvUrl = profile?.cv_url;

      if (cvFile) {
        cvUrl = await uploadCV(cvFile);
        
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ cv_url: cvUrl })
            .eq('id', user?.id);

        if (profileUpdateError) {
          console.error('Profile update error:', profileUpdateError);
        }
      }

      const applicationData = {
        applicant_id: user?.id || '',
        job_id: Array.isArray(jobId) ? jobId[0] : jobId || '', // Ensure job_id is a string
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email || '',
        phone: formData.phone || null,
        availability: formData.availability || null,
        cover_letter: formData.coverLetter || null,
        skills: formData.skills.map(skill => skill.name),
        cv_url: cvUrl || null,
        status: "pending",
      };

      const { error } = await supabase
          .from("applications")
          .insert([applicationData]); // Ensure the data is passed as an array

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your application has been successfully submitted to Justera Group AB.",
      });

      setFormData(prev => ({ ...prev, coverLetter: "" }));
      setCvFile(null);

    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isProfileLoading || isJobLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || jobError) {
    return <div>Error loading details: {profileError?.message || jobError?.message}</div>;
  }

  if (!job) {
    return <div>No job found with the given ID.</div>;
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Justera Group AB</span>
              </Link>
              <div className="flex gap-2">
                <Link href="/profile">
                  <Button variant="outline">My Profile</Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline">Back to Jobs</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                {job.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {skill}
                    </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {profile && (
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-blue-800">
                    <h3 className="font-bold">Job Description:</h3>
                    <p>{job.description}</p>
                  </div>
                  <br />
                  <div className="text-blue-800">
                    <h3 className="font-bold">Responsibilities:</h3>
                    <ul className="list-disc pl-5">
                      {job.requirements.split('.').map((requirement, index) => (
                          <li key={index} className="my-1">{requirement.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
          )}

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

          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Please review and update your information below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div>
                  <Label>Technical Skills</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto">
                    {availableSkills.map((skill) => (
                        <div key={skill.name} className="flex items-center space-x-2">
                          <Checkbox
                              id={skill.name}
                              checked={formData.skills.some(s => s.name === skill.name)}
                              onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label htmlFor={skill.name}>{skill.name}</Label>
                          <Select
                              value={formData.skills.find(s => s.name === skill.name)?.proficiency || ""}
                              onValueChange={(value) => {
                                setFormData(prev => ({
                                  ...prev,
                                  skills: prev.skills.map(s =>
                                      s.name === skill.name ? { ...s, proficiency: value } : s
                                  )
                                }));
                              }}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Proficiency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Input
                          value={customSkill}
                          onChange={(e) => setCustomSkill(e.target.value)}
                          placeholder="Add custom skill"
                      />
                      <Button type="button" onClick={handleAddCustomSkill}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

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

                <div>
                  <Label htmlFor="cv">CV/Resume *</Label>
                  {profile?.cv_url && (
                      <div className="mb-2">
                        <p className="text-sm text-green-600">
                          ✓ Current CV: <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="underline">View CV</a>
                        </p>
                        <p className="text-sm text-gray-600">Upload a new CV to replace it.</p>
                      </div>
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

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isUploading}
                >
                  {isUploading ? "Submitting..." : "Submit Application to Justera Group AB"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Apply;
