
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Job Application System',
  description: 'Professional job application platform with Supabase integration',
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
            {children}
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
