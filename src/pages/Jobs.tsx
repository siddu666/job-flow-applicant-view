
'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useJobs } from "@/hooks/useJobs";
import { Building, MapPin, Calendar, DollarSign, Search, Filter } from "lucide-react";

const Jobs = () => {
  const { user, signOut } = useAuth();
  const { data: jobs, isLoading } = useJobs();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || job.location === locationFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesExperience = experienceFilter === "all" || job.experience_level === experienceFilter;
    
    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">Justera Group AB</span>
                <p className="text-xs text-gray-600">IT Careers in Sweden</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/profile">
                    <Button variant="outline" size="sm">My Profile</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            IT Career Opportunities in Sweden
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exciting technology roles at Justera Group AB. Join our team of innovative professionals shaping the future of IT in Sweden.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Perfect Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search job titles, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Stockholm">Stockholm</SelectItem>
                  <SelectItem value="Gothenburg">Gothenburg</SelectItem>
                  <SelectItem value="Malmö">Malmö</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> of <span className="font-semibold">{jobs?.length || 0}</span> positions
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No positions found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("all");
                  setTypeFilter("all");
                  setExperienceFilter("all");
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-blue-900 mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-gray-900">
                        Justera Group AB
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {job.type}
                      </Badge>
                      {job.experience_level && (
                        <div className="text-sm text-gray-600 capitalize">
                          {job.experience_level} level
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary_range}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {job.description}
                  </p>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 5).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Link href={`/apply/${job.id}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Apply Now
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        {filteredJobs.length > 0 && (
          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join Justera Group AB and be part of a dynamic team that's driving innovation in the Swedish IT landscape. 
                We offer competitive compensation, growth opportunities, and a collaborative work environment.
              </p>
              <div className="flex justify-center gap-4">
                {!user && (
                  <Link href="/auth">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Create Account
                    </Button>
                  </Link>
                )}
                <Link href="/profile">
                  <Button variant="outline" size="lg">
                    Complete Your Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Jobs;
