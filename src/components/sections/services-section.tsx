
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, UserCheck, FileText, Award } from 'lucide-react'

export function ServicesSection() {
  const services = [
    {
      icon: Search,
      title: 'Job Matching',
      description: 'AI-powered job matching that connects you with the perfect opportunities based on your skills and preferences.'
    },
    {
      icon: UserCheck,
      title: 'Profile Optimization',
      description: 'Get expert guidance on optimizing your profile to stand out to employers and increase your chances.'
    },
    {
      icon: FileText,
      title: 'Application Tracking',
      description: 'Track all your applications in one place and get real-time updates on your application status.'
    },
    {
      icon: Award,
      title: 'Skill Assessment',
      description: 'Validate your skills with our comprehensive assessment tools and showcase your expertise.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions to help you succeed in your job search journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
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
