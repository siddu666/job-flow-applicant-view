"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useJobs } from "@/hooks/useJobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/Loading";
import Link from "next/link";

function JobsPageContent() {
  const { jobs: jobs, loading } = useJobs();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Jobs</h1>
          <Link href="/apply">
            <Button>Apply for Position</Button>
          </Link>
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: any) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{job.location}</Badge>
                    <Badge variant="outline">{job.job_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 line-clamp-3">
                    {job.description}
                  </p>

                  {job.salary_range && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Salary Range
                      </label>
                      <p className="text-lg font-semibold">
                        {job.salary_range}
                      </p>
                    </div>
                  )}

                  {job.required_skills && job.required_skills.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Required Skills
                      </label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.required_skills
                          .slice(0, 3)
                          .map((skill: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {job.required_skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.required_skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Link href={`/apply?job=${job.id}`}>
                      <Button className="w-full">Apply Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">
              No jobs available at the moment
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for new opportunities!
            </p>
            <Link href="/apply">
              <Button>Submit General Application</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <ProtectedRoute allowUnauthenticated={true}>
      <JobsPageContent />
    </ProtectedRoute>
  );
}
