'use client'

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useProfile } from "./useProfile"

// Updated JobMatch interface to handle nullable database fields
export interface JobMatch {
  id: string
  title: string
  description: string
  location: string
  type: string
  requirements: string
  skills: string[]
  experience_level: string
  posted_by: string
  created_at: string
  updated_at?: string | null
  match_score: number
  match_reasons: {
    skills_match: {
      matching_skills: string[]
      missing_skills: string[]
      score: number
    }
    location_match: {
      is_preferred: boolean
      distance_score: number
      score: number
    }
    experience_match: {
      user_experience: number
      required_level: string
      is_suitable: boolean
      score: number
    }
    overall_compatibility: string
  }
}

interface ExperienceRange {
  min: number
  max: number
}

// Skills matching algorithm
const calculateSkillsMatch = (userSkills: string[], jobSkills: string[]) => {
  const normalizeSkill = (skill: string) => skill.toLowerCase().trim()
  const normalizedUserSkills = userSkills.map(normalizeSkill)
  const normalizedJobSkills = jobSkills.map(normalizeSkill)

  const matchingSkills: string[] = []
  const missingSkills: string[] = []

  normalizedJobSkills.forEach(jobSkill => {
    const hasMatch = normalizedUserSkills.some(userSkill =>
        userSkill.includes(jobSkill) ||
        jobSkill.includes(userSkill) ||
        // Handle common abbreviations and variations
        getSkillVariations(userSkill).includes(jobSkill) ||
        getSkillVariations(jobSkill).includes(userSkill)
    )

    if (hasMatch) {
      // Find the original skill name for display
      const originalSkill = jobSkills.find(s => normalizeSkill(s) === jobSkill) || jobSkill
      matchingSkills.push(originalSkill)
    } else {
      const originalSkill = jobSkills.find(s => normalizeSkill(s) === jobSkill) || jobSkill
      missingSkills.push(originalSkill)
    }
  })

  const score = normalizedJobSkills.length > 0
      ? (matchingSkills.length / normalizedJobSkills.length) * 100
      : 0

  return { matchingSkills, missingSkills, score }
}

// Get skill variations for better matching
const getSkillVariations = (skill: string): string[] => {
  const variations: Record<string, string[]> = {
    'javascript': ['js', 'node.js', 'nodejs'],
    'typescript': ['ts'],
    'react': ['reactjs', 'react.js'],
    'vue': ['vuejs', 'vue.js'],
    'angular': ['angularjs'],
    'python': ['py'],
    'c++': ['cpp', 'c plus plus'],
    'c#': ['csharp', 'c sharp'],
    'postgresql': ['postgres', 'psql'],
    'mongodb': ['mongo'],
    'aws': ['amazon web services'],
    'gcp': ['google cloud platform', 'google cloud'],
    'azure': ['microsoft azure'],
    'kubernetes': ['k8s'],
    'docker': ['containerization'],
    'jenkins': ['ci/cd'],
    'git': ['github', 'gitlab', 'version control']
  }

  const normalizedSkill = skill.toLowerCase()

  // Return variations for the skill
  for (const [key, values] of Object.entries(variations)) {
    if (key === normalizedSkill) return values
    if (values.includes(normalizedSkill)) return [key, ...values.filter(v => v !== normalizedSkill)]
  }

  return []
}

// Location matching algorithm
const calculateLocationMatch = (userLocation: string, jobLocation: string, preferredLocations?: string[]) => {
  const normalizeLocation = (loc: string) => loc.toLowerCase().trim()
  const normalizedUserLoc = normalizeLocation(userLocation)
  const normalizedJobLoc = normalizeLocation(jobLocation)

  let isPreferred = false
  let distanceScore = 0

  // Check if job location is in user's preferred locations
  if (preferredLocations) {
    isPreferred = preferredLocations.some(pref =>
        normalizeLocation(pref) === normalizedJobLoc
    )
  }

  // Exact match
  if (normalizedUserLoc === normalizedJobLoc) {
    distanceScore = 100
  }
  // Same region/similar locations (simplified for Swedish cities)
  else if (areSimilarLocations(normalizedUserLoc, normalizedJobLoc)) {
    distanceScore = 70
  }
  // Remote work consideration
  else if (normalizedJobLoc.includes('remote') || normalizedJobLoc.includes('anywhere')) {
    distanceScore = 90
  }
  else {
    distanceScore = 30 // Different location but still possible
  }

  const score = isPreferred ? Math.min(distanceScore + 20, 100) : distanceScore

  return { isPreferred, distanceScore, score }
}

// Check if locations are similar (simplified Swedish cities logic)
const areSimilarLocations = (loc1: string, loc2: string): boolean => {
  const regions = [
    ['stockholm', 'uppsala', 'västerås'],
    ['gothenburg', 'göteborg', 'borås'],
    ['malmö', 'lund', 'helsingborg'],
    ['linköping', 'norrköping'],
    ['umeå', 'gävle'],
    ['örebro', 'eskilstuna']
  ]

  return regions.some(region =>
      region.includes(loc1) && region.includes(loc2)
  )
}

