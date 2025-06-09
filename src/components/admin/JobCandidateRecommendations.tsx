
import React, { useState } from "react";
import { useAllJobsWithCandidateRecommendations, useCandidateRecommendations } from "@/hooks/useCandidateRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  FileText, 
  Star, 
  ChevronDown, 
  ChevronRight, 
  Users,
  Briefcase,
  Target
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Profile } from "@/interfaces/Profile";
import { generateCVSignedUrl } from "@/hooks/useProfile";
import { toast } from "sonner";

const JobCandidateRecommendations = () => {
  const { data: jobs = [], isLoading } = useAllJobsWithCandidateRecommendations();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openJobs, setOpenJobs] = useState<Set<string>>(new Set());

  const { data: recommendedCandidates = [] } = useCandidateRecommendations(selectedJob || undefined, 15);

  const toggleJobOpen = (jobId: string) => {
    const newOpenJobs = new Set(openJobs);
    if (newOpenJobs.has(jobId)) {
      newOpenJobs.delete(jobId);
      if (selectedJob === jobId) {
        setSelectedJob(null);
      }
    } else {
      newOpenJobs.add(jobId);
      setSelectedJob(jobId);
    }
    setOpenJobs(newOpenJobs);
  };

  const getFullName = (candidate: Profile) => {
    return `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Unknown Name';
  };

  const getInitials = (candidate: Profile) => {
    const firstName = candidate.first_name?.[0] || '';
    const lastName = candidate.last_name?.[0] || '';
    return firstName + lastName || 'U';
  };

  const handleCVDownload = async (candidate: Profile, action: 'view' | 'download') => {
    if (!candidate.cv_url) {
      toast.error("No CV available for this candidate");
      return;
    }

    try {
      const signedUrl = await generateCVSignedUrl(candidate.cv_url);
      if (!signedUrl) {
        toast.error("Unable to access CV. Please try again.");
        return;
      }

      if (action === 'view') {
        window.open(signedUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = signedUrl;
        link.download = `${getFullName(candidate)}_CV.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error accessing CV:', error);
      toast.error("Failed to access CV. Please try again.");
    }
  };

  const openCandidateModal = (candidate: Profile) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="text-gray-500">Loading job recommendations...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-indigo-700 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Job-Candidate Matching System
          </CardTitle>
          <p className="text-indigo-600">
            AI-powered candidate recommendations for each job posting based on skills, experience, and location matching.
          </p>
        </CardHeader>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const isOpen = openJobs.has(job.id);
          const candidatesForThisJob = selectedJob === job.id ? recommendedCandidates : [];

          return (
            <Card key={job.id} className="border border-gray-200 hover:border-indigo-300 transition-colors">
              <Collapsible>
                <CollapsibleTrigger 
                  className="w-full"
                  onClick={() => toggleJobOpen(job.id)}
                >
                  <CardHeader className="hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <div className="flex items-center space-x-2">
                          {isOpen ? 
                            <ChevronDown className="h-5 w-5 text-indigo-600" /> : 
                            <ChevronRight className="h-5 w-5 text-indigo-600" />
                          }
                          <Briefcase className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-indigo-800">{job.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {job.experience_level || 'Any level'}
                            </div>
                            {(job.salary_min || job.salary_max) && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary_min && job.salary_max 
                                  ? `${job.salary_min.toLocaleString()}-${job.salary_max.toLocaleString()} SEK`
                                  : job.salary_min 
                                  ? `From ${job.salary_min.toLocaleString()} SEK`
                                  : `Up to ${job.salary_max?.toLocaleString()} SEK`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          <Users className="h-3 w-3 mr-1" />
                          View Matches
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {/* Job Description */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-3">{job.description}</p>
                      {job.skills && job.skills.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-indigo-100 text-indigo-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommended Candidates */}
                    {candidatesForThisJob.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          Recommended Candidates ({candidatesForThisJob.length})
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {candidatesForThisJob.map((candidate) => {
                            const matchPercentage = Math.round(candidate.match_score);
                            
                            return (
                              <Card key={candidate.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    <Avatar className="h-10 w-10 bg-indigo-100">
                                      <AvatarFallback className="text-indigo-600 text-sm">
                                        {getInitials(candidate)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-medium text-sm truncate text-gray-900">
                                          {getFullName(candidate)}
                                        </h4>
                                        <Badge className={`text-xs px-2 py-1 ${getMatchColor(matchPercentage)}`}>
                                          {matchPercentage}%
                                        </Badge>
                                      </div>
                                      
                                      {/* Match Progress */}
                                      <div className="mb-2">
                                        <Progress 
                                          value={matchPercentage} 
                                          className="h-1"
                                        />
                                      </div>

                                      <div className="space-y-1 text-xs text-gray-500 mb-3">
                                        {candidate.current_location && (
                                          <div className="flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {candidate.current_location}
                                          </div>
                                        )}
                                        {candidate.experience_years !== null && (
                                          <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {candidate.experience_years} years exp.
                                          </div>
                                        )}
                                      </div>

                                      {/* Skills match */}
                                      {candidate.skills && candidate.skills.length > 0 && (
                                        <div className="mb-3">
                                          <div className="flex flex-wrap gap-1">
                                            {candidate.skills.slice(0, 2).map((skill, index) => {
                                              const isMatch = job.skills?.some(jobSkill => 
                                                jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                                skill.toLowerCase().includes(jobSkill.toLowerCase())
                                              );
                                              return (
                                                <Badge 
                                                  key={index} 
                                                  variant="outline" 
                                                  className={`text-xs ${isMatch 
                                                    ? 'bg-green-100 text-green-700 border-green-300' 
                                                    : 'bg-gray-100 text-gray-600'
                                                  }`}
                                                >
                                                  {isMatch && '✓ '}{skill}
                                                </Badge>
                                              );
                                            })}
                                            {candidate.skills.length > 2 && (
                                              <Badge variant="outline" className="text-xs">
                                                +{candidate.skills.length - 2}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      <div className="flex flex-wrap gap-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => openCandidateModal(candidate)}
                                          className="text-xs h-7 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                        >
                                          View Profile
                                        </Button>
                                        {candidate.cv_url && (
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleCVDownload(candidate, 'view')}
                                            className="text-xs h-7 border-green-500 text-green-600 hover:bg-green-50"
                                          >
                                            <FileText className="h-3 w-3 mr-1" />
                                            CV
                                          </Button>
                                        )}
                                        {candidate.email && (
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            asChild 
                                            className="text-xs h-7 border-blue-500 text-blue-600 hover:bg-blue-50"
                                          >
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
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No matching candidates found for this job.</p>
                        <p className="text-sm text-gray-400">Try adjusting the job requirements or check back later.</p>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Candidate Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedCandidate && (
          <div className="space-y-4 p-4 max-w-2xl">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-indigo-100">
                <AvatarFallback className="text-lg text-indigo-600">
                  {getInitials(selectedCandidate)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-indigo-800">{getFullName(selectedCandidate)}</h2>
                <p className="text-gray-600">
                  {selectedCandidate.current_position || 'Professional'}
                </p>
                {selectedCandidate.experience_years && (
                  <p className="text-sm text-gray-500">
                    {selectedCandidate.experience_years} years of experience
                  </p>
                )}
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
                      {selectedCandidate.expected_salary_sek.toLocaleString()} SEK expected salary
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

            {selectedCandidate.cv_url && (
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-green-800 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  CV/Resume
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-700">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">CV Available</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCVDownload(selectedCandidate, 'view')}
                      className="border-green-500 text-green-600 hover:bg-green-100"
                    >
                      View CV
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => handleCVDownload(selectedCandidate, 'download')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Download CV
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export { JobCandidateRecommendations };
export default JobCandidateRecommendations;
