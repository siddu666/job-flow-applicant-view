'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/integrations/supabase/client'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/signin')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  if (loading) return null

  return (
      <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex flex-col">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Justera Group
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Rasing Arc
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50">
                Home
              </Link>
              <Link href="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50">
                Browse Jobs
              </Link>
              {user && user?.user_metadata?.role !== 'admin' && (
                  <Link
                      href="/profile"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
                  >
                    My Profile
                  </Link>
              )}
              {user?.user_metadata?.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50">
                    Admin Panel
                  </Link>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                  <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-full">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                    <Button variant="outline" onClick={handleSignOut} className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                      Sign Out
                    </Button>
                  </div>
              ) : (
                  <div className="space-x-3">
                    <Link href="/signin">
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                        Get Started
                      </Button>
                    </Link>
                  </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
              <div className="lg:hidden border-t bg-white py-4">
                <div className="flex flex-col space-y-3">
                  <Link
                      href="/"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
                      onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                      href="/jobs"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
                      onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Jobs
                  </Link>
                  {user && (
                      <Link
                          href="/profile"
                          className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
                          onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                  )}
                  {user?.user_metadata?.role === 'admin' && (
                      <Link
                          href="/admin"
                          className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
                          onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin
                      </Link>
                  )}
                  <div className="border-t pt-3 mt-3">
                    {user ? (
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-full text-center">
                            Welcome, {user.email?.split('@')[0]}
                          </div>
                          <Button
                              variant="outline"
                              onClick={handleSignOut}
                              className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                          >
                            Sign Out
                          </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                          <Link href="/signin" className="block" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                              Sign In
                            </Button>
                          </Link>
                          <Link href="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                              Get Started
                            </Button>
                          </Link>
                        </div>
                    )}
                  </div>
                </div>
              </div>
          )}
        </div>
      </nav>
  )
}
