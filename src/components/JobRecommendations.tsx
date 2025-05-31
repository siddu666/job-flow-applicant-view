'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Briefcase, Star } from 'lucide-react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

const JobRecommendations = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { data: recommendations = [], isLoading } = useJobRecommendations(user?.id);

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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Recommended Jobs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No job recommendations yet</p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/jobs')}
            >
              Browse All Jobs
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{rec.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(rec.match_score)}% match
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {rec.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {rec.type}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => router.push(`/jobs/${rec.id}/apply`)}
                >
                  Apply Now
                </Button>
              </div>
            ))}

            {recommendations.length > 3 && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/jobs')}
              >
                View All Recommendations ({recommendations.length})
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobRecommendations;