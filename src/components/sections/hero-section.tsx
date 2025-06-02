
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
            <span className="text-blue-600">AI-Powered</span> Precision
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top employers, showcase your skills, and land the perfect role 
            with our intelligent job matching platform designed for modern professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {user ? (
              <Link href="/jobs">
                <Button size="lg" className="text-lg px-8 py-3">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    Explore Jobs
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">10,000+ Active Users</h3>
              <p className="text-gray-600">Join thousands of professionals finding their ideal careers</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5,000+ Job Listings</h3>
              <p className="text-gray-600">Discover opportunities across all industries and experience levels</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">95% Success Rate</h3>
              <p className="text-gray-600">Our AI matching leads to higher interview and placement rates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
