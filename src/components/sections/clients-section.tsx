export function ClientsSection() {
  const clients = [
    'TechCorp', 'InnovateInc', 'GlobalSoft', 'FutureTech', 'DevStudio'
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Leading Companies</h2>
          <p className="text-xl text-gray-600">Join thousands of professionals who found their dream jobs</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
          {clients.map((client, index) => (
            <div key={index} className="text-center">
              <div className="h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-semibold">{client}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}