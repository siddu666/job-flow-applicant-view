'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/auth')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            JobFlow
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600">
              Jobs
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                {user.user_metadata?.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                <Button onClick={handleSignOut} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/jobs"
                className="text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.user_metadata?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Button onClick={handleSignOut} variant="outline" className="w-fit">
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild className="w-fit">
                  <Link href="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}