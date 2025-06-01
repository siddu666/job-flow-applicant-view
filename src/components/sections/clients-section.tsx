'use client'

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
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Companies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who have found their dream jobs through our platform.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {clients.map((client, index) => (
            <div key={index} className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <span className="text-gray-600 font-medium">{client}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}