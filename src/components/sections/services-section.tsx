'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Users, Search, TrendingUp } from 'lucide-react'

export function ServicesSection() {
  const services = [
    {
      icon: Search,
      title: 'Job Search',
      description: 'Find the perfect job that matches your skills and career goals.'
    },
    {
      icon: Users,
      title: 'Talent Matching',
      description: 'Connect with top employers looking for your expertise.'
    },
    {
      icon: Briefcase,
      title: 'Career Development',
      description: 'Access resources and tools to advance your career.'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Stay updated with the latest job market trends and salary data.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive solutions to help you find the perfect job and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-blue-600" />
                </div>
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