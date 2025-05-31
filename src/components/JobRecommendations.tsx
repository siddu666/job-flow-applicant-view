
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Briefcase, Star } from 'lucide-react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const JobRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { data: recommendations, isLoading } = useJobRecommendations(user?.id);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Recommended Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading recommendations...</p>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Recommended Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No job recommendations found. Complete your profile to get personalized recommendations!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Recommended Jobs for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/jobs/${job.id}/apply`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.experience_level}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={job.match_score >= 80 ? "default" : job.match_score >= 60 ? "secondary" : "outline"}
                  className="mb-2"
                >
                  {job.match_score}% Match
                </Badge>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {job.description.substring(0, 150)}...
            </p>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {job.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.skills.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            <Button 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/jobs/${job.id}/apply`);
              }}
            >
              Apply Now
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default JobRecommendations;
