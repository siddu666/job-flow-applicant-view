
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Download, Star, MapPin, Clock, DollarSign, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApplicationReview = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const applications = [
    {
      id: 1,
      jobTitle: "Senior Frontend Developer",
      jobId: 1,
      applicantName: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      experience: "5+ years",
      expectedSalary: "$120k - $150k",
      appliedDate: "2024-01-16",
      status: "Pending",
      skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
      portfolioUrl: "https://johndoe.dev",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      githubUrl: "https://github.com/johndoe",
      coverLetter: "I am excited to apply for the Senior Frontend Developer position...",
      cvUrl: "/cv/john-doe-cv.pdf",
      rating: 0,
    },
    {
      id: 2,
      jobTitle: "UX/UI Designer",
      jobId: 2,
      applicantName: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      experience: "3-4 years",
      expectedSalary: "$90k - $110k",
      appliedDate: "2024-01-15",
      status: "Reviewed",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "CSS"],
      portfolioUrl: "https://janesmith.design",
      linkedinUrl: "https://linkedin.com/in/janesmith",
      githubUrl: "",
      coverLetter: "As a passionate UX/UI designer with 4 years of experience...",
      cvUrl: "/cv/jane-smith-cv.pdf",
      rating: 4,
    },
    {
      id: 3,
      jobTitle: "Backend Engineer",
      jobId: 3,
      applicantName: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      experience: "6+ years",
      expectedSalary: "$110k - $140k",
      appliedDate: "2024-01-14",
      status: "Pending",
      skills: ["Python", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
      portfolioUrl: "",
      linkedinUrl: "https://linkedin.com/in/mikejohnson",
      githubUrl: "https://github.com/mikejohnson",
      coverLetter: "I'm writing to express my interest in the Backend Engineer position...",
      cvUrl: "/cv/mike-johnson-cv.pdf",
      rating: 0,
    },
    {
      id: 4,
      jobTitle: "Product Manager",
      jobId: 4,
      applicantName: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+1 (555) 321-0987",
      location: "Remote",
      experience: "7+ years",
      expectedSalary: "$130k - $160k",
      appliedDate: "2024-01-13",
      status: "Shortlisted",
      skills: ["Product Strategy", "Agile", "Analytics", "Leadership", "Roadmapping"],
      portfolioUrl: "https://sarahwilson.pm",
      linkedinUrl: "https://linkedin.com/in/sarahwilson",
      githubUrl: "",
      coverLetter: "With over 7 years of product management experience...",
      cvUrl: "/cv/sarah-wilson-cv.pdf",
      rating: 5,
    },
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesJob = !jobFilter || app.jobTitle.includes(jobFilter);
    const matchesSkill = !skillFilter || app.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesJob && matchesSkill;
  });

  const updateApplicationStatus = (applicationId: number, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus}`,
    });
  };

  const rateApplication = (applicationId: number, rating: number) => {
    toast({
      title: "Rating Saved",
      description: `Application rated ${rating} stars`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Reviewed":
        return "bg-blue-100 text-blue-800";
      case "Shortlisted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const StarRating = ({ rating, onRate }: { rating: number; onRate: (rating: number) => void }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => onRate(star)}
          />
        ))}
      </div>
    );
  };

  if (selectedApplication) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedApplication(null)}
          >
            ← Back to Applications
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download CV
            </Button>
            <Select
              defaultValue={selectedApplication.status}
              onValueChange={(value) => updateApplicationStatus(selectedApplication.id, value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedApplication.applicantName}</CardTitle>
                <CardDescription className="text-lg">
                  Applied for: {selectedApplication.jobTitle}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(selectedApplication.status)}>
                  {selectedApplication.status}
                </Badge>
                <div className="mt-2">
                  <StarRating
                    rating={selectedApplication.rating}
                    onRate={(rating) => rateApplication(selectedApplication.id, rating)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="font-medium">Email:</span> {selectedApplication.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {selectedApplication.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedApplication.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedApplication.experience} experience
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {selectedApplication.expectedSalary}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Online Presence</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedApplication.portfolioUrl && (
                        <div>
                          <span className="font-medium">Portfolio:</span>{" "}
                          <a
                            href={selectedApplication.portfolioUrl}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Portfolio
                          </a>
                        </div>
                      )}
                      {selectedApplication.linkedinUrl && (
                        <div>
                          <span className="font-medium">LinkedIn:</span>{" "}
                          <a
                            href={selectedApplication.linkedinUrl}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                      {selectedApplication.githubUrl && (
                        <div>
                          <span className="font-medium">GitHub:</span>{" "}
                          <a
                            href={selectedApplication.githubUrl}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium">Applied Date:</span> {selectedApplication.appliedDate}
                      </div>
                      <div>
                        <span className="font-medium">Position:</span> {selectedApplication.jobTitle}
                      </div>
                      <div>
                        <span className="font-medium">Experience Level:</span> {selectedApplication.experience}
                      </div>
                      <div>
                        <span className="font-medium">Expected Salary:</span> {selectedApplication.expectedSalary}
                      </div>
                      <div>
                        <span className="font-medium">Current Location:</span> {selectedApplication.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cover-letter">
                <Card>
                  <CardHeader>
                    <CardTitle>Cover Letter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-gray-700">
                      {selectedApplication.coverLetter}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-bold">Job Applications</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Shortlisted">Shortlisted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter by skill..."
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {application.applicantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{application.applicantName}</h3>
                    <p className="text-gray-600">{application.jobTitle}</p>
                    <p className="text-sm text-gray-500">{application.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {application.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {application.experience}
                      </div>
                      <span>Applied: {application.appliedDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {application.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {application.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{application.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                  {application.rating > 0 && (
                    <div className="flex items-center">
                      <StarRating
                        rating={application.rating}
                        onRate={(rating) => rateApplication(application.id, rating)}
                      />
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      CV
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No applications found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;
