'use client'

export function AboutSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Our Platform
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We are dedicated to connecting talented professionals with amazing opportunities. 
              Our platform uses cutting-edge technology to match candidates with their ideal roles.
            </p>
            <p className="text-lg text-gray-600">
              With over 10,000 job listings and 50,000 registered users, we've helped countless 
              individuals find their dream careers.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Job Listings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600">Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}