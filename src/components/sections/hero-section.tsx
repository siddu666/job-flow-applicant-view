
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="section-padding bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Empowering Businesses with{" "}
          <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Innovative IT Solutions
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          At Justera Group AB, we provide cutting-edge IT solutions to help businesses thrive in the
          digital age.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/jobs">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              If you are looking for IT Career at Justera Group AB
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
