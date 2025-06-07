'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Briefcase, Award, TrendingUp, Sparkles, Globe, Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  const dynamicStats = [
    { number: '500+', label: 'Global Companies', color: 'text-cyan-400' },
    { number: '2000+', label: 'Career Placements', color: 'text-purple-400' },
    { number: '98%', label: 'Success Rate', color: 'text-yellow-400' },
    { number: '15+', label: 'Years Excellence', color: 'text-green-400' }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])
  return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-40 w-64 h-64 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-3000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
              <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
              />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 flex items-center min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-300/30 text-blue-100 px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:scale-105 transition-all duration-300">
                <Award className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent font-semibold">
                Trusted by 500+ Global Companies
              </span>
                <Sparkles className="w-4 h-4 ml-2 text-yellow-400 animate-pulse" />
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                  Elevate Your
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Career Journey
                </span>
                  <span className="block text-4xl md:text-5xl lg:text-6xl mt-2">
                  with{' '}
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Justera Group
                  </span>
                </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl leading-relaxed font-light">
                Connect with world-class opportunities and unlock your potential.
                <span className="text-cyan-300 font-medium"> Your extraordinary career starts here.</span>
              </p>

              {/* Enhanced Stats Row with Dynamic Content */}
              <div className="grid grid-cols-3 gap-6 py-6">
                {dynamicStats.slice(0, 3).map((stat, index) => (
                  <div 
                    key={index}
                    className={`text-center lg:text-left transform transition-all duration-500 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className={`text-3xl font-bold ${stat.color} animate-pulse hover:scale-110 transition-transform duration-300`}>
                      {stat.number}
                    </div>
                    <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-200 text-sm">Live Job Matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
                  <span className="text-blue-200 text-sm">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                  <span className="text-blue-200 text-sm">GDPR Compliant</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link href="/apply">
                  <Button
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white px-10 py-6 text-xl font-bold shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-110 transition-all duration-300 group relative overflow-hidden"
                  >
                  <span className="relative z-10 flex items-center">
                    Start Your Journey
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200 hover:border-cyan-300 backdrop-blur-sm px-10 py-6 text-xl font-bold transition-all duration-300 hover:scale-105 group"
                  >
                    <Globe className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    Explore Opportunities
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start space-x-2 pt-6">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                      <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white/20"
                      />
                  ))}
                </div>
                <div className="flex items-center text-yellow-400 ml-4">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-blue-200 text-sm ml-2">Rated 5.0 by our candidates</span>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative lg:flex hidden items-center justify-center">
              <div className="relative w-96 h-96">
                {/* Central Orb */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-pulse shadow-2xl shadow-blue-500/50"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-blue-900 to-purple-900 rounded-full"></div>
                <div className="absolute inset-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-spin-slow opacity-80"></div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full shadow-lg"></div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-pink-400 rounded-full shadow-lg"></div>
                  <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-7 h-7 bg-green-400 rounded-full shadow-lg"></div>
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-6 h-6 bg-red-400 rounded-full shadow-lg"></div>
                </div>

                {/* Icon in Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-white animate-pulse" />
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20 animate-bounce">
                <Briefcase className="w-6 h-6 text-cyan-400 mb-2" />
                <div className="text-white text-sm font-medium">New Opportunities</div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20 animate-bounce delay-1000">
                <Users className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-white text-sm font-medium">Global Network</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </section>
  )
}

