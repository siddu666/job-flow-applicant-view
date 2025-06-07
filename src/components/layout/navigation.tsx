
'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/integrations/supabase/client'

export function Navigation() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/auth')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  if (loading) return null

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">JobFlow</div>
            <div className="text-sm text-gray-500 hidden sm:block">by Justera Group</div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Browse Jobs
            </Link>
            <Link href="/apply" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Apply Now
            </Link>
            {user && (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  My Profile
                </Link>
                {user.email === 'admin@example.com' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button variant="outline" onClick={handleSignOut} size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
