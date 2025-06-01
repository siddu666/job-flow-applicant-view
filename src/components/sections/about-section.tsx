'use client'

export function AboutSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Justera Group
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We are a leading technology company specializing in innovative IT solutions. 
              Our mission is to connect talented professionals with exciting career opportunities 
              while helping businesses find the right talent to drive their success.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              With years of experience in the industry, we understand the challenges both 
              job seekers and employers face. Our platform bridges this gap with cutting-edge 
              technology and personalized service.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">500+</h3>
                <p className="text-gray-600">Jobs Posted</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">1000+</h3>
                <p className="text-gray-600">Successful Placements</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Expert career guidance
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Exclusive job opportunities
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Personalized matching
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  24/7 support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}