
'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function AboutSection() {
  const features: string[] = [
    //'Professional profile optimization',
    //'Career guidance and support'
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Justera?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              JUSTERA GROUP is an end-to-end IT solutions provider which enables our clients – businesses and enterprises in Sweden to harness the power of digital technologies and continuously evolve in today’s fast-changing economy.
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
          
        </div>
      </div>
    </section>
  )
}
