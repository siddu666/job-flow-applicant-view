
import { Badge } from '@/components/ui/badge'

export function IndustriesSection() {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Media', 'Real Estate', 'Transportation',
    'Energy', 'Government', 'Non-Profit', 'Hospitality', 'Agriculture'
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find opportunities across diverse industries and sectors, from emerging startups 
            to established Fortune 500 companies.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {industries.map((industry, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-sm px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
            >
              {industry}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
