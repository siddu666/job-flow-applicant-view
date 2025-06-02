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
              Why Choose JobFlow?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're revolutionizing the job search experience with cutting-edge technology 
              and personalized service. Our platform connects talented professionals with 
              their ideal career opportunities.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Button asChild size="lg">
              <Link href="/auth">Get Started Today</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Join Thousands of Success Stories</h3>
              <p className="text-blue-100 mb-6">
                "JobFlow helped me find my dream job in just 2 weeks. The AI matching 
                technology is incredible!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-blue-200 text-sm">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}