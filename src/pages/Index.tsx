import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Star, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, signOut } = useAuth();

  const stats = [
    { label: "Active Jobs", value: "150+", icon: Briefcase },
    { label: "Registered Candidates", value: "5000+", icon: Users },
    { label: "Companies", value: "200+", icon: Building },
    { label: "Success Rate", value: "95%", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CareerHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/jobs">
                <Button variant="ghost">Browse Jobs</Button>
              </Link>
              {user ? (
                <>
                  <Link to="/admin">
                    <Button variant="outline">Admin Portal</Button>
                  </Link>
                  <Button variant="ghost" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your <span className="text-blue-600">Dream Career</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with top companies and discover opportunities that match your skills and aspirations. 
            Join thousands of professionals who found their perfect job through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Explore Jobs
              </Button>
            </Link>
            {user ? (
              <Link to="/admin">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  Post a Job
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  Join Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose CareerHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Our AI-powered system matches you with jobs that fit your skills and career goals.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Briefcase className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Top Companies</CardTitle>
                <CardDescription>
                  Access exclusive opportunities from leading companies across various industries.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Star className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Expert Support</CardTitle>
                <CardDescription>
                  Get personalized career guidance from our team of experienced recruiters.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
