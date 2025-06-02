'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import { ArrowRight, Users, Briefcase, TrendingUp } from 'lucide-react'

export function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 pt-16 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Dream Job with{' '}
            <span className="text-blue-600">JobFlow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations. Your next career move starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <>
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/jobs">
                    Browse Jobs <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link href="/profile">View Profile</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/auth">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Active Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Briefcase className="h-12 w-12 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5,000+</div>
              <div className="text-gray-600">Job Opportunities</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}