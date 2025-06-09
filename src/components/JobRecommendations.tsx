'use client'

import { useAuth } from '@/contexts/auth-context'
import { useProfile } from '@/hooks/useProfile'
import { useJobRecommendations } from '@/hooks/useJobRecommendations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Calendar, DollarSign, Building, Users, CheckCircle, AlertCircle, Target } from 'lucide-react'
import Link from 'next/link'

export default function JobRecommendations() {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id)
  const { data: recommendations = [], isLoading, error } = useJobRecommendations(user?.id)

  if (profileLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-lg text-gray-600">Finding your perfect job matches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Unable to Load Recommendations
          </h3>
          <p className="text-red-600">
            We encountered an error while fetching your job recommendations. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Complete Your Profile
          </h3>
          <p className="text-yellow-700 mb-4">
            To get personalized job recommendations, please complete your profile with your skills and preferences.
          </p>
          <Link href="/profile">
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Complete Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (!recommendations.length) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            No Recommendations Yet
          </h3>
          <p className="text-blue-700">
            We're still analyzing the job market for positions that match your profile. Check back soon!
          </p>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />
    if (score >= 60) return <AlertCircle className="h-4 w-4" />
    return <AlertCircle className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
        <div className="flex items-center gap-3 mb-2">
          <Target className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-indigo-900">
            Your Personalized Job Matches
          </h2>
        </div>
        <p className="text-indigo-700">
          Found {recommendations.length} job{recommendations.length !== 1 ? 's' : ''} that match your profile
        </p>
      </div>

      {/* Job Recommendations */}
      <div className="grid gap-6">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.job.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-indigo-500">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <CardTitle className="text-xl text-gray-900 mb-2">
                    {recommendation.job.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{recommendation.job.company_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{recommendation.job.location}</span>
                    </div>
                    {recommendation.job.salary_range && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{recommendation.job.salary_range}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getScoreColor(recommendation.overall_score)} flex items-center gap-1 text-sm font-semibold px-3 py-1`}>
                    {getScoreIcon(recommendation.overall_score)}
                    {recommendation.overall_score}% Match
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Job Description */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {recommendation.job.description}
                </p>
              </div>

              {/* Match Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Why This Job Matches You
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {recommendation.skills_match.score}%
                    </div>
                    <div className="text-sm text-gray-600">Skills Match</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {recommendation.experience_match.score}%
                    </div>
                    <div className="text-sm text-gray-600">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {recommendation.location_match.score}%
                    </div>
                    <div className="text-sm text-gray-600">Location</div>
                  </div>
                </div>

                {/* Detailed Match Explanation */}
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Skills Analysis:</h5>
                    <p className="text-gray-600">{recommendation.skills_match.explanation}</p>
                    {recommendation.skills_match.matching_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recommendation.skills_match.matching_skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Experience Level:</h5>
                    <p className="text-gray-600">{recommendation.experience_match.explanation}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Location:</h5>
                    <p className="text-gray-600">{recommendation.location_match.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Employment Type:</span>
                  <div className="font-medium">{recommendation.job.employment_type || 'Not specified'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Experience Level:</span>
                  <div className="font-medium">{recommendation.job.experience_level || 'Not specified'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Posted:</span>
                  <div className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(recommendation.job.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Applicants:</span>
                  <div className="font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {recommendation.job.application_count || 0}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t">
                <Link href={`/apply?jobId=${recommendation.job.id}`}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}