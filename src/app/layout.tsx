
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { Providers } from '@/components/providers'
import { MainLayout } from '@/components/layout/main-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobFlow - Professional Career Platform | Justera Group',
  description: 'Professional job application platform powered by Justera Group. Connect with exceptional opportunities and advance your career.',
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
