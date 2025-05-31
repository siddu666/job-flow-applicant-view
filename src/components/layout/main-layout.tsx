
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MainLayout({ children, className = '' }: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col gradient-bg ${className}`}>
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
