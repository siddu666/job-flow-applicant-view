
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import OnboardingSteps from '@/components/onboarding/OnboardingSteps'

export default function OnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already signed in and has completed onboarding, redirect to profile
    if (user && !loading) {
      // Check if they already have a complete profile
      // This will be handled by the AuthProvider redirect logic
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <OnboardingSteps />
}
