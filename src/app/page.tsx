import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ClientsSection } from '@/components/sections/clients-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ClientsSection />
      <ContactSection />
    </div>
  )
}