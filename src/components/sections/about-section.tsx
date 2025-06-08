'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Zap, Shield, Globe, Users, Award, TrendingUp, Sparkles, ArrowRight, Target, Lightbulb, Rocket } from 'lucide-react'
import Link from 'next/link'
import {useState} from "react";

export function AboutSection() {
  const features = [
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'AI-powered algorithms match your skills with perfect opportunities'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data is protected with enterprise-grade security standards'
    },
    {
      icon: Rocket,
      title: 'Career Acceleration',
      description: 'Fast-track your career with our proven placement methodology'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Access to international opportunities across multiple industries'
    },
    {
      icon: Users,
      title: 'Personal Support',
      description: '1-on-1 career coaching and interview preparation included'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Focus',
      description: 'Connect with cutting-edge companies leading digital transformation'
    }
  ]

  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)


  return (
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              Why Choose Justera Group
              <Award className="w-4 h-4 ml-2 text-purple-600" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Your Gateway to
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Digital Excellence
            </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              JUSTERA GROUP is an end-to-end IT solutions provider enabling businesses and enterprises in Sweden to harness the power of digital technologies and continuously evolve in today&apos;s fast-changing economy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                  Experience the
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Justera Advantage</span>
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We don&apos;t just find jobs – we craft careers. Our innovative approach combines cutting-edge technology with human expertise to deliver exceptional results that transform professional journeys.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="group"
                      onMouseEnter={() => setHoveredFeature(index)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className={`
                        bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 
                        transform hover:scale-105 border border-gray-100 h-full relative overflow-hidden
                        ${hoveredFeature === index ? 'ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-50 to-purple-50' : ''}
                      `}>
                        {/* Hover overlay effect */}
                        <div className={`
                          absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 
                          transition-opacity duration-500 ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}
                        `}></div>

                        <div className="flex items-start space-x-4 relative z-10">
                          <div className="flex-shrink-0">
                            <div className={`
                              w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl 
                              flex items-center justify-center transition-all duration-300
                              ${hoveredFeature === index ? 'scale-125 rotate-6 shadow-lg' : 'group-hover:scale-110'}
                            `}>
                              <feature.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className={`
                              font-bold mb-2 transition-colors duration-300
                              ${hoveredFeature === index ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}
                            `}>
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {feature.description}
                            </p>
                            {hoveredFeature === index && (
                              <div className="mt-3 text-xs text-blue-600 font-medium animate-fadeIn">
                                ✓ Trusted by industry leaders
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/signin">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative">
              <div className="relative">
                {/* Main Visual Container */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-6">
                    {/* Mock Interface Elements */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-white/80 text-sm font-medium">Justera Portal</div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-yellow-800" />
                          </div>
                          <div>
                            <div className="text-white font-semibold text-sm">Career Growth</div>
                            <div className="text-white/70 text-xs">+125% this year</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full w-4/5"></div>
                        </div>
                      </div>

                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-800" />
                          </div>
                          <div>
                            <div className="text-white font-semibold text-sm">Success Rate</div>
                            <div className="text-white/70 text-xs">98% placement success</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full w-full"></div>
                        </div>
                      </div>

                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                            <Globe className="w-4 h-4 text-blue-800" />
                          </div>
                          <div>
                            <div className="text-white font-semibold text-sm">Global Reach</div>
                            <div className="text-white/70 text-xs">50+ partner companies</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl animate-bounce">
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-bounce delay-1000">
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}