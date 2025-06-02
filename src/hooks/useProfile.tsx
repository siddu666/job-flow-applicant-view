
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

export interface Profile {
  id: string
  updated_at: string | null
  expected_salary_sek: number | null
  preferred_cities: string[] | null
  availability: string | null
  skills: string[] | null
  portfolio_url: string | null
  certifications: string[] | null
  linkedin_url: string | null
  github_url: string | null
  email: string | null
  role: string | null
  phone: string | null
  first_name: string | null
  last_name: string | null
  current_location: string | null
  job_seeking_status: string | null
  cv_url: string | null
  bio: string | null
  experience_years: number | null
  created_at: string | null
  willing_to_relocate: boolean | null
}

type ProfileInsert = TablesInsert<'profiles'>
type ProfileUpdate = TablesUpdate<'profiles'>

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!userId,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProfileUpdate }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
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

export const useAllCandidates = (filters?: any) => {
  return useQuery({
    queryKey: ['candidates', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      if (filters?.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      if (filters?.skills && filters.skills.length > 0) {
        query = query.contains('skills', filters.skills)
      }

      if (filters?.experience_years) {
        query = query.gte('experience_years', filters.experience_years)
      }

      if (filters?.location) {
        query = query.ilike('current_location', `%${filters.location}%`)
      }

      if (filters?.job_seeking_status) {
        query = query.eq('job_seeking_status', filters.job_seeking_status)
      }

      const page = filters?.page || 1
      const limit = filters?.limit || 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data as Profile[],
        total: count || 0,
      }
    },
  })
}
