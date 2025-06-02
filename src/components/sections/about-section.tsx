
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
              Your Career Success is Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              At JobFlow, we're revolutionizing the way professionals find their dream jobs. 
              Our platform combines cutting-edge technology with personalized career guidance 
              to help you achieve your professional goals.
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
              <Button size="lg">
                Start Your Journey
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose JobFlow?</h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Smart Matching</h4>
                  <p className="text-sm opacity-90">Our AI analyzes your skills and preferences to find the perfect job matches.</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Expert Support</h4>
                  <p className="text-sm opacity-90">Get personalized career advice from industry professionals.</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Direct Access</h4>
                  <p className="text-sm opacity-90">Connect directly with hiring managers and decision makers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
