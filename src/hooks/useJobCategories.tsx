
'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useJobCategories() {
  return useQuery({
    queryKey: ['job-categories'],
    queryFn: async () => {
      // Get unique job types from jobs table
      const { data, error } = await supabase
        .from('jobs')
        .select('type')
        .not('type', 'is', null)

      if (error) throw error

      const types = new Set<string>()
      const departments = new Set<string>()

      data.forEach(job => {
        if (job.type) types.add(job.type)
      })

      return {
        types: Array.from(types).sort(),
        departments: Array.from(departments).sort()
      }
    },
  })
}

export function useJobLocations() {
  return useQuery({
    queryKey: ['job-locations'],
    queryFn: async () => {
      // Get unique locations from jobs table
      const { data, error } = await supabase
        .from('jobs')
        .select('location')
        .not('location', 'is', null)

      if (error) throw error

      const locations = new Set<string>()
      data.forEach(job => {
        if (job.location) locations.add(job.location)
      })

      return Array.from(locations).sort()
    },
  })
}
