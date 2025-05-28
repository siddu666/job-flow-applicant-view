import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, DollarSign, Search, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/hooks/useJobs";

const Jobs = () => {
  const { user, signOut } = useAuth();
  const { data: jobs = [], isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const swedishCities = [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro",
    "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå",
    "Gävle", "Borås", "Eskilstuna", "Karlstad", "Täby", "Remote (Sweden)"
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.includes(locationFilter);
    const matchesType = !typeFilter || job.type === typeFilter;

    return matchesSearch && matchesLocation && matchesType;
  });

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading IT opportunities...</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">Justera Group AB</span>
                <p className="text-xs text-gray-600">IT Careers in Sweden</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white-600">Welcome, {user.email}</span>
                  {user.id != "dbc5e54a-8ba0-49cb-84c2-57ac5dfb8858" && (
                      <Link to="/profile">
                        <Button variant="ghost">My Profile</Button>
                      </Link>
                  )}
                  {user.id == "dbc5e54a-8ba0-49cb-84c2-57ac5dfb8858" && (
                    <Link to="/admin">
                      <Button variant="ghost">Admin Panel</Button>
                    </Link>
                  )}
                  <Button variant="ghost" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">IT Careers at Justera Group AB</h1>
            <p className="text-xl text-gray-600 mb-2">Future Ready IT Solutions for Smarter Businesses</p>
            <p className="text-gray-500">Join our team of IT professionals in Sweden</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Search IT positions, technologies, skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location in Sweden" />
                </SelectTrigger>
                <SelectContent>
                  {swedishCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2 text-blue-900">{job.title}</CardTitle>
                        <CardDescription className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Justera Group AB
                        </CardDescription>
                      </div>
                      {user ? (
                          <Link to={`/apply/${job.id}`}>
                            <Button className="bg-blue-600 hover:bg-blue-700">Apply Now</Button>
                          </Link>
                      ) : (
                          <Link to="/auth">
                            <Button className="bg-blue-600 hover:bg-blue-700">Sign In to Apply</Button>
                          </Link>
                      )}
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
                      {job.salary_range && (
                          <div className="flex items-center gap-1">
                            SEK {job.salary_range}
                          </div>
                      )}
                      <div className="ml-auto text-gray-500">
                        {new Date(job.created_at).toLocaleDateString('sv-SE')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No IT positions found matching your criteria.</p>
                <p className="text-gray-400">Check back soon for new opportunities at Justera Group AB!</p>
              </div>
          )}

          {/* Company Info */}
          <div className="mt-16 bg-blue-50 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">About Justera Group AB</h2>
              <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
                We are driven by our belief that smarter businesses make the world a better place.
                At Justera Group, we deliver intelligent IT solutions alongside impeccable services
                that propel businesses into the future. Join our team in Sweden and be part of the future of IT.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span>📧 shruti@justeragroup.com</span>
                <span>📞 +46734852217</span>
                <span>📍 Johannesbergsvagen 60, 191 38 Sollentuna, Sweden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Jobs;