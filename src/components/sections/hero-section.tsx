'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream Job
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with top employers and accelerate your career
          </p>
          <div className="space-x-4">
            <Link href="/auth">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}