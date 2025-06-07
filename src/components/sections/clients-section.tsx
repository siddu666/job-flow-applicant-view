
export function ClientsSection() {
  const partners = [
    { name: 'Microsoft', category: 'Technology' },
    { name: 'Amazon', category: 'E-commerce' },
    { name: 'Google', category: 'Technology' },
    { name: 'Apple', category: 'Technology' },
    { name: 'Meta', category: 'Social Media' },
    { name: 'Netflix', category: 'Entertainment' },
    { name: 'Tesla', category: 'Automotive' },
    { name: 'Salesforce', category: 'CRM' }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who have found their dream careers through our platform. 
            We work with the world&apos;s most innovative companies to bring you exceptional opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center mb-16">
          {partners.map((partner, index) => (
            <div key={index} className="text-center group">
              <div className="h-20 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:shadow-md transition-shadow duration-200">
                <span className="text-gray-700 font-semibold text-lg">{partner.name}</span>
              </div>
              <span className="text-sm text-gray-500">{partner.category}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Successful Placements</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
