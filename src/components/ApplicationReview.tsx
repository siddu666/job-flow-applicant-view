import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Eye,
  Download,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApplications } from "@/hooks/useApplications";
import { useJobs } from "@/hooks/useJobs";

const ApplicationReview = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { data: applications = [], isLoading } = useApplications();
  const { data: jobs = [] } = useJobs();

  const getJobById = (jobId) => jobs.find((job) => job.id === jobId);

  const filteredApplications = applications.filter((app) => {
    const job = getJobById(app.job_id);
    const matchesSearch =
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.skills || []).some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesSkill =
        !skillFilter ||
        (app.skills || []).some((skill) =>
            skill.toLowerCase().includes(skillFilter.toLowerCase())
        );

    return matchesSearch && matchesStatus && matchesSkill;
  });

  const updateApplicationStatus = (applicationId, newStatus) => {
    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus}`,
    });
  };

  const rateApplication = (applicationId, rating) => {
    toast({
      title: "Rating Saved",
      description: `Application rated ${rating} stars`,
    });
  };

  const getStatusColor = (status) => {
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

  const StarRating = ({ rating, onRate }) => {
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
          {filteredApplications.map((application) => {
            const job = getJobById(application.job_id);
            return (
                <Card
                    key={application.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedApplication({ ...application, ...job })}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {application.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{application.full_name}</h3>
                        <p className="text-gray-600">{job?.title}</p>
                        <p className="text-sm text-gray-500">{application.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job?.location}
                          </div>
                          <span>Applied: {application.created_at}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {(application.skills || []).slice(0, 4).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                          ))}
                          {application.skills?.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{application.skills.length - 4}
                              </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No applications found matching your criteria.
              </p>
            </div>
        )}
      </div>
  );
};

export default ApplicationReview;
