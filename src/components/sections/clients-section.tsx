
import { Users } from 'lucide-react'

export function ClientsSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container text-center">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Clients
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <Users className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We have had the privilege of working with a diverse range of clients across various
            industries,
            helping them achieve their digital transformation goals and drive business success through
            innovative IT solutions.
          </p>
        </div>
      </div>
    </section>
  )
}
export function ClientsSection() {
  const clients = ['Company A', 'Company B', 'Company C', 'Company D', 'Company E', 'Company F']

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Leading Companies</h2>
          <p className="text-xl text-gray-600">
            Join thousands of companies that trust us with their hiring needs
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {clients.map((client, index) => (
            <div key={index} className="bg-gray-100 h-20 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-semibold">{client}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
