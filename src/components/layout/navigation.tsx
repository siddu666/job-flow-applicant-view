'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Briefcase, User, LogOut, Users, Settings } from 'lucide-react'

export function Navigation() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Justera Group</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse w-20 h-8 bg-gray-200 rounded"></div>
            ) : user ? (
              <>
                <Link href="/jobs">
                  <Button variant="ghost">Jobs</Button>
                </Link>

                {user.user_metadata?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost">
                      <Users className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <Link href="/profile">
                  <Button variant="ghost">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>

                <Button onClick={handleSignOut} variant="outline">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/jobs">
                  <Button variant="ghost">Browse Jobs</Button>
                </Link>
                <Link href="/auth">
                  <Button>Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}