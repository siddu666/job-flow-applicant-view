
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, DollarSign, Search } from "lucide-react";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      postedDate: "2 days ago",
      description: "We're looking for a senior frontend developer to join our growing team...",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "New York, NY",
      type: "Full-time",
      salary: "$80k - $110k",
      skills: ["Figma", "Adobe Creative Suite", "User Research"],
      postedDate: "1 week ago",
      description: "Join our creative team to design beautiful and intuitive user experiences...",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataFlow Systems",
      location: "Remote",
      type: "Contract",
      salary: "$100k - $130k",
      skills: ["Node.js", "PostgreSQL", "AWS"],
      postedDate: "3 days ago",
      description: "Build scalable backend systems for our data processing platform...",
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateLabs",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$110k - $140k",
      skills: ["Product Strategy", "Agile", "Analytics"],
      postedDate: "5 days ago",
      description: "Lead product development and strategy for our flagship products...",
    },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !locationFilter || job.location.includes(locationFilter);
    const matchesType = !typeFilter || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CareerHub</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="outline">Admin Portal</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Next Opportunity</h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Austin">Austin</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-gray-900">
                      {job.company}
                    </CardDescription>
                  </div>
                  <Link to={`/apply/${job.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">Apply Now</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="ml-auto text-gray-500">{job.postedDate}</div>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
