"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function JobManagement() {
  const swedishCities = [
    'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping',
    'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås', 'Eskilstuna'
  ];

  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML/CSS',
    'TypeScript', 'AWS', 'Docker', 'Git', 'MongoDB', 'PostgreSQL', 'REST APIs',
    'GraphQL', 'Redux', 'Vue.js', 'Angular', 'Express.js', 'Django', 'Flask',
    'Spring Boot', 'Kubernetes', 'Jenkins', 'CI/CD', 'Agile', 'Scrum',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving'
  ];

  const { user } = useAuth();
  const { jobs: jobs, loading, error } = useJobs();
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    requirements: '',
    skills: [] as string[],
    experience_level: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    const jobData = {
      ...formData,
      posted_by: user.id,
    };

    try {
      if (editingJobId) {
        await updateJobMutation.mutateAsync({ id: editingJobId, updates: jobData });
        toast.success("Job updated successfully!");
      } else {
        await createJobMutation.mutateAsync(jobData);
        toast.success("Job added successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error("Failed to submit job. Please try again.");
    }
  };

  const handleEdit = (jobId: string) => {
    const jobToEdit = jobs?.find(job => job.id === jobId);
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title,
        description: jobToEdit.description,
        location: jobToEdit.location,
        type: jobToEdit.type,
        requirements: jobToEdit.requirements,
        skills: jobToEdit.skills || [],
        experience_level: jobToEdit.experience_level || '',
      });
      setEditingJobId(jobId);
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJobMutation.mutateAsync(jobId);
      toast.success("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      type: '',
      requirements: '',
      skills: [],
      experience_level: '',
    });
    setEditingJobId(null);
  };

  if (loading) return <div className="text-center py-8">Loading jobs, please wait...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading jobs. Please try again later.</div>;

  return (
      <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Job Management Dashboard</h1>

        <Card className="mb-8 shadow-lg border border-indigo-100">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-2xl font-semibold text-indigo-700">{editingJobId ? 'Edit Job' : 'Add New Job'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-600">Job Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-600">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)} required>
                    <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {swedishCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-600">Job Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)} required>
                    <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience_level" className="text-gray-600">Experience Level</Label>
                  <Select value={formData.experience_level} onValueChange={(value) => handleInputChange('experience_level', value)}>
                    <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry Level">Entry Level</SelectItem>
                      <SelectItem value="Mid Level">Mid Level</SelectItem>
                      <SelectItem value="Senior Level">Senior Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="skills" className="text-gray-600">Skills</Label>
                <div className="flex space-x-2">
                  <Select onValueChange={(value) => addSkill(value)}>
                    <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonSkills.map((skill) => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800 flex items-center gap-1">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-600">Job Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} required className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-gray-600">Requirements</Label>
                <Textarea id="requirements" value={formData.requirements} onChange={(e) => handleInputChange('requirements', e.target.value)} required className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]" />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 flex-1">{editingJobId ? 'Update Job' : 'Add Job'}</Button>
                {editingJobId && <Button type="button" variant="outline" onClick={resetForm} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-indigo-100">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-2xl font-semibold text-indigo-700">Job Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs?.length ? jobs.map((job) => (
                  <Card key={job.id} className="shadow-sm border border-indigo-50">
                    <CardHeader>
                      <CardTitle className="text-xl font-medium text-indigo-800">{job.title}</CardTitle>
                      <CardDescription className="text-indigo-600">{job.location}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(job.id)} className="border-indigo-500 text-indigo-500 hover:bg-indigo-50">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(job.id)} className="border-red-500 text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
              )) : <p className="text-center text-gray-500">No jobs available.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

export default JobManagement;
