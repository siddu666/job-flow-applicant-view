
'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface CandidateSearchFilters {
  searchTerm?: string
  experienceLevel?: string
  location?: string
  skills?: string[]
  visaStatus?: string
  availability?: string
  jobType?: string
}

export function useAllCandidates(filters?: CandidateSearchFilters) {
  return useQuery({
    queryKey: ['all-candidates', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.searchTerm) {
        query = query.or(`first_name.ilike.%${filters.searchTerm}%,last_name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`)
      }

      if (filters?.experienceLevel && filters.experienceLevel !== 'any') {
        const exp = parseInt(filters.experienceLevel)
        if (exp === 0) {
          query = query.gte('experience', 0).lte('experience', 1)
        } else if (exp === 2) {
          query = query.gte('experience', 2).lte('experience', 3)
        } else if (exp === 4) {
          query = query.gte('experience', 4).lte('experience', 6)
        } else if (exp === 7) {
          query = query.gte('experience', 7)
        }
      }

      if (filters?.location) {
        query = query.ilike('current_location', `%${filters.location}%`)
      }

      if (filters?.visaStatus && filters.visaStatus !== 'any') {
        query = query.eq('visa_status', filters.visaStatus)
      }

      if (filters?.availability && filters.availability !== 'any') {
        query = query.eq('availability', filters.availability)
      }

      if (filters?.jobType && filters.jobType !== 'any') {
        query = query.eq('preferred_job_type', filters.jobType)
      }

      if (filters?.skills && filters.skills.length > 0) {
        query = query.overlaps('skills', filters.skills)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Profile[]
    },
  })
}

export function useCandidateStats() {
  return useQuery({
    queryKey: ['candidate-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('visa_status, experience, availability, preferred_job_type, current_location, skills')
        .neq('role', 'admin')

      if (error) throw error

      const stats = {
        total: data.length,
        byVisaStatus: {} as Record<string, number>,
        byExperience: {} as Record<string, number>,
        byAvailability: {} as Record<string, number>,
        byJobType: {} as Record<string, number>,
        byLocation: {} as Record<string, number>,
        topSkills: {} as Record<string, number>
      }

      data.forEach(profile => {
        // Visa status stats
        if (profile.visa_status) {
          stats.byVisaStatus[profile.visa_status] = (stats.byVisaStatus[profile.visa_status] || 0) + 1
        }

        // Experience stats
        if (profile.experience !== null) {
          const expRange = profile.experience <= 1 ? '0-1' :
                          profile.experience <= 3 ? '2-3' :
                          profile.experience <= 6 ? '4-6' : '7+'
          stats.byExperience[expRange] = (stats.byExperience[expRange] || 0) + 1
        }

        // Availability stats
        if (profile.availability) {
          stats.byAvailability[profile.availability] = (stats.byAvailability[profile.availability] || 0) + 1
        }

        // Job type stats
        if (profile.preferred_job_type) {
          stats.byJobType[profile.preferred_job_type] = (stats.byJobType[profile.preferred_job_type] || 0) + 1
        }

        // Location stats
        if (profile.current_location) {
          stats.byLocation[profile.current_location] = (stats.byLocation[profile.current_location] || 0) + 1
        }

        // Skills stats
        if (profile.skills) {
          profile.skills.forEach(skill => {
            stats.topSkills[skill] = (stats.topSkills[skill] || 0) + 1
          })
        }
      })

      return stats
    },
  })
}
