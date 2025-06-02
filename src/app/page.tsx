
'use client'

import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { IndustriesSection } from '@/components/sections/industries-section'
import { AboutSection } from '@/components/sections/about-section'
import { ClientsSection } from '@/components/sections/clients-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import { Building, LogOut, User, Briefcase, Settings } from 'lucide-react'

export default function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl text-gray-900">JobFlow</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/jobs">
                    <Button variant="ghost" size="sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Jobs
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  {user.user_metadata?.role === 'admin' && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <HeroSection />
      <ServicesSection />
      <IndustriesSection />
      <AboutSection />
      <ClientsSection />
      <ContactSection />
    </div>
  )
}
