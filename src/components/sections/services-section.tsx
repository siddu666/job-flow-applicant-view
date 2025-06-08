'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Server,
  Cloud,
  Code,
  HelpCircle,
  Shield,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Award,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export function ServicesSection() {

  const services = [
    {
      icon: Server,
      title: 'IT Infrastructure & Integration',
      description: 'Design, deploy, and manage robust IT infrastructure solutions tailored for business efficiency and scalability.',
      features: ['System Architecture', 'Network Design', 'Integration Services'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions & Services',
      description: 'Leverage cloud technologies to scale, secure, and streamline your operations with cutting-edge solutions.',
      features: ['Cloud Migration', 'DevOps Services', 'Infrastructure as Code'],
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-gradient-to-r from-purple-500 to-indigo-500'
    },
    {
      icon: Code,
      title: 'Software Development',
      description: 'Custom software solutions to meet complex business challenges and accelerate your digital transformation.',
      features: ['Full-Stack Development', 'Mobile Apps', 'API Integration'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      icon: HelpCircle,
      title: 'IT Consultancy Services',
      description: 'Expert IT advisory to align your technology strategy with business objectives and drive growth.',
      features: ['Strategic Planning', 'Technology Assessment', 'Digital Transformation'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Information Security',
      description: 'Protect your data and systems with comprehensive cybersecurity and compliance frameworks.',
      features: ['Security Audits', 'Compliance Management', 'Risk Assessment'],
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      iconBg: 'bg-gradient-to-r from-teal-500 to-cyan-500'
    },
    {
      icon: AlertTriangle,
      title: 'Industry Cybersecurity',
      description: 'Sector-specific cybersecurity solutions to guard against evolving digital threats and vulnerabilities.',
      features: ['Threat Detection', 'Incident Response', 'Security Training'],
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      iconBg: 'bg-gradient-to-r from-pink-500 to-rose-500'
    }
  ];

  return (
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-4000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
              <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
              />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-300/30 text-blue-100 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
              Our Premium Services
              <Award className="w-4 h-4 ml-2 text-purple-400" />
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Comprehensive
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              IT Solutions
            </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive IT solutions and digital transformation services tailored for Swedish enterprises. 
              From cloud migration to cybersecurity, we deliver cutting-edge technology solutions that drive 
              measurable business outcomes and competitive advantage.
            </p>

            {/* Stats Bar */}
            <div className="flex justify-center items-center space-x-8 mt-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-cyan-400" />
                500+ Projects Delivered
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                98% Client Satisfaction
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                24/7 Support
              </div>
            </div>
          </div>

          {/* Enhanced Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                  <Card
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <CardHeader className="relative z-10">
                      <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-2xl`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-white text-center group-hover:text-cyan-300 transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 space-y-4">
                      <CardDescription className="text-gray-300 text-center leading-relaxed">
                        {service.description}
                      </CardDescription>

                      {/* Feature List */}
                      <div className="space-y-2 pt-4">
                        {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm text-gray-400">
                              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                              {feature}
                            </div>
                        ))}
                      </div>

                      {/* Success Metrics */}
                      <div className="pt-4 border-t border-white/10">
                        <div className="text-xs text-gray-400 mb-2">Success Metrics:</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-green-400">99% Uptime</span>
                          <span className="text-blue-400">50+ Projects</span>
                          <span className="text-purple-400">24/7 Support</span>
                        </div>
                      </div>

                      {/* Learn More Button */}
                      <div className="pt-4">
                        <Button
                            variant="ghost"
                            className="w-full text-cyan-300 hover:text-white hover:bg-white/10 transition-all duration-300 group/btn"
                        >
                          Get Free Consultation
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              )
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-gray-300 mb-8 text-lg">
                Let&apos;s discuss how our comprehensive IT solutions can accelerate your digital transformation journey
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}