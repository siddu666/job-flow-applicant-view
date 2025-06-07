'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Building2, Code, Heart, GraduationCap, Factory, ShoppingCart, Users, Camera, Home, Truck, Zap, Shield, HandHeart, Coffee, Wheat } from 'lucide-react'

export function IndustriesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const industries = [
    { name: 'Technology', icon: Code, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    { name: 'Healthcare', icon: Heart, color: 'from-red-500 to-pink-500', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    { name: 'Finance', icon: Building2, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    { name: 'Education', icon: GraduationCap, color: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    { name: 'Manufacturing', icon: Factory, color: 'from-gray-500 to-slate-500', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
    { name: 'Retail', icon: ShoppingCart, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    { name: 'Consulting', icon: Users, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
    { name: 'Media', icon: Camera, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
    { name: 'Real Estate', icon: Home, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
    { name: 'Transportation', icon: Truck, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    { name: 'Energy', icon: Zap, color: 'from-lime-500 to-green-500', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-700' },
    { name: 'Government', icon: Shield, color: 'from-slate-500 to-gray-500', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
    { name: 'Non-Profit', icon: HandHeart, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    { name: 'Hospitality', icon: Coffee, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    { name: 'Agriculture', icon: Wheat, color: 'from-green-600 to-lime-500', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' }
  ]

  return (
      <section className="relative py-24 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-16 left-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-1/3 w-4 h-4 bg-purple-400/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-24 left-1/5 w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-1/4 w-5 h-5 bg-cyan-400/30 rounded-full animate-bounce delay-300"></div>

        <div className="relative container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-20 relative">
            <div className="inline-block">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
                Industries We Serve
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full mx-auto mb-6"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover endless opportunities across Sweden's most dynamic industries and unlock your career potential
            </p>
          </div>

          {/* Industries Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {industries.map((industry, index) => {
                const Icon = industry.icon
                const isHovered = hoveredIndex === index

                return (
                    <div
                        key={index}
                        className="group relative"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${industry.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500 scale-75 group-hover:scale-100`}></div>

                      {/* Main Card */}
                      <div className={`
                    relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 
                    border-2 ${industry.border} 
                    transition-all duration-500 cursor-pointer
                    transform hover:scale-110 hover:shadow-2xl hover:-translate-y-2
                    ${isHovered ? `${industry.bg} shadow-xl scale-105 -translate-y-1` : 'hover:bg-white/90'}
                  `}>
                        {/* Icon Container */}
                        <div className={`
                      inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl
                      bg-gradient-to-r ${industry.color} shadow-lg
                      transform transition-all duration-300
                      ${isHovered ? 'scale-110 rotate-6' : 'group-hover:scale-105'}
                    `}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        {/* Industry Name */}
                        <h3 className={`
                      font-bold text-sm md:text-base leading-tight
                      transition-all duration-300
                      ${isHovered ? industry.text : 'text-gray-800 group-hover:text-gray-900'}
                    `}>
                          {industry.name}
                        </h3>

                        {/* Animated Underline */}
                        <div className={`
                      h-0.5 mt-3 rounded-full
                      bg-gradient-to-r ${industry.color}
                      transform origin-left transition-all duration-300
                      ${isHovered ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-75'}
                    `}></div>
                      </div>
                    </div>
                )
              })}
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-lg">
              <div className="flex -space-x-2 mr-4">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${industries[i]?.color || 'from-gray-400 to-gray-500'} border-2 border-white shadow-sm`}
                    ></div>
                ))}
              </div>
              <span className="text-gray-700 font-medium">
              <span className="font-bold text-gray-900">15+ Industries</span> • Endless Opportunities
            </span>
            </div>
          </div>
        </div>
      </section>
  )
}