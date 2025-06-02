import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AboutSection() {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">About Job Flow</h2>
          <p className="text-xl mb-8 leading-relaxed">
            We're dedicated to connecting talented professionals with amazing opportunities. 
            Our platform combines cutting-edge technology with personalized service to help 
            you navigate your career journey successfully.
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}