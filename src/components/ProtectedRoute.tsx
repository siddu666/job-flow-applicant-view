'use client'

import { useAuth } from '@/contexts/auth-context'
import { useProfile } from '@/hooks/useProfile'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  allowUnauthenticated?: boolean
}

export function ProtectedRoute({ children, requiredRole, allowUnauthenticated = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id)
  const router = useRouter()
  const pathname = usePathname()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (loading || profileLoading || hasRedirected) return

    // If user is not authenticated and page requires auth
    if (!user && !allowUnauthenticated) {
      setHasRedirected(true)
      router.push('/signin')
      return
    }

    // If user is authenticated but we need a specific role
    if (user && requiredRole && profile?.role !== requiredRole) {
      // Don't redirect if we're already on the correct page for the user's role
      const userRole = profile?.role
      const currentPath = pathname
      
      if (userRole === 'admin' && currentPath !== '/admin') {
        setHasRedirected(true)
        router.push('/admin')
        return
      }
      
      if (userRole === 'recruiter' && currentPath !== '/jobs') {
        setHasRedirected(true)
        router.push('/jobs')
        return
      }
      
      if (userRole === 'applicant' && currentPath !== '/profile' && currentPath !== '/jobs' && currentPath !== '/apply') {
        setHasRedirected(true)
        router.push('/profile')
        return
      }
    }
  }, [user, profile, loading, profileLoading, requiredRole, router, allowUnauthenticated, pathname, hasRedirected])

  // Show loading while checking auth
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Block access if not authenticated and auth is required
  if (!user && !allowUnauthenticated) {
    return null
  }

  // Block access if role doesn't match and we're not in the middle of redirecting
  if (requiredRole && profile?.role !== requiredRole && !hasRedirected) {
    return null
  }

  return <>{children}</>
}
