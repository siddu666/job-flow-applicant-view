
'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function AboutSection() {
  const features = [
    'Advanced AI-powered job matching',
    'Real-time application tracking',
    'Professional profile optimization',
    'Direct employer connections',
    'Skill assessment tools',
    'Career guidance and support'
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We leverage cutting-edge AI technology to match you with the perfect job opportunities. 
              Our platform is designed to make your job search efficient, effective, and successful.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Your Journey
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">85%</h3>
                  <p className="text-gray-600">Match Success Rate</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">24h</h3>
                  <p className="text-gray-600">Average Response Time</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-purple-600 mb-2">1000+</h3>
                  <p className="text-gray-600">Job Placements</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">4.9★</h3>
                  <p className="text-gray-600">User Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
