
import React, { useState } from "react"
import { useJobRecommendations, useJobMatchExplanation } from "@/hooks/useJobRecommendations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  ChevronDown, 
  ChevronRight, 
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
  Briefcase,
  Users,
  Clock,
  Award,
  BookOpen
} from "lucide-react"
import Link from "next/link"
import Modal from "@/components/ui/Modal"
import { JobMatch } from "@/hooks/useJobRecommendations"

const JobRecommendations = () => {
  const { data: recommendedJobs = [], isLoading } = useJobRecommendations(15)
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())

  const toggleJobExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedJobs)
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId)
    } else {
      newExpanded.add(jobId)
    }
    setExpandedJobs(newExpanded)
  }

  const openJobDetails = (job: JobMatch) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const getMatchColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 55) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-600 border-gray-200"
  }

  const getMatchIcon = (score: number) => {
    if (score >= 85) return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
    if (score >= 70) return <TrendingUp className="h-4 w-4 text-blue-500" />
    if (score >= 55) return <Target className="h-4 w-4 text-yellow-600" />
    return <Info className="h-4 w-4 text-gray-500" />
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="text-gray-500">Finding perfect job matches for you...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-indigo-700 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Personalized Job Recommendations
          </CardTitle>
          <p className="text-indigo-600">
            AI-powered job matches based on your skills, experience, and preferences. 
            Each recommendation includes detailed explanations to help you understand why it's a good fit.
          </p>
        </CardHeader>
      </Card>

      {/* Statistics */}
      {recommendedJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{recommendedJobs.length}</div>
              <p className="text-sm text-gray-600">Jobs Found</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {recommendedJobs.filter(job => job.match_score >= 85).length}
              </div>
              <p className="text-sm text-gray-600">Excellent Matches</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(recommendedJobs.reduce((sum, job) => sum + job.match_score, 0) / recommendedJobs.length)}%
              </div>
              <p className="text-sm text-gray-600">Average Match</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(recommendedJobs.map(job => job.location)).size}
              </div>
              <p className="text-sm text-gray-600">Locations</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job Recommendations */}
      {recommendedJobs.length > 0 ? (
        <div className="space-y-4">
          {recommendedJobs.map((job) => {
            const isExpanded = expandedJobs.has(job.id)
            const matchReasons = job.match_reasons

            return (
              <Card key={job.id} className="border border-gray-200 hover:border-indigo-300 transition-colors">
                <Collapsible>
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleJobExpansion(job.id)}
                  >
                    <CardHeader className="hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 text-left">
                          <div className="flex items-center space-x-2">
                            {isExpanded ? 
                              <ChevronDown className="h-5 w-5 text-indigo-600" /> : 
                              <ChevronRight className="h-5 w-5 text-indigo-600" />
                            }
                            {getMatchIcon(job.match_score)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-indigo-800">{job.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {job.type}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {job.experience_level || 'Any level'}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`px-3 py-1 ${getMatchColor(job.match_score)}`}>
                            {job.match_score}% Match
                          </Badge>
                          <div className="w-24">
                            <Progress value={job.match_score} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {/* Match Breakdown */}
                      <div className="space-y-4">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Why This Job Matches You
                          </h4>
                          <p className="text-sm text-indigo-700 mb-3">{matchReasons.overall_compatibility}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Skills Match */}
                            <div className="bg-white p-3 rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Skills Match</span>
                                <Badge variant="outline" className="text-xs">
                                  {matchReasons.skills_match.score}%
                                </Badge>
                              </div>
                              <Progress value={matchReasons.skills_match.score} className="h-1 mb-2" />
                              
                              {matchReasons.skills_match.matching_skills.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Your matching skills:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {matchReasons.skills_match.matching_skills.slice(0, 3).map((skill, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {matchReasons.skills_match.matching_skills.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{matchReasons.skills_match.matching_skills.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {matchReasons.skills_match.missing_skills.length > 0 && (
                                <div>
                                  <p className="text-xs text-amber-600 mb-1 flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    Skills to develop:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {matchReasons.skills_match.missing_skills.slice(0, 2).map((skill, index) => (
                                      <Badge key={index} variant="outline" className="text-xs text-amber-700">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {matchReasons.skills_match.missing_skills.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{matchReasons.skills_match.missing_skills.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Location Match */}
                            <div className="bg-white p-3 rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Location</span>
                                <Badge variant="outline" className="text-xs">
                                  {matchReasons.location_match.score}%
                                </Badge>
                              </div>
                              <Progress value={matchReasons.location_match.score} className="h-1 mb-2" />
                              
                              <div className="space-y-1">
                                {matchReasons.location_match.is_preferred && (
                                  <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    In your preferred location
                                  </p>
                                )}
                                {matchReasons.location_match.distance_score >= 70 && (
                                  <p className="text-xs text-blue-600 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    Excellent location match
                                  </p>
                                )}
                                {matchReasons.location_match.distance_score < 70 && (
                                  <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    May require relocation
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Experience Match */}
                            <div className="bg-white p-3 rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Experience</span>
                                <Badge variant="outline" className="text-xs">
                                  {matchReasons.experience_match.score}%
                                </Badge>
                              </div>
                              <Progress value={matchReasons.experience_match.score} className="h-1 mb-2" />
                              
                              <div className="space-y-1">
                                <p className="text-xs text-gray-600">
                                  You: {matchReasons.experience_match.user_experience} years
                                </p>
                                <p className="text-xs text-gray-600">
                                  Required: {matchReasons.experience_match.required_level}
                                </p>
                                {matchReasons.experience_match.is_suitable ? (
                                  <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Great experience fit
                                  </p>
                                ) : (
                                  <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Experience gap exists
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Job Requirements */}
                        {job.skills && job.skills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill, index) => {
                                const isMatched = matchReasons.skills_match.matching_skills.includes(skill)
                                return (
                                  <Badge 
                                    key={index} 
                                    variant={isMatched ? "default" : "outline"}
                                    className={isMatched 
                                      ? "bg-green-100 text-green-800 border-green-300" 
                                      : "border-amber-300 text-amber-700"
                                    }
                                  >
                                    {isMatched && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {skill}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                            <Link href={`/apply?jobId=${job.id}`}>
                              Apply Now
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => openJobDetails(job)}
                            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-purple-500 text-purple-600 hover:bg-purple-50"
                          >
                            Save Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Job Recommendations Found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any jobs matching your profile at the moment. 
              Try updating your skills and preferences to get better recommendations.
            </p>
            <Button asChild variant="outline">
              <Link href="/profile">Update Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Job Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedJob && (
          <div className="space-y-6 p-4 max-w-4xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-indigo-800">{selectedJob.title}</h2>
                <div className="flex items-center gap-4 text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {selectedJob.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedJob.experience_level || 'Any level'}
                  </div>
                </div>
              </div>
              <Badge className={`px-4 py-2 text-lg ${getMatchColor(selectedJob.match_score)}`}>
                {selectedJob.match_score}% Match
              </Badge>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
            </div>

            {selectedJob.requirements && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.requirements}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                <Link href={`/apply?jobId=${selectedJob.id}`}>
                  Apply for This Job
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Save Job
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default JobRecommendations
