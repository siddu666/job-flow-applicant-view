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
      title: 'Resume Builder',
      description: 'Create professional resumes with our advanced builder tools and templates designed for success.'
    },
    {
      icon: Award,
      title: 'Career Coaching',
      description: 'Personalized career coaching sessions to help you navigate your career path and achieve your goals.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and services to accelerate your job search and career growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}