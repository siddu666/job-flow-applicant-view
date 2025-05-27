
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const JobPostForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    skills: [] as string[],
    experience: "",
  });

  const swedishCities = [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", 
    "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå",
    "Gävle", "Borås", "Eskilstuna", "Karlstad", "Täby", "Remote (Sweden)"
  ];

  const itSkills = [
    "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "C#",
    "Angular", "Vue.js", ".NET", "Spring Boot", "Docker", "Kubernetes",
    "AWS", "Azure", "Google Cloud", "PostgreSQL", "MongoDB", "MySQL",
    "Redis", "Git", "Jenkins", "CI/CD", "Agile", "Scrum", "DevOps",
    "Microservices", "REST APIs", "GraphQL", "Machine Learning", "AI",
    "Data Science", "Cybersecurity", "Blockchain", "Mobile Development",
    "iOS", "Android", "Flutter", "React Native", "Unity", "Game Development"
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post jobs.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .insert([
          {
            title: formData.title,
            company: "Justera Group AB",
            location: formData.location,
            type: formData.type,
            salary_range: formData.salary,
            description: formData.description,
            requirements: formData.requirements,
            posted_by: user.id,
            skills: formData.skills,
            experience_level: formData.experience,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting is now live and accepting applications.",
      });

      // Reset form
      setFormData({
        title: "",
        location: "",
        type: "",
        salary: "",
        description: "",
        requirements: "",
        skills: [],
        experience: "",
      });
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New IT Position - Justera Group AB</CardTitle>
        <CardDescription>
          Create a new job posting for IT positions in Sweden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="location">Location *</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Swedish city" />
                </SelectTrigger>
                <SelectContent>
                  {swedishCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Employment Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
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
                  <SelectItem value="Junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="Mid-level">Mid-level (3-5 years)</SelectItem>
                  <SelectItem value="Senior">Senior (6+ years)</SelectItem>
                  <SelectItem value="Lead">Lead/Architect</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="salary">Salary Range (SEK)</Label>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
              placeholder="e.g. 45,000 - 65,000 SEK/month"
            />
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and what we're looking for at Justera Group AB..."
              rows={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requirements & Qualifications</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="List the required qualifications, experience, education, and technical skills..."
              rows={4}
            />
          </div>

          <div>
            <Label>Required IT Skills & Technologies</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
              {itSkills.map((skill) => (
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
            Post IT Position
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;
