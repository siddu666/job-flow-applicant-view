
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
            Connect with top employers and discover opportunities that match your skills. 
            Our platform streamlines the job application process for both candidates and recruiters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <>
                <Link href="/jobs">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Jobs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Jobs
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">10,000+ Candidates</h3>
              <p className="text-gray-600">Connect with talented professionals</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">5,000+ Jobs</h3>
              <p className="text-gray-600">Opportunities across all industries</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">95% Success Rate</h3>
              <p className="text-gray-600">High placement success</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Find Your Dream Career
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Connect with top employers and discover opportunities that match your skills and aspirations.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
            <Link href="/auth">Sign Up</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
