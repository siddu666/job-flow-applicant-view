'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface Profile {
  id: string
  email: string
  role: string
  first_name?: string
  last_name?: string
  phone?: string
  current_location?: string
  skills?: string[]
  experience_years?: number
  job_seeking_status?: string
  availability?: string
  linkedin_url?: string
  portfolio_url?: string
  willing_to_relocate?: boolean
  cv_url?: string
  created_at?: string
  updated_at?: string
}

export function useProfile(userId?: string) {
  const [data, setData] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          throw error
        }

        setData(profile)
      } catch (err) {
        setError(err as Error)
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const refetch = async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        throw error
      }

      setData(profile)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return { data, isLoading, error, refetch }
}