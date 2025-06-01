
import React, { useState } from 'react';
import { useAllCandidates } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Briefcase, Mail, Phone, Trash2, FileText, ExternalLink } from 'lucide-react';

interface EnhancedCandidateSearchProps {
  onDeleteUser: (userId: string, userName: string) => void;
}

const EnhancedCandidateSearch: React.FC<EnhancedCandidateSearchProps> = ({ onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filters = {
    search: searchTerm,
    location: locationFilter || undefined,
    experience_years: experienceFilter ? parseInt(experienceFilter) : undefined,
    job_seeking_status: statusFilter || undefined,
    page: currentPage,
    limit: itemsPerPage,
  };

  const { data: candidates, total, isLoading } = useAllCandidates(filters);

  const totalPages = Math.ceil(total / itemsPerPage);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading candidates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Candidate Search</h2>
        <div className="text-sm text-gray-600">
          {total} candidates found
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Candidates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name, skills, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All locations</SelectItem>
                <SelectItem value="Stockholm">Stockholm</SelectItem>
                <SelectItem value="Gothenburg">Gothenburg</SelectItem>
                <SelectItem value="Malmö">Malmö</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Minimum experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any experience</SelectItem>
                <SelectItem value="0">Entry level (0+ years)</SelectItem>
                <SelectItem value="2">Mid level (2+ years)</SelectItem>
                <SelectItem value="5">Senior level (5+ years)</SelectItem>
                <SelectItem value="8">Lead level (8+ years)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job seeking status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="actively_looking">Actively looking</SelectItem>
                <SelectItem value="open_to_opportunities">Open to opportunities</SelectItem>
                <SelectItem value="not_looking">Not looking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setExperienceFilter('');
                setStatusFilter('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {candidates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No candidates found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          candidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://avatar.vercel.sh/${candidate.email}.png`} />
                      <AvatarFallback>
                        {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {candidate.first_name} {candidate.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {candidate.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {candidate.phone}
                          </div>
                        )}
                        {candidate.current_location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {candidate.current_location}
                          </div>
                        )}
                        {candidate.experience_years !== null && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {candidate.experience_years} years experience
                          </div>
                        )}
                      </div>

                      {candidate.bio && (
                        <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
                          {candidate.bio}
                        </p>
                      )}

                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {candidate.cv_url && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <a 
                            href={candidate.cv_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View CV
                            <ExternalLink className="h-3 w-3 inline ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Badge variant={candidate.job_seeking_status === 'actively_looking' ? 'default' : 'secondary'}>
                      {candidate.job_seeking_status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteUser(candidate.id, `${candidate.first_name} ${candidate.last_name}`)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-4 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedCandidateSearch;
