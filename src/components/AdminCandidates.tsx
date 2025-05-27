
import { useState } from "react";
import { useAllCandidates, useSendPeriodicCheck } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, Filter, Mail, Phone, MapPin, Briefcase, Calendar, ExternalLink } from "lucide-react";
import { Profile } from "@/hooks/useProfile";

const AdminCandidates = () => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    job_seeking_status: "",
    experience_years: "",
  });

  const { data: candidates, isLoading } = useAllCandidates({
    search: filters.search || undefined,
    location: filters.location || undefined,
    job_seeking_status: filters.job_seeking_status as any || undefined,
    experience_years: filters.experience_years ? parseInt(filters.experience_years) : undefined,
  });

  const sendPeriodicCheck = useSendPeriodicCheck();

  const getStatusColor = (status: Profile['job_seeking_status']) => {
    switch (status) {
      case 'actively_looking':
        return 'bg-green-100 text-green-800';
      case 'open_to_offers':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_looking':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Profile['job_seeking_status']) => {
    switch (status) {
      case 'actively_looking':
        return 'Actively Looking';
      case 'open_to_offers':
        return 'Open to Offers';
      case 'not_looking':
        return 'Not Looking';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading candidates...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Candidate Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and review all registered candidates
          </p>
        </div>
        <Button
          onClick={() => sendPeriodicCheck.mutate()}
          disabled={sendPeriodicCheck.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Mail className="h-4 w-4 mr-2" />
          Send Periodic Check
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search candidates..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Input
                placeholder="Filter by location..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <Select
                value={filters.job_seeking_status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, job_seeking_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job seeking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="actively_looking">Actively Looking</SelectItem>
                  <SelectItem value="open_to_offers">Open to Offers</SelectItem>
                  <SelectItem value="not_looking">Not Looking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filters.experience_years}
                onValueChange={(value) => setFilters(prev => ({ ...prev, experience_years: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Min experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Experience</SelectItem>
                  <SelectItem value="0">Entry Level</SelectItem>
                  <SelectItem value="2">2+ Years</SelectItem>
                  <SelectItem value="5">5+ Years</SelectItem>
                  <SelectItem value="10">10+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {candidates?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Total Candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {candidates?.filter(c => c.job_seeking_status === 'actively_looking').length || 0}
            </div>
            <p className="text-sm text-gray-600">Actively Looking</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {candidates?.filter(c => c.job_seeking_status === 'open_to_offers').length || 0}
            </div>
            <p className="text-sm text-gray-600">Open to Offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {candidates?.filter(c => c.experience_years && c.experience_years >= 5).length || 0}
            </div>
            <p className="text-sm text-gray-600">Senior (5+ Years)</p>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates ({candidates?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates?.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={candidate.avatar_url || undefined} />
                          <AvatarFallback>
                            {candidate.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.full_name || 'No name'}</div>
                          <div className="text-sm text-gray-600">
                            {candidate.current_position} {candidate.current_company && `at ${candidate.current_company}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {candidate.email}
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {candidate.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {candidate.location || 'Not specified'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Briefcase className="h-3 w-3" />
                        {candidate.experience_years ? `${candidate.experience_years} years` : 'Not specified'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(candidate.job_seeking_status)}>
                        {getStatusText(candidate.job_seeking_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {candidate.skills?.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills && candidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {candidate.cv_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(candidate.cv_url!, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                        {candidate.linkedin_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(candidate.linkedin_url!, '_blank')}
                          >
                            LinkedIn
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!candidates?.length && (
            <div className="text-center py-8 text-gray-500">
              No candidates found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCandidates;
