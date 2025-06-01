
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Find Your Dream Job Today
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Connect with top employers and discover opportunities that match your skills and aspirations.
        </p>
        <div className="space-x-4">
          <Link href="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
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
    </section>
  )
}
