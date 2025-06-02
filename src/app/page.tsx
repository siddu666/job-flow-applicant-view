'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { IndustriesSection } from '@/components/sections/industries-section'
import { AboutSection } from '@/components/sections/about-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      // Redirect authenticated users to their appropriate dashboard
      switch (user.user_metadata?.role) {
        case 'admin':
          router.push('/admin')
          break
        case 'recruiter':
          router.push('/jobs')
          break
        default:
          router.push('/profile')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <IndustriesSection />
      <AboutSection />
      <ContactSection />
    </div>
  )
}