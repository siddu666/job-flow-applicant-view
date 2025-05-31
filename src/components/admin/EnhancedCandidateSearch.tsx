import React, { useState, useEffect } from "react";
import { Profile, useAllCandidates } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  X
} from "lucide-react";

interface CandidateFilters {
  skills?: string[];
  experience_years?: number;
  location?: string;
  job_seeking_status?: 'actively_looking' | 'open_to_opportunities' | 'not_looking';
  visaStatus?: string[];
  search?: string;
  cvSearch?: string;
  page?: number;
  limit?: number;
}

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

const skillsList = [
  "JavaScript", "React", "Node.js", "Python", "Java", "TypeScript", "Angular", "Vue.js",
  "PHP", "C#", "Ruby", "Go", "Rust", "Swift", "Kotlin", "Docker", "Kubernetes", 
  "AWS", "Azure", "GCP", "MongoDB", "PostgreSQL", "MySQL", "GraphQL", "REST API",
  "CI/CD", "Git", "Linux", "DevOps", "Machine Learning", "Data Science", "UI/UX Design"
];

const visaStatusOptions = [
  { value: 'citizen', label: 'Citizen of Sweden/EU' },
  { value: 'permanent', label: 'Permanent Residency (PUT)' },
  { value: 'work_permit', label: 'Work Permit' },
  { value: 'job_seeker', label: 'Job Seeker Visa' },
  { value: 'dependent', label: 'Dependent Visa' },
  { value: 'student', label: 'Student Visa' },
  { value: 'asylum', label: 'Asylum Seeker' },
  { value: 'other', label: 'Other' },
];

