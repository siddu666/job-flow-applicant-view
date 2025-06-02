
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
              We're not just another job board. JobFlow is a comprehensive platform 
              that streamlines the entire job search and recruitment process, making 
              it easier for talented professionals to connect with forward-thinking companies.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <Link href="/auth">
              <Button size="lg">
                Get Started Today
              </Button>
            </Link>
          </div>
          
          <div className="lg:pl-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600">Active Candidates</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">5K+</div>
                  <div className="text-gray-600">Open Positions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                  <div className="text-gray-600">Partner Companies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export function AboutSection() {
  const features = [
    'Advanced AI matching technology',
    'Comprehensive skill assessments',
    'Industry expert mentorship',
    'Real-time job market insights',
    'Professional development resources',
    'Secure and confidential platform'
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">About Our Platform</h2>
            <p className="text-gray-600 mb-8 text-lg">
              We are dedicated to revolutionizing the job search experience by connecting 
              talented professionals with their ideal career opportunities. Our platform 
              leverages cutting-edge technology and human expertise to create meaningful 
              professional connections.
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="lg:ml-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600">Active Jobs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                  <div className="text-gray-600">Professionals</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Companies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
