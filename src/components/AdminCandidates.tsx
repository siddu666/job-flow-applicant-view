
import React, { useState } from "react";
import {Profile, useAllCandidates} from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, DollarSign, Mail, Phone, ExternalLink, ChevronLeft, ChevronRight, FileText } from "lucide-react";
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

  const { data: candidatesResult } = useAllCandidates(filters);
  const candidates = candidatesResult?.data || [];
  const total = candidatesResult?.total || 0;

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

  const handleJobSeekingStatusChange = (value: string) => {
    const status: 'actively_looking' | 'open_to_opportunities' | 'not_looking' | undefined =
        value === "any" ? undefined : (value as 'actively_looking' | 'open_to_opportunities' | 'not_looking');

    setFilters(prev => ({ ...prev, job_seeking_status: status }));
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

  const totalPages = Math.ceil(total / (filters.limit || 10));

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
                    <SelectItem value="any">Any</SelectItem>
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
          {candidates.map((candidate: Profile) => (
              <Card key={candidate.id} onClick={() => openCandidateModal(candidate)} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${candidate.email}.png`} />
                      <AvatarFallback>{candidate.first_name?.substring(0, 1)}{candidate.last_name?.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{candidate.first_name} {candidate.last_name}</CardTitle>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                      {candidate.cv_url && (
                        <div className="flex items-center gap-1 mt-1">
                          <FileText className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">CV Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {candidate.current_location && (
                      <p className="flex items-center text-sm text-gray-600">
                        <MapPin className="mr-1 h-3 w-3" />
                        {candidate.current_location}
                      </p>
                    )}
                    {candidate.experience_years && (
                      <p className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-1 h-3 w-3" />
                        {candidate.experience_years} years experience
                      </p>
                    )}
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 2).map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <Button
              onClick={() => handlePageChange((filters.page || 1) - 1)}
              disabled={filters.page === 1}
              className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center">
          Page {filters.page} of {totalPages}
        </span>
          <Button
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={(filters.page || 1) * (filters.limit || 10) >= total}
              className="ml-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeCandidateModal}>
          {selectedCandidate && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://avatar.vercel.sh/${selectedCandidate.email}.png`} />
                    <AvatarFallback className="text-lg">
                      {selectedCandidate.first_name?.substring(0, 1)}{selectedCandidate.last_name?.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCandidate.first_name} {selectedCandidate.last_name}</h2>
                    <p className="text-sm text-gray-500">{selectedCandidate.email}</p>
                  </div>
                </div>

                {selectedCandidate.bio && (
                  <div>
                    <p className="text-sm font-medium">Bio:</p>
                    <p className="text-sm text-gray-700">{selectedCandidate.bio}</p>
                  </div>
                )}

                {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedCandidate.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCandidate.cv_url && (
                  <div>
                    <p className="text-sm font-medium">CV/Resume:</p>
                    <a 
                      href={selectedCandidate.cv_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      View CV/Resume
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
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
                  </div>
                  
                  <div className="space-y-2">
                    <p className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {selectedCandidate.email}
                    </p>
                    <p className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4" />
                      {selectedCandidate.phone || "No phone specified"}
                    </p>
                    {selectedCandidate.availability && (
                      <p className="text-sm">
                        <span className="font-medium">Availability:</span> {selectedCandidate.availability}
                      </p>
                    )}
                  </div>
                </div>

                {(selectedCandidate.linkedin_url || selectedCandidate.portfolio_url || selectedCandidate.github_url) && (
                  <div>
                    <p className="text-sm font-medium mb-2">Links:</p>
                    <div className="space-y-1">
                      {selectedCandidate.linkedin_url && (
                          <a href={selectedCandidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:underline text-blue-600">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            LinkedIn
                          </a>
                      )}
                      {selectedCandidate.portfolio_url && (
                          <a href={selectedCandidate.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:underline text-blue-600">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Portfolio
                          </a>
                      )}
                      {selectedCandidate.github_url && (
                          <a href={selectedCandidate.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:underline text-blue-600">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            GitHub
                          </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
          )}
        </Modal>
      </div>
  );
};

export default AdminCandidates;
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AdminCandidates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidates</CardTitle>
        <CardDescription>
          Manage candidate profiles and information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">No candidates found.</p>
      </CardContent>
    </Card>
  )
}