const EnhancedCandidateSearch = () => {
  const [filters, setFilters] = useState<CandidateFilters>({ page: 1, limit: 12 });
  const [searchTerm, setSearchTerm] = useState("");
  const [cvSearchTerm, setCvSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedVisaStatuses, setSelectedVisaStatuses] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Profile | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'created_at', direction: 'desc' });

  const { data: candidates, total, isLoading } = useAllCandidates(filters);

  // Apply local sorting since we can't sort in the backend query
  const sortedCandidates = React.useMemo(() => {
    if (!candidates) return [];
    
    return [...candidates].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOption.field) {
        case 'experience_years':
          aValue = a.experience_years || 0;
          bValue = b.experience_years || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at || '');
          bValue = new Date(b.created_at || '');
          break;
        case 'full_name':
          aValue = (a.first_name || '') + ' ' + (a.last_name || '');
          bValue = (b.first_name || '') + ' ' + (b.last_name || '');
          break;
        default:
          return 0;
      }
      
      if (sortOption.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [candidates, sortOption]);

  const handleSearch = () => {
    setFilters(prev => ({ 
      ...prev, 
      search: searchTerm,
      cvSearch: cvSearchTerm,
      page: 1 
    }));
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(newSkills);
    setFilters(prev => ({ ...prev, skills: newSkills, page: 1 }));
  };

  const handleVisaStatusToggle = (status: string) => {
    const newStatuses = selectedVisaStatuses.includes(status)
      ? selectedVisaStatuses.filter(s => s !== status)
      : [...selectedVisaStatuses, status];
    
    setSelectedVisaStatuses(newStatuses);
    setFilters(prev => ({ ...prev, visaStatus: newStatuses, page: 1 }));
  };

  const handleExperienceChange = (value: string) => {
    const experience = value === "any" ? undefined : parseInt(value);
    setFilters(prev => ({ ...prev, experience_years: experience, page: 1 }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({ ...prev, location, page: 1 }));
  };

  const handleJobSeekingStatusChange = (status: string) => {
    const jobStatus = status === "any" ? undefined : status as any;
    setFilters(prev => ({ ...prev, job_seeking_status: jobStatus, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchTerm("");
    setCvSearchTerm("");
    setSelectedSkills([]);
    setSelectedVisaStatuses([]);
  };

  const openCandidateModal = (candidate: Profile) => {
    setSelectedCandidate(candidate);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(false);
  };

  const totalPages = Math.ceil(total / (filters.limit || 12));
  const activeFiltersCount = [
    filters.search,
    filters.cvSearch,
    filters.experience_years,
    filters.location,
    filters.job_seeking_status,
    selectedSkills.length > 0,
    selectedVisaStatuses.length > 0
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Advanced Candidate Search
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Search Candidates</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name, bio, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Search CVs</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search CV content..."
                  value={cvSearchTerm}
                  onChange={(e) => setCvSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Experience Level</Label>
                  <Select onValueChange={handleExperienceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="0">Entry Level (0 years)</SelectItem>
                      <SelectItem value="1">1+ Years</SelectItem>
                      <SelectItem value="3">3+ Years</SelectItem>
                      <SelectItem value="5">5+ Years</SelectItem>
                      <SelectItem value="10">10+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="City..."
                    onChange={(e) => handleLocationChange(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Job Seeking Status</Label>
                  <Select onValueChange={handleJobSeekingStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="actively_looking">Actively Looking</SelectItem>
                      <SelectItem value="open_to_opportunities">Open to Opportunities</SelectItem>
                      <SelectItem value="not_looking">Not Looking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sort By</Label>
                  <Select 
                    value={`${sortOption.field}_${sortOption.direction}`}
                    onValueChange={(value) => {
                      const [field, direction] = value.split('_');
                      setSortOption({ field, direction: direction as 'asc' | 'desc' });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at_desc">Newest First</SelectItem>
                      <SelectItem value="created_at_asc">Oldest First</SelectItem>
                      <SelectItem value="experience_years_desc">Most Experience</SelectItem>
                      <SelectItem value="experience_years_asc">Least Experience</SelectItem>
                      <SelectItem value="full_name_asc">Name A-Z</SelectItem>
                      <SelectItem value="full_name_desc">Name Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Skills Filter */}
              <div>
                <Label>Skills (Multi-select)</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto p-2 border rounded">
                  {skillsList.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm cursor-pointer">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visa Status Filter */}
              <div>
                <Label>Visa/Work Status</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {visaStatusOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={selectedVisaStatuses.includes(option.value)}
                        onCheckedChange={() => handleVisaStatusToggle(option.value)}
                      />
                      <Label htmlFor={option.value} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
                <div className="text-sm text-gray-500">
                  {total} candidates found
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-8">Loading candidates...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCandidates?.map((candidate) => (
              <Card 
                key={candidate.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openCandidateModal(candidate)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${candidate.email}.png`} />
                        <AvatarFallback>
                          {candidate.first_name?.charAt(0)}{candidate.last_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {candidate.first_name} {candidate.last_name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                      </div>
                    </div>
                    {candidate.cv_url && (
                      <FileText className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {candidate.current_location && (
                    <p className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-1 h-3 w-3" />
                      {candidate.current_location}
                    </p>
                  )}
                  {candidate.experience_years !== null && (
                    <p className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-1 h-3 w-3" />
                      {candidate.experience_years} years experience
                    </p>
                  )}
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  {candidate.job_seeking_status && (
                    <Badge 
                      variant={candidate.job_seeking_status === 'actively_looking' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {candidate.job_seeking_status.replace('_', ' ')}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="flex items-center">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page! >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Candidate Details</h2>
                <Button variant="ghost" onClick={closeCandidateModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://avatar.vercel.sh/${selectedCandidate.email}.png`} />
                    <AvatarFallback className="text-lg">
                      {selectedCandidate.first_name?.substring(0, 1)}
                      {selectedCandidate.last_name?.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedCandidate.first_name} {selectedCandidate.last_name}
                    </h2>
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
                      {selectedCandidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
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
                        <span className="font-medium">Availability:</span>{" "}
                        {selectedCandidate.availability}
                      </p>
                    )}
                  </div>
                </div>

                {(selectedCandidate.linkedin_url ||
                  selectedCandidate.portfolio_url ||
                  selectedCandidate.github_url) && (
                  <div>
                    <p className="text-sm font-medium mb-2">Links:</p>
                    <div className="space-y-1">
                      {selectedCandidate.linkedin_url && (
                        <a
                          href={selectedCandidate.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm hover:underline text-blue-600"
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          LinkedIn
                        </a>
                      )}
                      {selectedCandidate.portfolio_url && (
                        <a
                          href={selectedCandidate.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm hover:underline text-blue-600"
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Portfolio
                        </a>
                      )}
                      {selectedCandidate.github_url && (
                        <a
                          href={selectedCandidate.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm hover:underline text-blue-600"
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCandidateSearch;
