
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Server,          // for Infrastructure
  Cloud,           // for Cloud Services
  Code,            // for Software Development
  HelpCircle,      // for IT Consultancy
  Shield,          // for Info Security
  AlertTriangle    // for Cybersecurity
} from 'react-feather';

export function ServicesSection() {
  
  const services = [
    {
      icon: Server,
      title: 'IT Infrastructure & Integration',
      description: 'Design, deploy, and manage robust IT infrastructure solutions tailored for business efficiency.'
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions and Services',
      description: 'Leverage cloud technologies to scale, secure, and streamline your operations and services.'
    },
    {
      icon: Code,
      title: 'Software Development',
      description: 'Custom software solutions to meet complex business challenges and accelerate digital growth.'
    },
    {
      icon: HelpCircle,
      title: 'IT Consultancy Services',
      description: 'Expert IT advisory to align your tech strategy with your business objectives.'
    },
    {
      icon: Shield,
      title: 'Information Security Services',
      description: 'Protect your data and systems with comprehensive cybersecurity and compliance services.'
    },
    {
      icon: AlertTriangle,
      title: 'Industry Cyber Security',
      description: 'Sector-specific cybersecurity solutions to guard against evolving digital threats.'
    }
  ];

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
