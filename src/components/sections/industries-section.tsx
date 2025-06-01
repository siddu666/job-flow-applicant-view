'use client'

import { Badge } from '@/components/ui/badge'

export function IndustriesSection() {
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Media',
    'Government',
    'Non-profit'
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Industries We Serve
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We connect professionals with opportunities across various industries and sectors.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {industries.map((industry, index) => (
            <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
              {industry}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}