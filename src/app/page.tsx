import { HeroSection } from '@/components/sections/hero-section'
import { ClientsSection } from '@/components/sections/clients-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ContactSection } from '@/components/sections/contact-section'
import {IndustriesSection} from "@/components/sections/industries-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
        <ServicesSection />
        <IndustriesSection />
        <ClientsSection />
      <ContactSection />
    </div>
  )
}