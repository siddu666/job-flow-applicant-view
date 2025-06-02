
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
              We leverage cutting-edge AI technology to create meaningful connections 
              between talented professionals and forward-thinking companies. Our platform 
              goes beyond traditional job boards to offer a comprehensive career development experience.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
          </div>
          
          <div className="lg:pl-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600">Active Job Seekers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Partner Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                  <div className="text-gray-600">Match Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">Platform Availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
