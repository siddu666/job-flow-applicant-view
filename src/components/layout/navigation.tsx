'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export function Navigation() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Job Flow
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="ghost">Jobs</Button>
                </Link>
                {user.user_metadata?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                )}
                <Button onClick={() => signOut()} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}