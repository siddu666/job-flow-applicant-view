'use client'

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/useProfile';
import { useJobs } from "@/hooks/useJobs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Target, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Jobs() {
    const { user } = useAuth();
    const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
    const { jobs, loading: jobsLoading } = useJobs();
    
    console.log(jobs);

    // State for filters
    const [locationFilter, setLocationFilter] = useState('');
    const [skillsFilter, setSkillsFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    // Show loading state while data is being fetched
    if (profileLoading || jobsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
        );
    }


    // Filter jobs based on the state filters
    const filteredJobs = jobs?.filter(job => {
        return (
            (locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
            (skillsFilter ? job.skills?.some(skill => skill.toLowerCase().includes(skillsFilter.toLowerCase())) : true) &&
            (experienceFilter ? job.experience_level?.toLowerCase().includes(experienceFilter.toLowerCase()) : true)
        );
    }) || [];

    console.log("file" + JSON.stringify(filteredJobs));


    // Logic for displaying current jobs
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
                <CardContent className="p-6">
                    <div>
                    <div className="p-4">
                        <input
                            type="text"
                            placeholder="Filter by location"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="p-2 border rounded mr-2"
                        />
                        <input
                            type="text"
                            placeholder="Filter by skills"
                            value={skillsFilter}
                            onChange={(e) => setSkillsFilter(e.target.value)}
                            className="p-2 border rounded mr-2"
                        />
                        <input
                            type="text"
                            placeholder="Filter by experience"
                            value={experienceFilter}
                            onChange={(e) => setExperienceFilter(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>

                    {currentJobs.length === 0 ? (
                        <Card className="p-6 text-center">
                            <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                No Jobs Found
                            </h3>
                            <p className="text-blue-700">
                                No jobs match your current filters.
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid gap-6">
                                {currentJobs.map((job) => (
                                    <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-indigo-500">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <CardTitle className="text-xl text-gray-900 mb-2">
                                                        {job.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{job.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-6">
                                            <div>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {job.description}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Experience Level:</span>
                                                    <div className="font-medium">{job.experience_level || 'Not specified'}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Posted:</span>
                                                    <div className="font-medium flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {job.created_at ? new Date(job.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <Link href={`/apply?jobId=${job.id}`}>
                                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                                        Apply Now
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-center mt-4">
                                {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, index) => (
                                    <Button key={index} onClick={() => paginate(index + 1)} className="mx-1">
                                        {index + 1}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                </CardContent>
            </Card>
        );
    }
}
