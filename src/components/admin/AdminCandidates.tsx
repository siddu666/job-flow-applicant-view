import React, { useState } from "react";
import { useAllCandidates } from "@/hooks/useAllCandidates";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, DollarSign, Mail, Phone, ExternalLink, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Profile } from "@/interfaces/Profile";

interface CandidateFilters {
  skills?: string[];
  experience_years?: number;
  location?: string;
  job_seeking_status?: 'actively_looking' | 'not_looking';
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
  const candidates = candidatesResult || [];
  const total = candidatesResult?.length || 0;

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
        value === "any" ? undefined : (value as 'actively_looking' | 'not_looking');

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
    "JavaScript", "React", "Node.js", "Python", "SQL", "TypeScript", "AWS", "Docker", "Kubernetes",
  ];

  const getFullName = (candidate: Profile) => {
    return `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Unknown Name';
  };

  const getInitials = (candidate: Profile) => {
    const firstName = candidate.first_name?.[0] || '';
    const lastName = candidate.last_name?.[0] || '';
    return firstName + lastName || 'U';
  };

  return (
      <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
        <UICard className="shadow-lg border border-indigo-100">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-indigo-700">Candidate Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="flex gap-2">
                <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Button onClick={handleSearch} variant="outline" className="border-indigo-500 text-indigo-500 hover:bg-indigo-50">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Select onValueChange={handleExperienceChange}>
                <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Experience</SelectItem>
                  <SelectItem value="1">1+ Years</SelectItem>
                  <SelectItem value="3">3+ Years</SelectItem>
                  <SelectItem value="5">5+ Years</SelectItem>
                  <SelectItem value="10">10+ Years</SelectItem>
                </SelectContent>
              </Select>

              <Input
                  placeholder="Location..."
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

              <Select onValueChange={handleJobSeekingStatusChange}>
                <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Job Seeking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Status</SelectItem>
                  <SelectItem value="actively_looking">Actively Looking</SelectItem>
                  <SelectItem value="not_looking">Not Looking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-gray-600">Filter by Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                    <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer ${selectedSkills.includes(skill) ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-100 text-indigo-800'}`}
                        onClick={() => handleSkillSelect(skill)}
                    >
                      {skill}
                    </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </UICard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
              <UICard key={candidate.id} className="cursor-pointer hover:shadow-lg transition-shadow border border-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 bg-indigo-100">
                      <AvatarFallback className="text-indigo-600">
                        {getInitials(candidate)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate text-indigo-800">
                        {getFullName(candidate)}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Professional
                      </p>

                      <div className="space-y-1 text-sm text-gray-500">
                        {candidate.current_location && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-indigo-500" />
                              {candidate.current_location}
                            </div>
                        )}

                        {candidate.experience_years && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-indigo-500" />
                              {candidate.experience_years} years experience
                            </div>
                        )}

                        {candidate.expected_salary_sek && (
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1 text-indigo-500" />
                              {candidate.expected_salary_sek} SEK
                            </div>
                        )}
                      </div>

                      {candidate.skills && candidate.skills.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-indigo-100 text-indigo-800">
                                    {skill}
                                  </Badge>
                              ))}
                              {candidate.skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs text-indigo-600 border-indigo-200">
                                    +{candidate.skills.length - 3} more
                                  </Badge>
                              )}
                            </div>
                          </div>
                      )}

                      <div className="mt-4 flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCandidateModal(candidate)}
                            className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
                        >
                          View Profile
                        </Button>
                        {candidate.email && (
                            <Button variant="outline" size="sm" asChild className="border-indigo-500 text-indigo-500 hover:bg-indigo-50">
                              <a href={`mailto:${candidate.email}`}>
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </a>
                            </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </UICard>
          ))}
        </div>

        {total > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} to{' '}
                {Math.min((filters.page || 1) * (filters.limit || 10), total)} of {total} candidates
              </p>

              <div className="flex space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page || 1) <= 1}
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page || 1) >= Math.ceil(total / (filters.limit || 10))}
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                    className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
        )}

        <Modal isOpen={isModalOpen} onClose={closeCandidateModal}>
          {selectedCandidate && (
              <div className="space-y-4 p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 bg-indigo-100">
                    <AvatarFallback className="text-lg text-indigo-600">
                      {getInitials(selectedCandidate)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-indigo-800">{getFullName(selectedCandidate)}</h2>
                    <p className="text-gray-600">Professional</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-indigo-700">Contact Information</h3>
                    <div className="space-y-1 text-sm">
                      {selectedCandidate.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                            <a href={`mailto:${selectedCandidate.email}`} className="text-indigo-600 hover:underline">
                              {selectedCandidate.email}
                            </a>
                          </div>
                      )}
                      {selectedCandidate.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                            <a href={`tel:${selectedCandidate.phone}`} className="text-indigo-600 hover:underline">
                              {selectedCandidate.phone}
                            </a>
                          </div>
                      )}
                      {selectedCandidate.current_location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                            {selectedCandidate.current_location}
                          </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-indigo-700">Professional Details</h3>
                    <div className="space-y-1 text-sm">
                      {selectedCandidate.experience_years && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                            {selectedCandidate.experience_years} years experience
                          </div>
                      )}
                      {selectedCandidate.expected_salary_sek && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
                            {selectedCandidate.expected_salary_sek} SEK expected salary
                          </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-indigo-700">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800">
                              {skill}
                            </Badge>
                        ))}
                      </div>
                    </div>
                )}

                {selectedCandidate.bio && (
                    <div>
                      <h3 className="font-semibold mb-2 text-indigo-700">Bio</h3>
                      <p className="text-sm text-gray-600">{selectedCandidate.bio}</p>
                    </div>
                )}

                <div className="flex space-x-2 pt-4">
                  {selectedCandidate.cv_url && (
                      <Button variant="outline" asChild className="border-indigo-500 text-indigo-500 hover:bg-indigo-50">
                        <a href={selectedCandidate.cv_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-2" />
                          View Resume
                        </a>
                      </Button>
                  )}
                  {selectedCandidate.portfolio_url && (
                      <Button variant="outline" asChild className="border-indigo-500 text-indigo-500 hover:bg-indigo-50">
                        <a href={selectedCandidate.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Portfolio
                        </a>
                      </Button>
                  )}
                </div>
              </div>
          )}
        </Modal>
      </div>
  );
};

export { AdminCandidates };
export default AdminCandidates;
