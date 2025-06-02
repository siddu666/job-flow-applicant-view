import { Badge } from '@/components/ui/badge'

export function IndustriesSection() {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
    'Engineering', 'Design', 'Sales', 'Operations', 'HR'
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
          <p className="text-xl text-gray-600">Find opportunities across various sectors</p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
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