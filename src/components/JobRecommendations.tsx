
import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useJobRecommendations } from "@/hooks/useJobRecommendations";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Building2, Star, Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

const JobRecommendations = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: recommendedJobs, isLoading } = useJobRecommendations(user?.id, 8);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="text-gray-500">Finding the perfect jobs for you...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recommendedJobs || recommendedJobs.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <TrendingUp className="h-5 w-5" />
              Job Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <p className="text-amber-700 mb-4">No job recommendations available at the moment.</p>
            <p className="text-sm text-amber-600 mb-4">
              Complete your profile with skills, experience, and preferences to get personalized job recommendations.
            </p>
            <Link href="/profile">
              <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100">
                Complete Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Star className="h-6 w-6 text-yellow-500" />
            Recommended Jobs for You
          </CardTitle>
          <p className="text-sm text-indigo-600">
            Based on your skills: {profile?.skills?.slice(0, 3).join(", ")} 
            {profile?.skills && profile.skills.length > 3 && ` and ${profile.skills.length - 3} more`}
          </p>
        </CardHeader>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {recommendedJobs.map((job) => {
          // Parse requirements if it's a string, otherwise use as array
          let requirementsArray: string[] = [];
          if (typeof job.requirements === 'string') {
            try {
              requirementsArray = JSON.parse(job.requirements);
            } catch {
              requirementsArray = job.requirements.split(/[,;]\s*/).filter(req => req.trim());
            }
          } else if (Array.isArray(job.requirements)) {
            requirementsArray = job.requirements;
          }

          const matchPercentage = Math.round(job.match_score);
          const getMatchColor = (score: number) => {
            if (score >= 80) return "text-green-700 bg-green-100 border-green-200";
            if (score >= 60) return "text-blue-700 bg-blue-100 border-blue-200";
            if (score >= 40) return "text-yellow-700 bg-yellow-100 border-yellow-200";
            return "text-gray-700 bg-gray-100 border-gray-200";
          };

          return (
            <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 text-gray-900">{job.title}</CardTitle>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>Justera Group AB</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getMatchColor(matchPercentage)}`}>
                    <Star className="h-3 w-3" />
                    {matchPercentage}% match
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Match Score Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Profile Match</span>
                    <span>{matchPercentage}%</span>
                  </div>
                  <Progress 
                    value={matchPercentage} 
                    className="h-2"
                    style={{
                      background: matchPercentage >= 80 ? '#dcfce7' : 
                                 matchPercentage >= 60 ? '#dbeafe' : 
                                 matchPercentage >= 40 ? '#fef3c7' : '#f3f4f6'
                    }}
                  />
                </div>

                {/* Job Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  {job.experience_level && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {job.experience_level}
                    </div>
                  )}
                </div>

                {/* Salary Range */}
                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {job.salary_min && job.salary_max 
                        ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} SEK`
                        : job.salary_min 
                        ? `From ${job.salary_min.toLocaleString()} SEK`
                        : job.salary_max 
                        ? `Up to ${job.salary_max.toLocaleString()} SEK`
                        : 'Competitive salary'}
                    </span>
                  </div>
                )}

                <p className="text-sm text-gray-700 line-clamp-3">
                  {job.description}
                </p>

                {/* Skills Match */}
                {requirementsArray.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {requirementsArray.slice(0, 4).map((skill: string, index: number) => {
                        const hasSkill = profile?.skills?.some(userSkill => 
                          userSkill.toLowerCase().includes(skill.toLowerCase()) || 
                          skill.toLowerCase().includes(userSkill.toLowerCase())
                        );
                        
                        return (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className={`text-xs ${hasSkill 
                              ? 'bg-green-100 text-green-800 border-green-300' 
                              : 'bg-gray-100 text-gray-600 border-gray-300'
                            }`}
                          >
                            {hasSkill && '✓ '}{skill}
                          </Badge>
                        );
                      })}
                      {requirementsArray.length > 4 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                          +{requirementsArray.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  <Link href={`/apply/${job.id}`}>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Section */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="py-4 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Want to see more opportunities or improve your matches?
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/jobs">
              <Button variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                Browse All Jobs
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                Update Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobRecommendations;
