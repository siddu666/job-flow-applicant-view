
'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      // Get all unique skills from profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('skills')
        .not('skills', 'is', null)

      if (error) throw error

      // Flatten and deduplicate skills
      const allSkills = new Set<string>()
      data.forEach(profile => {
        if (profile.skills) {
          profile.skills.forEach(skill => allSkills.add(skill))
        }
      })

      return Array.from(allSkills).sort()
    },
  })
}

export function usePopularSkills(limit = 20) {
  return useQuery({
    queryKey: ['popular-skills', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('skills')
        .not('skills', 'is', null)

      if (error) throw error

      // Count skill occurrences
      const skillCounts: Record<string, number> = {}
      data.forEach(profile => {
        if (profile.skills) {
          profile.skills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
          })
        }
      })

      // Sort by popularity and return top skills
      return Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([skill, count]) => ({ skill, count }))
    },
  })
}
