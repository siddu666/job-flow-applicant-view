'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import JobRecommendations from '@/components/JobRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function RecommendedJobsPage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="container mx-auto p-6">
          {/* How It Works Section */}
          <section className="mb-16">
            <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-800 text-center font-bold">
                  How Our Smart Recommendations Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                  {[
                    { number: '1', title: 'Skills Analysis', description: 'We analyze your technical skills and match them with job requirements', color: 'indigo' },
                    { number: '2', title: 'Experience Matching', description: 'Your experience level is compared with position requirements', color: 'purple' },
                    { number: '3', title: 'Location Preferences', description: 'Jobs are filtered based on your location and remote work preferences', color: 'green' },
                    { number: '4', title: 'Smart Scoring', description: 'Each job gets a compatibility score with detailed explanations', color: 'orange' }
                  ].map((item, index) => (
                      <div key={index} className="space-y-4 p-4">
                        <div className={`w-16 h-16 mx-auto bg-${item.color}-100 rounded-full flex items-center justify-center shadow-md`}>
                          <span className={`text-2xl font-bold text-${item.color}-600`}>{item.number}</span>
                        </div>
                        <h3 className={`font-semibold text-${item.color}-800 text-lg`}>{item.title}</h3>
                        <p className={`text-sm text-${item.color}-600`}>{item.description}</p>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Job Recommendations Component */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Personalized Recommendations</h2>
            <JobRecommendations />
          </section>
        </div>
      </div>
  );
}

export default function JobsPageWithAuth() {
  return (
      <ProtectedRoute requiredRole="applicant">
        <RecommendedJobsPage />
      </ProtectedRoute>
  );
}
