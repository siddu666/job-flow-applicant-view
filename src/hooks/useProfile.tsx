
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'
import { toast } from 'sonner'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      console.log('User profile loaded:', data)
      return data as Profile
    },
    enabled: !!userId,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: ProfileUpdate }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as Profile
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    }
  })
}

export function useUploadCV() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/cv.${fileExt}`

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
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as Profile
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('CV uploaded successfully')
    },
    onError: (error) => {
      console.error('CV upload error:', error)
      toast.error('Failed to upload CV')
    }
  })
}

export function useDeleteCV() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      // Remove CV URL from profile
      const { data, error } = await supabase
        .from('profiles')
        .update({ cv_url: null })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      // Delete file from storage
      const fileName = `${userId}/cv.pdf`
      await supabase.storage
        .from('documents')
        .remove([fileName])

      return data as Profile
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('CV deleted successfully')
    },
    onError: (error) => {
      console.error('CV deletion error:', error)
      toast.error('Failed to delete CV')
    }
  })
}
