'use client'

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/useProfile';
import { useJobs } from "@/hooks/useJobs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Target, Loader2, Search, Filter, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Job {
    id: string;
    title: string;
    location: string;
    description: string;
    experience_level: string | null;
    created_at: string | null;
    posted_by?: string | null;
    requirements?: string | null;
    skills?: string[] | null;
    type?: string | null;
    updated_at?: string | null;
}

export default function Jobs() {
    const { user } = useAuth();
    const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
    const { jobs, loading: jobsLoading } = useJobs();

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
    const filteredJobs = jobs?.filter((job) => {
        return (
            (locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
            (skillsFilter ? job.skills?.some(skill => skill.toLowerCase().includes(skillsFilter.toLowerCase())) : true) &&
            (experienceFilter ? job.experience_level?.toLowerCase().includes(experienceFilter.toLowerCase()) : true)
        );
    }) || [];

    // Logic for displaying current jobs
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (!profile) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto my-8"
            >
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
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 p-4"
        >
            <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by location"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="pl-10 p-2 border rounded w-full"
                                />
                            </div>
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by skills"
                                    value={skillsFilter}
                                    onChange={(e) => setSkillsFilter(e.target.value)}
                                    className="pl-10 p-2 border rounded w-full"
                                />
                            </div>
                            <div className="relative flex-grow">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by experience"
                                    value={experienceFilter}
                                    onChange={(e) => setExperienceFilter(e.target.value)}
                                    className="pl-10 p-2 border rounded w-full"
                                />
                            </div>
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
                                        <motion.div
                                            key={job.id}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <Link href={`/jobs/detail?id=${job.id}`}>
                                                <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-indigo-500 cursor-pointer">
                                                    <CardHeader className="pb-4">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex-1">
                                                                <CardTitle className="text-xl text-gray-900 mb-2 flex items-center">
                                                                    <Briefcase className="mr-2" /> {job.title}
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
                                                    <CardContent>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                                                            <div>
                                                                <span className="text-gray-500">Experience Level:</span>
                                                                <div className="font-medium">{job.experience_level || 'Not specified'}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Posted:</span>
                                                                <div className="font-medium flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>
                                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                                  </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex justify-center mt-6">
                                    {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className="mx-1"
                                            variant={currentPage === index + 1 ? "default" : "outline"}
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
