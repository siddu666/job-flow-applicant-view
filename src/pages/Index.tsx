import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Briefcase, Users, Star, Building, Phone, Mail, MapPin, CheckCircle} from "lucide-react";
import {Link} from "react-router-dom";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {supabase} from "@/integrations/supabase/client";


const Index = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: ''
    });

    const {user, signOut} = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const {data, error} = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (!error && data) {
                        setProfile(data);
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            } else {
                setProfile(null);
            }
        };

        fetchProfile();
    }, [user]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your submission! We will contact you soon.');
        setFormData({fullName: '', email: '', mobile: ''});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navigation */}
            <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Briefcase className="h-8 w-8"/>
                            <span className="text-xl font-bold">Justera Group AB</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-4">
                                        <Link to="/jobs">
                                            <Button>Looking for a Job</Button>
                                        </Link>
                                    </div>
                                    <span className="text-sm text-white-600">
                    Welcome, {user.email}
                  </span>
                                    {profile?.role === 'applicant' && (
                                        <Link to="/profile">
                                            <Button variant="ghost">My Profile</Button>
                                        </Link>
                                    )}
                                    {(profile?.role === 'admin' || profile?.role === 'hr' || profile?.role === 'hiring_manager') && (
                                        <Link to="/admin">
                                            <Button variant="ghost">Admin Panel</Button>
                                        </Link>
                                    )}
                                    <Button variant="ghost" onClick={() => signOut()}>
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/jobs">
                                        <Button>Looking for a Job</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Empowering Businesses with{" "}
                        <span
                            className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Innovative IT Solutions
            </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        At Justera Group AB, we provide cutting-edge IT solutions to help businesses thrive in the
                        digital age.
                    </p>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            About Justera Group AB
                        </h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                                Future Ready IT Solutions for Smarter Businesses
                            </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6">
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    We are different from the rest. We are driven by our belief that smarter businesses
                                    make the world a better place.
                                    And smarter businesses are ready for the future, today.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    At Justera Group AB, we are obsessed with consistently delivering intelligent IT
                                    solutions alongside impeccable services
                                    that propel businesses into the future.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    From customized Software Development to Cloud Solutions and Services, we offer
                                    innovative services beyond
                                    that of the average IT support company to help you leverage technology to your
                                    competitive advantage.
                                </p>
                                <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0"/>
                                    <p className="text-lg font-semibold text-blue-800">
                                        We Practice Local Development, NO Overseas Outsource.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Our Services
                        </h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
                            Comprehensive IT solutions tailored to drive your business forward
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "IT Infrastructure & Integration",
                                description: "Comprehensive IT infrastructure solutions tailored to your business needs."
                            },
                            {
                                title: "Cloud Solutions and Services",
                                description: "Scalable and secure cloud solutions to drive your business forward."
                            },
                            {
                                title: "Software Development",
                                description: "Custom software development to meet your unique business requirements."
                            },
                            {
                                title: "IT Consultancy Services",
                                description: "Expert IT consultancy to guide your technology strategy."
                            },
                            {
                                title: "Information Security Services",
                                description: "Robust security solutions to protect your business data."
                            },
                            {
                                title: "Industry Cyber Security",
                                description: "Advanced cybersecurity measures to safeguard your operations."
                            }
                        ].map((service, index) => (
                            <Card key={index}
                                  className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                                        {service.title}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 leading-relaxed">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industries Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Industries We Serve
                        </h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
                            Delivering specialized solutions across diverse industry sectors
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            "Healthcare",
                            "Finance",
                            "Retail",
                            "Manufacturing",
                            "Education",
                            "Technology"
                        ].map((industry, index) => (
                            <Card key={index}
                                  className="border-0 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <CardHeader className="text-center py-8">
                                    <Building className="h-12 w-12 text-blue-600 mx-auto mb-4"/>
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        {industry}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clients Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Our Clients
                        </h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                        <Users className="h-16 w-16 text-blue-600 mx-auto mb-6"/>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            We have had the privilege of working with a diverse range of clients across various
                            industries,
                            helping them achieve their digital transformation goals and drive business success through
                            innovative IT solutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Get In Touch
                        </h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
                            Ready to transform your business with our innovative IT solutions? Let's discuss your needs.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Consultation</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                If you want to discuss your business with our fine consultants, please schedule a
                                meeting through this contact form.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter your mobile number"
                                    />
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Submit Now
                                </Button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div
                                className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
                                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                            <Phone className="h-6 w-6"/>
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1">Phone</p>
                                            <p className="text-blue-100">+46734852217</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                            <Mail className="h-6 w-6"/>
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1">Email</p>
                                            <p className="text-blue-100">shruti@justeragroup.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                            <MapPin className="h-6 w-6"/>
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1">Address</p>
                                            <p className="text-blue-100 leading-relaxed">
                                                Johannesbergsvagen 60<br/>
                                                191 38 Sollentuna, Sweden
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
                                <h4 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h4>
                                <div className="space-y-2 text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span>9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span>10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span>Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <Briefcase className="h-8 w-8"/>
                        <span className="text-xl font-bold">Justera Group AB</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Empowering businesses with innovative IT solutions
                    </p>
                    <div className="border-t border-gray-700 pt-6">
                        <p className="text-gray-500 text-sm">
                            © 2024 Justera Group AB. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Index;