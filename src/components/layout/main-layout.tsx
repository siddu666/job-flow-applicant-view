
import { Navigation } from './navigation'
import { Footer } from './footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
'use client'

import { useAuth } from '@/contexts/auth-context'
import { Navigation } from './navigation'
import { Footer } from './footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navigation />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
