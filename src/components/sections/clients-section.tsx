
export function ClientsSection() {
  const partners = [
    { name: 'IKEA', category: 'Retail' },
    { name: 'VOLVO', category: 'Automotive' },
    { name: 'Swedbank', category: 'Banking' },
    { name: 'Nordea', category: 'Banking' },
    { name: 'SEB', category: 'Banking' },
    { name: 'Ericsson', category: 'Telecommunications' },
    { name: 'CEVT', category: 'Automotive Engineering' },
    { name: 'Tetra Pak', category: 'Packaging' }
  ];

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
        
      </div>
    </section>
  )
}
