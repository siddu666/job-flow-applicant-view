'use client'

import { useSearchParams } from 'next/navigation'
import { useJobs } from "@/hooks/useJobs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Briefcase, User, FileText, Code, Clock, RefreshCw, ArrowLeft } from 'lucide-react';
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

export default function JobDetail() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('id');
    const { jobs, loading: jobsLoading } = useJobs();

    if (jobsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const job = jobs?.find((job: Job) => job.id === jobId);

    if (!job) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
                <p className="text-gray-600">The job you are looking for does not exist.</p>
                <Link href="/jobs" className="mt-4">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 p-4"
        >
            <Card className="max-w-4xl mx-auto my-8 shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl font-bold mb-2">{job.title}</CardTitle>
                            <div className="flex items-center gap-2 text-indigo-100">
                                <MapPin className="h-5 w-5" />
                                <span>{job.location}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                            <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                            Description
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-justify">
                            {job.description}
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center">
                                <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
                                <h3 className="text-gray-600 font-medium">Experience Level</h3>
                            </div>
                            <p className="font-medium mt-1">{job.experience_level || 'Not specified'}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center">
                                <User className="h-5 w-5 text-indigo-600 mr-2" />
                                <h3 className="text-gray-600 font-medium">Posted By</h3>
                            </div>
                            <p className="font-medium mt-1">{job.posted_by || 'Not specified'}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                                <h3 className="text-gray-600 font-medium">Posted On</h3>
                            </div>
                            <p className="font-medium mt-1">
                                {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Not specified'}
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                                <h3 className="text-gray-600 font-medium">Job Type</h3>
                            </div>
                            <p className="font-medium mt-1">{job.type || 'Not specified'}</p>
                        </motion.div>
                    </div>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                            <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                            Requirements
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-justify">
                            {job.requirements || 'No specific requirements listed.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                            <Code className="h-5 w-5 text-indigo-600 mr-2" />
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills && job.skills.length > 0 ? (
                                job.skills.map((skill, index) => (
                                    <motion.span
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full"
                                    >
                                        {skill}
                                    </motion.span>
                                ))
                            ) : (
                                <p className="text-gray-500">No specific skills required.</p>
                            )}
                        </div>
                    </section>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="pt-4 border-t"
                    >
                        <Link href={`/apply?jobId=${job.id}`} className="block">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg">
                                Apply Now
                            </Button>
                        </Link>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
