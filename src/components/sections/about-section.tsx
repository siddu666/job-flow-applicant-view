
import { CheckCircle } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About Justera Group AB
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Future Ready IT Solutions for Smarter Businesses
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                We are different from the rest. We are driven by our belief that smarter businesses
                make the world a better place.
                And smarter businesses are ready for the future, today.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Justera Group AB, we are obsessed with consistently delivering intelligent IT
                solutions alongside impeccable services
                that propel businesses into the future.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                From customized Software Development to Cloud Solutions and Services, we offer
                innovative services beyond
                that of the average IT support company to help you leverage technology to your
                competitive advantage.
              </p>
              <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <p className="text-lg font-semibold text-blue-800">
                  We Practice Local Development, NO Overseas Outsource.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
