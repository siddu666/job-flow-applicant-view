
import React, { useState } from "react";
import { Profile, useAllCandidates } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Mail, Phone, FileText, Trash2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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

interface EnhancedCandidateSearchProps {
  onDeleteUser: (userId: string, userName: string) => void;
}

const EnhancedCandidateSearch: React.FC<EnhancedCandidateSearchProps> = ({ onDeleteUser }) => {
  const [filters, setFilters] = useState<CandidateFilters>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: candidatesResult } = useAllCandidates(filters);
  const candidates = candidatesResult?.data || [];
  const total = candidatesResult?.total || 0;

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleSkillSelect = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(newSkills);
    setFilters(prev => ({ ...prev, skills: newSkills, page: 1 }));
  };

  const handleExperienceChange = (years: string) => {
    const experience = years === "any" ? undefined : parseInt(years);
    setFilters(prev => ({ ...prev, experience_years: experience, page: 1 }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({ ...prev, location: location || undefined, page: 1 }));
  };

  const handleJobSeekingStatusChange = (value: string) => {
    const status: 'actively_looking' | 'open_to_opportunities' | 'not_looking' | undefined =
        value === "any" ? undefined : (value as 'actively_looking' | 'open_to_opportunities' | 'not_looking');

    setFilters(prev => ({ ...prev, job_seeking_status: status, page: 1 }));
  };

  const openCandidateModal = (candidate: Profile) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeCandidateModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDeleteCandidate = (candidate: Profile) => {
    const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || candidate.email || 'Unknown User';
    onDeleteUser(candidate.id, fullName);
    closeCandidateModal();
  };

  const skillsList = [
    "JavaScript", "React", "Node.js", "Python", "SQL", "TypeScript",
    "AWS", "Docker", "Kubernetes", "CI/CD", "Java", "C#", ".NET",
    "Angular", "Vue.js", "MongoDB", "PostgreSQL", "Redis", "GraphQL"
  ];

  const totalPages = Math.ceil(total / (filters.limit || 10));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Candidates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search by name, email, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button className="w-full" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            <Select onValueChange={handleExperienceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Experience</SelectItem>
                <SelectItem value="0">Entry Level (0-1 years)</SelectItem>
                <SelectItem value="2">Junior (2-3 years)</SelectItem>
                <SelectItem value="4">Mid-level (4-6 years)</SelectItem>
                <SelectItem value="7">Senior (7+ years)</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Location (city, country)..."
              onChange={(e) => handleLocationChange(e.target.value)}
            />

            <Select onValueChange={handleJobSeekingStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Job Seeking Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Status</SelectItem>
                <SelectItem value="actively_looking">Actively Looking</SelectItem>
                <SelectItem value="open_to_opportunities">Open to Opportunities</SelectItem>
                <SelectItem value="not_looking">Not Looking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Filter by Skills:</p>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  onClick={() => handleSkillSelect(skill)}
                  className="cursor-pointer hover:bg-primary/80"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Found {total} candidate{total !== 1 ? 's' : ''}
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((filters.page || 1) - 1)}
              disabled={filters.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {filters.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={filters.page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate: Profile) => (
          <Card 
            key={candidate.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openCandidateModal(candidate)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${candidate.email}.png`} />
                  <AvatarFallback>
                    {(candidate.first_name?.[0] || '')}
                    {(candidate.last_name?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {candidate.first_name} {candidate.last_name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{candidate.email}</p>
                  {candidate.cv_url && (
                    <div className="flex items-center gap-1 mt-1">
                      <FileText className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">CV Available</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-2">
              {candidate.current_location && (
                <p className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{candidate.current_location}</span>
                </p>
              )}
              
              {candidate.experience_years && (
                <p className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-3 w-3 flex-shrink-0" />
                  {candidate.experience_years} years experience
                </p>
              )}

              {candidate.skills && candidate.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 3).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <Badge 
                variant={candidate.job_seeking_status === 'actively_looking' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {candidate.job_seeking_status?.replace('_', ' ') || 'Not specified'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {candidates.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No candidates found matching your criteria.</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
          </CardContent>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={closeCandidateModal}>
        {selectedCandidate && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://avatar.vercel.sh/${selectedCandidate.email}.png`} />
                  <AvatarFallback className="text-lg">
                    {(selectedCandidate.first_name?.[0] || '')}
                    {(selectedCandidate.last_name?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedCandidate.first_name} {selectedCandidate.last_name}
                  </h2>
                  <p className="text-gray-600">{selectedCandidate.email}</p>
                  <Badge 
                    variant={selectedCandidate.job_seeking_status === 'actively_looking' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {selectedCandidate.job_seeking_status?.replace('_', ' ') || 'Not specified'}
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteCandidate(selectedCandidate)}
                className="ml-4"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            </div>

            {selectedCandidate.bio && (
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedCandidate.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                    {selectedCandidate.email}
                  </p>
                  {selectedCandidate.phone && (
                    <p className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      {selectedCandidate.phone}
                    </p>
                  )}
                  {selectedCandidate.current_location && (
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      {selectedCandidate.current_location}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Professional Details</h3>
                <div className="space-y-2 text-sm">
                  {selectedCandidate.experience_years && (
                    <p>
                      <span className="text-gray-500">Experience:</span> {selectedCandidate.experience_years} years
                    </p>
                  )}
                  {selectedCandidate.expected_salary_sek && (
                    <p>
                      <span className="text-gray-500">Expected Salary:</span> {selectedCandidate.expected_salary_sek.toLocaleString()} SEK
                    </p>
                  )}
                  {selectedCandidate.availability && (
                    <p>
                      <span className="text-gray-500">Availability:</span> {selectedCandidate.availability}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-medium">Documents & Links</h3>
              <div className="space-y-2">
                {selectedCandidate.cv_url && (
                  <a 
                    href={selectedCandidate.cv_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View CV/Resume
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
                
                {selectedCandidate.portfolio_url && (
                  <a 
                    href={selectedCandidate.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Portfolio
                  </a>
                )}
                
                {selectedCandidate.linkedin_url && (
                  <a 
                    href={selectedCandidate.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    LinkedIn Profile
                  </a>
                )}
                
                {selectedCandidate.github_url && (
                  <a 
                    href={selectedCandidate.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EnhancedCandidateSearch;
