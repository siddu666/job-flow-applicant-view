'use client'

import { useAuth } from '@/contexts/auth-context'
import { useProfile } from '@/hooks/useProfile'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  allowUnauthenticated?: boolean // Add a prop to allow unauthenticated access
}

export function ProtectedRoute({ children, requiredRole, allowUnauthenticated = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !profileLoading) {
      if (!user && !allowUnauthenticated) {
        router.push('/signin')
        return
      }

      if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate page based on user role
        const userRole = profile?.role
        switch (userRole) {
          case 'admin':
            router.push('/admin')
            break
          case 'recruiter':
            router.push('/jobs')
            break
          default:
            router.push('/profile')
        }
        return
      }
    }
  }, [user, profile, loading, profileLoading, requiredRole, router, allowUnauthenticated])

  if (loading || profileLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
    )
  }

  if (!user && !allowUnauthenticated) {
    return null
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
