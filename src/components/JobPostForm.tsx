
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const JobPostForm = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: [] as string[],
    experience: "",
    department: "",
    contactEmail: "",
  });

  const availableSkills = [
    "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "C++",
    "Tailwind CSS", "CSS", "HTML", "AWS", "Docker", "PostgreSQL", "MongoDB",
    "Git", "Agile", "Figma", "Adobe Creative Suite", "Product Strategy",
    "Machine Learning", "Data Science", "DevOps", "Kubernetes", "Vue.js"
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate job posting
    toast({
      title: "Job Posted Successfully!",
      description: "Your job posting is now live and accepting applications.",
    });

    console.log("Job posted:", formData);
    
    // Reset form
    setFormData({
      title: "",
      company: "",
      location: "",
      type: "",
      salary: "",
      description: "",
      requirements: "",
      benefits: "",
      skills: [],
      experience: "",
      department: "",
      contactEmail: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>
          Fill out the form below to create a new job posting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g. TechCorp Inc."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>
            <div>
              <Label htmlFor="type">Job Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="e.g. $80k - $120k"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="Mid Level">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="Senior Level">Senior Level (6+ years)</SelectItem>
                  <SelectItem value="Lead/Manager">Lead/Manager</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              placeholder="hiring@company.com"
            />
          </div>

          {/* Job Description */}
          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={6}
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="List the required qualifications, experience, and skills..."
              rows={4}
            />
          </div>

          {/* Benefits */}
          <div>
            <Label htmlFor="benefits">Benefits & Perks</Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
              placeholder="Describe the benefits, perks, and company culture..."
              rows={4}
            />
          </div>

          {/* Skills */}
          <div>
            <Label>Required Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
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
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Post Job
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;
