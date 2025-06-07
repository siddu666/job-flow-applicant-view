
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Briefcase, Users, Trophy } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <Trophy className="h-4 w-4 mr-2" />
                Powered by Justera Group
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Next
                <span className="text-blue-600 block">Career Move</span>
                Starts Here
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Join thousands of professionals who trust JobFlow to connect them with exceptional 
                career opportunities at leading companies worldwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Explore Opportunities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/apply">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Apply Now
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">Job Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Partner Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Professional Matching</h3>
                    <p className="text-sm text-gray-600">AI-powered job recommendations</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Support</h3>
                    <p className="text-sm text-gray-600">Dedicated career consultants</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Proven Results</h3>
                    <p className="text-sm text-gray-600">Industry-leading placement rates</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3 -z-10 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
