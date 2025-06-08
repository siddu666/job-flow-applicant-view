'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface Profile {
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
  github_url?: string
  bio?: string
  certifications?: string[]
  expected_salary_sek?: number
  preferred_cities?: string[]
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

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] })
    },
  })
}

export function useUploadCV() {
  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      // Upload file to Supabase storage
      const fileName = `${userId}_${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cvs')
        .getPublicUrl(uploadData.path)

      // Update profile with CV URL
      const { data, error } = await supabase
        .from('profiles')
        .update({ cv_url: publicUrl })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    },
  })
}