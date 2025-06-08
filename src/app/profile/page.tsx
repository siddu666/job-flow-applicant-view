'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import CandidateProfile from '@/components/CandidateProfile'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <CandidateProfile />
    </ProtectedRoute>
  )
}