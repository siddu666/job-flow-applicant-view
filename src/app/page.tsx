
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { AboutSection } from '@/components/sections/about-section'
import { IndustriesSection } from '@/components/sections/industries-section'
import { ClientsSection } from '@/components/sections/clients-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to appropriate dashboard
      if (user.user_metadata?.role === 'admin') {
        router.push('/admin')
      } else if (user.user_metadata?.role === 'recruiter') {
        router.push('/jobs')
      } else {
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

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <IndustriesSection />
        <ClientsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
