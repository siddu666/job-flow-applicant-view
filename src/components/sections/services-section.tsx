
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
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
]

export function ServicesSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container">
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
          {services.map((service, index) => (
            <Card key={index} className="border-0 bg-white shadow-lg card-hover">
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
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Users, Search, TrendingUp } from 'lucide-react'

export function ServicesSection() {
  const services = [
    {
      icon: Search,
      title: 'Job Search',
      description: 'Find opportunities that match your skills and career goals.'
    },
    {
      icon: Users,
      title: 'Talent Matching',
      description: 'Connect with candidates using our AI-powered matching system.'
    },
    {
      icon: Briefcase,
      title: 'Career Development',
      description: 'Get guidance and resources to advance your career.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Track your application progress and success metrics.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">
            Everything you need to succeed in your job search
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <service.icon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
