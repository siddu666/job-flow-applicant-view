import React, { useState } from "react";
import { useAllCandidates } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, DollarSign, Mail, Phone, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface CandidateFilters {
  skills?: string[];
  experience_years?: number;
  location?: string;
  job_seeking_status?: 'actively_looking' | 'open_to_opportunities' | 'not_looking';
  search?: string;
}

const AdminCandidates = () => {
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const { data: candidates, isLoading, error } = useAllCandidates(filters);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
    setFilters(prev => ({ ...prev, skills: selectedSkills }));
  };

  const handleExperienceChange = (years: string) => {
    const experience = years ? parseInt(years) : undefined;
    setFilters(prev => ({ ...prev, experience_years: experience }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({ ...prev, location: location }));
  };

  const handleJobSeekingStatusChange = (status: 'actively_looking' | 'open_to_opportunities' | 'not_looking') => {
    setFilters(prev => ({ ...prev, job_seeking_status: status }));
  };

  if (isLoading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const skillsList = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "TypeScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD"
  ];

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filter Candidates</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Search by name or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="mt-2 w-full" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            <div>
              <Select onValueChange={handleExperienceChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Experience (Years)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1+ Years</SelectItem>
                  <SelectItem value="3">3+ Years</SelectItem>
                  <SelectItem value="5">5+ Years</SelectItem>
                  <SelectItem value="7">7+ Years</SelectItem>
                  <SelectItem value="10">10+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                type="text"
                placeholder="Location..."
                onChange={(e) => handleLocationChange(e.target.value)}
              />
            </div>

            <div>
              <Select onValueChange={handleJobSeekingStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Job Seeking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="actively_looking">Actively Looking</SelectItem>
                  <SelectItem value="open_to_opportunities">Open to Opportunities</SelectItem>
                  <SelectItem value="not_looking">Not Looking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Skills:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillsList.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "secondary" : "outline"}
                  onClick={() => handleSkillSelect(skill)}
                  className="cursor-pointer"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates?.map((candidate) => (
          <Card key={candidate.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${candidate.email}.png`} />
                  <AvatarFallback>{candidate.full_name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{candidate.full_name}</CardTitle>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {candidate.bio?.substring(0, 100)}...
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  {candidate.current_location || "No location specified"}
                </p>
                <p className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  {candidate.experience_years || 0} Years Experience
                </p>
                <p className="flex items-center text-sm">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {candidate.expected_salary_sek || 0} SEK
                </p>
                <p className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4" />
                  {candidate.email}
                </p>
                <p className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4" />
                  {candidate.phone || "No phone specified"}
                </p>
                {candidate.linkedin_url && (
                  <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:underline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {candidate.portfolio_url && (
                  <a href={candidate.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:underline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Portfolio
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCandidates;