// Experience matching algorithm
const calculateExperienceMatch = (userExperience: number, jobExperienceLevel: string) => {
  const experienceLevels: Record<string, ExperienceRange> = {
    'entry level': { min: 0, max: 2 },
    'mid level': { min: 2, max: 5 },
    'senior level': { min: 5, max: 100 },
  }

  const normalizedLevel = jobExperienceLevel.toLowerCase()
  const levelRange = experienceLevels[normalizedLevel] || { min: 0, max: 100 }

  const isSuitable = userExperience >= levelRange.min && userExperience <= levelRange.max + 2

  let score = 0
  if (userExperience >= levelRange.min && userExperience <= levelRange.max) {
    score = 100 // Perfect match
  } else if (userExperience >= levelRange.min - 1 && userExperience <= levelRange.max + 2) {
    score = 80 // Close match
  } else if (userExperience >= levelRange.min - 2 && userExperience <= levelRange.max + 4) {
    score = 60 // Acceptable match
  } else {
    score = 30 // Poor match but not impossible
  }

  return { userExperience, requiredLevel: jobExperienceLevel, isSuitable, score }
}

// Calculate overall compatibility description
const getCompatibilityDescription = (overallScore: number): string => {
  if (overallScore >= 90) return "Excellent match - Highly recommended"
  if (overallScore >= 80) return "Very good match - Strong candidate"
  if (overallScore >= 70) return "Good match - Worth considering"
  if (overallScore >= 60) return "Fair match - Some alignment"
  if (overallScore >= 50) return "Moderate match - Limited alignment"
  return "Low match - Consider skill development"
}

export const useJobRecommendations = (userId?: string, limit: number = 10) => {
  const profileQuery = useProfile(userId)

  return useQuery({
    queryKey: ['job-recommendations', profileQuery.data?.id, limit],
    queryFn: async (): Promise<JobMatch[]> => {
      const profile = profileQuery.data

      if (!profile?.id) {
        throw new Error('User profile not found')
      }

      // Fetch active jobs
      const { data: jobs, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })

      if (error) throw error

      if (!jobs || jobs.length === 0) {
        return []
      }

      // Calculate matches for each job
      const jobMatches: JobMatch[] = jobs.map(job => {
        const userSkills = profile.skills || []
        const jobSkills = job.skills || [] // Handle null skills from database
        const userLocation = profile.current_location || ''
        const userExperience = profile.experience_years || 0
        const preferredLocations = profile.preferred_cities || undefined

        // Calculate individual match components
        const skillsMatch = calculateSkillsMatch(userSkills, jobSkills)
        const locationMatch = calculateLocationMatch(userLocation, job.location, preferredLocations)
        const experienceMatch = calculateExperienceMatch(userExperience, job.experience_level || 'any level')

        // Calculate weighted overall score
        const weights = {
          skills: 0.5,      // 50% weight for skills
          location: 0.25,   // 25% weight for location
          experience: 0.25  // 25% weight for experience
        }

        const overallScore = Math.round(
            (skillsMatch.score * weights.skills) +
            (locationMatch.score * weights.location) +
            (experienceMatch.score * weights.experience)
        )

        return {
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          requirements: job.requirements,
          skills: job.skills || [], // Handle null skills - ensure array
          experience_level: job.experience_level || 'any level', // Handle null experience_level
          posted_by: job.posted_by,
          created_at: job.created_at || '', // Handle null created_at
          updated_at: job.updated_at,
          match_score: overallScore,
          match_reasons: {
            skills_match: {
              matching_skills: skillsMatch.matchingSkills,
              missing_skills: skillsMatch.missingSkills,
              score: Math.round(skillsMatch.score)
            },
            location_match: {
              is_preferred: locationMatch.isPreferred,
              distance_score: Math.round(locationMatch.distanceScore),
              score: Math.round(locationMatch.score)
            },
            experience_match: {
              user_experience: experienceMatch.userExperience,
              required_level: experienceMatch.requiredLevel,
              is_suitable: experienceMatch.isSuitable,
              score: Math.round(experienceMatch.score)
            },
            overall_compatibility: getCompatibilityDescription(overallScore)
          }
        }
      })

      // Sort by match score and return top matches
      return jobMatches
          .sort((a, b) => b.match_score - a.match_score)
          .slice(0, limit)
    },
    enabled: !!profileQuery.data?.id,
  })
}

// Hook for getting detailed explanation of a specific job match
export const useJobMatchExplanation = (jobId: string, userId?: string) => {
  const profileQuery = useProfile(userId)

  return useQuery({
    queryKey: ['job-match-explanation', jobId, profileQuery.data?.id],
    queryFn: async () => {
      const profile = profileQuery.data

      if (!profile?.id || !jobId) return null

      const { data: job, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single()

      if (error) throw error

      const userSkills = profile.skills || []
      const jobSkills = job.skills || [] // Handle null skills
      const userLocation = profile.current_location || ''
      const userExperience = profile.experience_years || 0

      const skillsMatch = calculateSkillsMatch(userSkills, jobSkills)
      const locationMatch = calculateLocationMatch(userLocation, job.location)
      const experienceMatch = calculateExperienceMatch(userExperience, job.experience_level || 'any level')

      return {
        job,
        skillsMatch,
        locationMatch,
        experienceMatch,
        recommendations: {
          skillsToImprove: skillsMatch.missingSkills.slice(0, 3),
          strengthAreas: skillsMatch.matchingSkills,
          locationConsiderations: locationMatch.isPreferred
              ? "This job is in your preferred location"
              : "Consider relocation requirements",
          experienceGuidance: experienceMatch.isSuitable
              ? "Your experience level is well-suited for this role"
              : "Consider if this role aligns with your career progression goals"
        }
      }
    },
    enabled: !!profileQuery.data?.id && !!jobId,
  })
}