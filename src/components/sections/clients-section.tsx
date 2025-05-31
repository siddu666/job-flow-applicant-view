
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
