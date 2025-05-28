import React, { useState } from "react";
import {Profile, useAllCandidates} from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, DollarSign, Mail, Phone, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface CandidateFilters {
  skills?: string[];
  experience_years?: number;
  location?: string;
  job_seeking_status?: 'actively_looking' | 'open_to_opportunities' | 'not_looking';
  search?: string;
  page?: number;
  limit?: number;
}

const AdminCandidates = () => {
  const [filters, setFilters] = useState<CandidateFilters>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: candidates, total, } = useAllCandidates(filters);

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
    const experience = years === "any" ? undefined : parseInt(years);
    setFilters(prev => ({ ...prev, experience_years: experience }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({ ...prev, location: location }));
  };

  const handleJobSeekingStatusChange = (status: 'actively_looking' | 'open_to_opportunities' | 'not_looking' | null) => {
    setFilters(prev => ({ ...prev, job_seeking_status: status || undefined }));
  };

  const openCandidateModal = (candidate: Profile) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeCandidateModal = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

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

  const totalPages = Math.ceil(total / filters.limit!);

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
                    <SelectItem value={null}>Any</SelectItem>
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
                    <SelectItem value="any">Any</SelectItem>
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
              <Card key={candidate.id} onClick={() => openCandidateModal(candidate)} className="cursor-pointer">
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
              </Card>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <Button
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1}
              className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center">
          Page {filters.page} of {totalPages}
        </span>
          <Button
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={filters.page! * filters.limit! >= total}
              className="ml-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeCandidateModal}>
          {selectedCandidate && (
              <div>
                <h2 className="text-xl font-bold">{selectedCandidate.full_name}</h2>
                <p className="text-sm text-gray-500">{selectedCandidate.email}</p>
                <div className="mt-4">
                  <p className="text-sm font-medium">Bio:</p>
                  <p>{selectedCandidate.bio}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCandidate.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium">CV:</p>
                  {selectedCandidate.cv_url && (
                      <a href={selectedCandidate.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View CV
                      </a>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    {selectedCandidate.current_location || "No location specified"}
                  </p>
                  <p className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedCandidate.experience_years || 0} Years Experience
                  </p>
                  <p className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4" />
                    {selectedCandidate.expected_salary_sek || 0} SEK
                  </p>
                  <p className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4" />
                    {selectedCandidate.email}
                  </p>
                  <p className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4" />
                    {selectedCandidate.phone || "No phone specified"}
                  </p>
                  {selectedCandidate.linkedin_url && (
                      <a href={selectedCandidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:underline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                  )}
                  {selectedCandidate.portfolio_url && (
                      <a href={selectedCandidate.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:underline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Portfolio
                      </a>
                  )}
                </div>
              </div>
          )}
        </Modal>
      </div>
  );
};

export default AdminCandidates;
