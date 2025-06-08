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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || loading || profileLoading || hasRedirected) return

    // If user is not authenticated and page requires auth
    if (!user && !allowUnauthenticated) {
      setHasRedirected(true)
      router.push('/signin')
      return
    }

    // If user is authenticated and we need to check role-based access
    if (user && profile) {
      const userRole = profile.role
      
      // If specific role is required and user doesn't have it, redirect based on their role
      if (requiredRole && userRole !== requiredRole) {
        if (userRole === 'admin' && pathname !== '/admin') {
          setHasRedirected(true)
          router.push('/admin')
          return
        }
        
        if (userRole === 'recruiter' && pathname !== '/jobs') {
          setHasRedirected(true)
          router.push('/jobs')
          return
        }
        
        if (userRole === 'applicant' && !['/profile', '/jobs', '/apply'].includes(pathname)) {
          setHasRedirected(true)
          router.push('/profile')
          return
        }
      }
    }
  }, [user, profile, loading, profileLoading, requiredRole, router, allowUnauthenticated, pathname, hasRedirected, isMounted])

  // Show loading while checking auth or not mounted
  if (!isMounted || loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
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
