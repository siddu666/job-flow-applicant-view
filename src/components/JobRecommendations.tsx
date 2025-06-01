
import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useJobRecommendations } from "@/hooks/useJobRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Building2, Star } from "lucide-react";
import Link from "next/link";

const JobRecommendations = () => {
  const { user } = useAuth();
  const { data: recommendedJobs, isLoading } = useJobRecommendations(user?.id, 6);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Loading job recommendations...</p>
        </CardContent>
      </Card>
    );
  }

  if (!recommendedJobs || recommendedJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500 mb-4">No job recommendations available at the moment.</p>
          <p className="text-sm text-gray-400">
            Complete your profile with skills and experience to get personalized job recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Recommended Jobs for You
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>Justera Group AB</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3" />
                  {job.match_score}% match
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {job.type}
                </div>
              </div>

              {job.experience_level && (
                <Badge variant="secondary" className="text-xs">
                  {job.experience_level} level
                </Badge>
              )}

              <p className="text-sm text-gray-700 line-clamp-3">
                {job.description}
              </p>

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="pt-2">
                <Link href={`/apply/${job.id}`}>
                  <Button className="w-full">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="py-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Want to see more opportunities?
          </p>
          <Link href="/jobs">
            <Button variant="outline">
              Browse All Jobs
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobRecommendations;
