
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useProfile } from '@/hooks/useProfile'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useRoleRedirect() {
  const { user, loading } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !profileLoading && user && profile) {
      // Only redirect if we're on the profile page and user has a different role
      if (window.location.pathname === '/profile') {
        switch (profile.role) {
          case 'admin':
            router.push('/admin')
            break
          case 'recruiter':
            router.push('/jobs')
            break
          // Default: stay on profile page
        }
      }
    }
  }, [user, profile, loading, profileLoading, router])

  return { user, profile, loading: loading || profileLoading }
}
