
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Building } from 'lucide-react'

const industries = [
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Technology"
]

export function IndustriesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Industries We Serve
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Delivering specialized solutions across diverse industry sectors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <Card key={index} className="border-0 bg-gradient-to-br from-blue-50 to-white shadow-lg card-hover">
              <CardHeader className="text-center py-8">
                <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {industry}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
import { Badge } from '@/components/ui/badge'

export function IndustriesSection() {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Marketing', 'Sales', 'Design', 'Engineering', 'Legal'
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
          <p className="text-xl text-gray-600">
            Find opportunities across diverse industries
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
