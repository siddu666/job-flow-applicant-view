
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

interface Profile {
  id: string
  email: string
  role: string
  created_at: string
  updated_at: string
  phone: string | null
  first_name: string | null
  last_name: string | null
  current_location: string | null
  willing_to_relocate: boolean
  preferred_cities: string[] | null
  experience_years: number | null
  expected_salary_sek: number | null
  availability: string | null
  skills: string[] | null
  portfolio_url: string | null
  certifications: string[] | null
  linkedin_url: string | null
  github_url: string | null
  bio: string | null
  cv_url: string | null
  job_seeking_status: string | null
  profile_picture_url: string | null
  date_of_birth: string | null
  nationality: string | null
  work_authorization: string | null
  visa_status: string | null
  education: any | null
  work_experience: any | null
  languages: string[] | null
  salary_expectations: any | null
  last_login: string | null
  is_active: boolean
  is_verified: boolean
}

export function useProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }

      console.log('User profile loaded:', data)
      return data as Profile
    },
    enabled: !!user?.id,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  })
}

export function useUploadCV() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/cv.${fileExt}`

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      // Update profile with CV URL
      const { data, error } = await supabase
        .from('profiles')
        .update({ cv_url: publicUrl })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
      toast.success('CV uploaded successfully')
    },
    onError: (error) => {
      console.error('Error uploading CV:', error)
      toast.error('Failed to upload CV')
    }
  })
}
