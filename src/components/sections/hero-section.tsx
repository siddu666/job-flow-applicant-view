
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
          Your Dream Job
          <span className="text-blue-600"> Awaits</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect with top employers and find opportunities that match your skills and aspirations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/jobs">Find Jobs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
