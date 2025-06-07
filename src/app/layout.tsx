
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { Providers } from '@/components/providers'
import { MainLayout } from '@/components/layout/main-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Justera Group - Executive Search & Professional Recruitment',
  description: 'Premier executive search and professional recruitment services. Connect with world-class opportunities through Justera Group\'s global network of industry-leading companies.',
  keywords: 'executive search, professional recruitment, career opportunities, Justera Group, job placement, talent acquisition',
  authors: [{ name: 'Justera Group' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
