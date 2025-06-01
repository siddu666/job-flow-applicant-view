
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Users, Search, TrendingUp } from 'lucide-react'

export function ServicesSection() {
  const services = [
    {
      icon: Search,
      title: "Job Matching",
      description: "Advanced algorithms to match you with perfect job opportunities"
    },
    {
      icon: Briefcase,
      title: "Career Guidance",
      description: "Professional advice to advance your career goals"
    },
    {
      icon: Users,
      title: "Networking",
      description: "Connect with industry professionals and expand your network"
    },
    {
      icon: TrendingUp,
      title: "Skill Development",
      description: "Resources and recommendations to enhance your skills"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive job search and career development services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
