
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useCreateJob } from "@/hooks/useJobs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface JobPostFormProps {
  onClose: () => void;
}

const JobPostForm = ({ onClose }: JobPostFormProps) => {
  const { user } = useAuth();
  const createJobMutation = useCreateJob();
  
  const [formData, setFormData] = useState({
    title: "",
    company: "Justera Group AB",
    location: "",
    type: "",
    salary_range: "",
    description: "",
    requirements: "",
    experience_level: "",
    skills: [] as string[],
  });

  const [skillInput, setSkillInput] = useState("");

  // Predefined skills list for IT positions
  const availableSkills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C#", "PHP",
    "Angular", "Vue.js", "HTML", "CSS", "SQL", "MongoDB", "PostgreSQL", "MySQL",
    "AWS", "Azure", "Docker", "Kubernetes", "Git", "Linux", "Windows Server",
    "DevOps", "CI/CD", "REST APIs", "GraphQL", "Microservices", "Agile", "Scrum",
    "Project Management", "Machine Learning", "AI", "Data Analysis", "Cybersecurity",
    "Cloud Computing", "Mobile Development", "iOS", "Android", "Flutter", "React Native",
    "Backend Development", "Frontend Development", "Full Stack", "UI/UX Design",
    "System Administration", "Network Administration", "Database Administration"
  ];

  const swedishCities = [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro",
    "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå",
    "Gävle", "Borås", "Eskilstuna", "Karlstad", "Täby", "Remote (Sweden)"
  ];

  const experienceLevels = [
    "Entry Level (0-2 years)",
    "Junior (1-3 years)",
    "Mid Level (3-5 years)",
    "Senior (5-8 years)",
    "Lead (8+ years)",
    "Principal (10+ years)"
  ];

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Consultant",
    "Internship"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to post a job");
      return;
    }

    if (!formData.title || !formData.description || !formData.requirements || !formData.location || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createJobMutation.mutateAsync({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary_range: formData.salary_range || null,
        description: formData.description,
        requirements: formData.requirements,
        experience_level: formData.experience_level || null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        posted_by: user.id,
      });
      
      toast.success("Job posted successfully!");
      onClose();
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job. Please try again.");
    }
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(skillInput.toLowerCase()) &&
    !formData.skills.includes(skill)
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-blue-900">Post New IT Position</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. Senior Software Developer"
                required
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Company name"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location in Sweden" />
                </SelectTrigger>
                <SelectContent>
                  {swedishCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Employment Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select value={formData.experience_level} onValueChange={(value) => handleInputChange("experience_level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range (SEK)</Label>
              <Input
                id="salary_range"
                value={formData.salary_range}
                onChange={(e) => handleInputChange("salary_range", e.target.value)}
                placeholder="e.g. 45,000 - 65,000 per month"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <Label>Required Skills</Label>
            
            {/* Skill Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Search and add skills..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (skillInput.trim()) {
                        addSkill(skillInput.trim());
                      }
                    }
                  }}
                />
                {skillInput && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto z-10 shadow-lg">
                    {filteredSkills.slice(0, 10).map((skill) => (
                      <div
                        key={skill}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => addSkill(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                    {skillInput && !availableSkills.includes(skillInput) && (
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer border-t"
                        onClick={() => addSkill(skillInput)}
                      >
                        <Plus className="h-4 w-4 inline mr-2" />
                        Add "{skillInput}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={() => {
                  if (skillInput.trim()) {
                    addSkill(skillInput.trim());
                  }
                }}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
              rows={4}
              required
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements *</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              placeholder="List the required qualifications, experience, and skills..."
              rows={4}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createJobMutation.isPending}
            >
              {createJobMutation.isPending ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;
