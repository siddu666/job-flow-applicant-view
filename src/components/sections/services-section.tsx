
'use client'

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
      title: 'Application Support',
      description: 'Comprehensive support throughout the application process, from initial submission to final interview.'
    },
    {
      icon: Award,
      title: 'Career Development',
      description: 'Access to training resources and career development tools to help you grow professionally.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive job search solutions designed to help you succeed in the Swedish job market
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
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
