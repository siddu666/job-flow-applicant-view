'use client';

import { useAuth } from '@/contexts/auth-context';
import {ProtectedRoute} from '@/components/ProtectedRoute';
import JobRecommendations from '@/components/JobRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Sparkles } from 'lucide-react';

function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Job Recommendations</h1>
            <div className="p-3 bg-purple-100 rounded-full">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover opportunities tailored specifically for you. Our AI analyzes your skills, 
            experience, and preferences to recommend the perfect job matches.
          </p>
        </div>

        {/* How It Works */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-800 text-center">
              How Our Smart Recommendations Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="font-semibold text-indigo-800">Skills Analysis</h3>
                <p className="text-sm text-indigo-600">
                  We analyze your technical skills and match them with job requirements
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold text-purple-800">Experience Matching</h3>
                <p className="text-sm text-purple-600">
                  Your experience level is compared with position requirements
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold text-green-800">Location Preferences</h3>
                <p className="text-sm text-green-600">
                  Jobs are filtered based on your location and remote work preferences
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-semibold text-orange-800">Smart Scoring</h3>
                <p className="text-sm text-orange-600">
                  Each job gets a compatibility score with detailed explanations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Recommendations Component */}
        <JobRecommendations />
      </div>
    </div>
  );
}

export default function JobsPageWithAuth() {
  return (
    <ProtectedRoute requiredRole="candidate">
      <JobsPage />
    </ProtectedRoute>
  );
}