import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Users, TrendingUp } from 'lucide-react'

export function ServicesSection() {
  const services = [
    {
      icon: Briefcase,
      title: 'Job Matching',
      description: 'Advanced algorithms match you with positions that fit your skills and preferences.',
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Connect with industry professionals and expand your career network.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Access resources and tools to accelerate your professional development.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Everything you need to advance your career</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <service.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
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