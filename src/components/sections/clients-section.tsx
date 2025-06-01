
export function ClientsSection() {
  const clients = [
    'Company A',
    'Company B', 
    'Company C',
    'Company D',
    'Company E',
    'Company F'
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of companies finding top talent through our platform
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {clients.map((client, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-sm p-6 w-full text-center">
                <div className="text-gray-400 font-semibold">
                  {client}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
