
import { Badge } from '@/components/ui/badge'

export function IndustriesSection() {
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Engineering',
    'Design',
    'Operations',
    'Human Resources',
    'Legal',
    'Consulting'
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find opportunities across various industries and sectors
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {industries.map((industry, index) => (
            <Badge key={index} variant="secondary" className="text-lg py-2 px-4">
              {industry}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
