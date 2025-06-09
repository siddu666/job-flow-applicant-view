
'use client'

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/interfaces/Profile"

export interface CandidateMatch extends Profile {
  match_score: number
  match_reasons: {
    skills_match: {
      matching_skills: string[]
      missing_skills: string[]
      score: number
      skill_coverage: number
    }
    location_match: {
      is_same_location: boolean
      is_nearby: boolean
      is_remote_friendly: boolean
      score: number
    }
    experience_match: {
      candidate_experience: number
      required_level: string
      is_overqualified: boolean
      is_underqualified: boolean
      is_perfect_match: boolean
      score: number
    }
    availability_match: {
      is_available: boolean
      visa_status_suitable: boolean
      score: number
    }
    overall_compatibility: string
    recommendation_strength: 'high' | 'medium' | 'low'
  }
}

// Enhanced skills matching with fuzzy logic
const calculateAdvancedSkillsMatch = (candidateSkills: string[], jobSkills: string[]) => {
  if (!candidateSkills?.length || !jobSkills?.length) {
    return {
      matchingSkills: [],
      missingSkills: jobSkills || [],
      score: 0,
      skillCoverage: 0
    }
  }

  const normalizeSkill = (skill: string) => skill.toLowerCase().trim()
  const normalizedCandidateSkills = candidateSkills.map(normalizeSkill)
  const normalizedJobSkills = jobSkills.map(normalizeSkill)
  
  const matchingSkills: string[] = []
  const missingSkills: string[] = []
  
  // Advanced skill matching with categories and relationships
  const skillRelationships = {
    'react': ['javascript', 'jsx', 'frontend', 'web development'],
    'vue': ['javascript', 'frontend', 'web development'],
    'angular': ['typescript', 'javascript', 'frontend', 'web development'],
    'node.js': ['javascript', 'backend', 'server-side'],
    'python': ['django', 'flask', 'data science', 'machine learning'],
    'java': ['spring', 'spring boot', 'backend', 'enterprise'],
    'aws': ['cloud', 'devops', 'infrastructure'],
    'docker': ['containerization', 'devops', 'kubernetes'],
    'postgresql': ['sql', 'database', 'backend'],
    'mongodb': ['nosql', 'database', 'backend'],
    'git': ['version control', 'collaboration', 'development workflow']
  }

  normalizedJobSkills.forEach(jobSkill => {
    let hasMatch = false
    let matchedSkill = ''

    // Direct match
    if (normalizedCandidateSkills.includes(jobSkill)) {
      hasMatch = true
      matchedSkill = candidateSkills.find(s => normalizeSkill(s) === jobSkill) || jobSkill
    }
    
    // Fuzzy matching and skill relationships
    if (!hasMatch) {
      for (const candidateSkill of normalizedCandidateSkills) {
        // Partial string matching
        if (candidateSkill.includes(jobSkill) || jobSkill.includes(candidateSkill)) {
          hasMatch = true
          matchedSkill = candidateSkills.find(s => normalizeSkill(s) === candidateSkill) || candidateSkill
          break
        }

        // Skill relationship matching
        const jobSkillRelated = skillRelationships[jobSkill] || []
        const candidateSkillRelated = skillRelationships[candidateSkill] || []
        
        if (jobSkillRelated.includes(candidateSkill) || candidateSkillRelated.includes(jobSkill)) {
          hasMatch = true
          matchedSkill = candidateSkills.find(s => normalizeSkill(s) === candidateSkill) || candidateSkill
          break
        }
      }
    }
    
    if (hasMatch && matchedSkill) {
      matchingSkills.push(matchedSkill)
    } else {
      const originalSkill = jobSkills.find(s => normalizeSkill(s) === jobSkill) || jobSkill
      missingSkills.push(originalSkill)
    }
  })
  
  const score = normalizedJobSkills.length > 0 
    ? (matchingSkills.length / normalizedJobSkills.length) * 100 
    : 0

  // Calculate skill coverage (how many of candidate's skills are relevant)
  const relevantCandidateSkills = candidateSkills.filter(candidateSkill => 
    jobSkills.some(jobSkill => 
      normalizeSkill(candidateSkill).includes(normalizeSkill(jobSkill)) ||
      normalizeSkill(jobSkill).includes(normalizeSkill(candidateSkill))
    )
  )
  
  const skillCoverage = candidateSkills.length > 0 
    ? (relevantCandidateSkills.length / candidateSkills.length) * 100 
    : 0
  
  return { 
    matchingSkills, 
    missingSkills, 
    score: Math.round(score),
    skillCoverage: Math.round(skillCoverage)
  }
}

// Enhanced location matching
const calculateAdvancedLocationMatch = (candidateLocation: string, jobLocation: string) => {
  const normalizeLocation = (loc: string) => loc.toLowerCase().trim()
  const normalizedCandidateLoc = normalizeLocation(candidateLocation || '')
  const normalizedJobLoc = normalizeLocation(jobLocation || '')
  
  const isSameLocation = normalizedCandidateLoc === normalizedJobLoc
  const isRemoteFriendly = normalizedJobLoc.includes('remote') || normalizedJobLoc.includes('anywhere')
  
  // Define nearby locations (Swedish cities)
  const nearbyLocations = {
    'stockholm': ['uppsala', 'västerås', 'södertälje'],
    'gothenburg': ['göteborg', 'borås', 'trollhättan'],
    'malmö': ['lund', 'helsingborg', 'kristianstad'],
    'uppsala': ['stockholm', 'västerås'],
    'linköping': ['norrköping', 'motala'],
    'örebro': ['eskilstuna', 'västerås']
  }
  
  const isNearby = nearbyLocations[normalizedCandidateLoc]?.includes(normalizedJobLoc) ||
                  nearbyLocations[normalizedJobLoc]?.includes(normalizedCandidateLoc) ||
                  false
  
  let score = 0
  if (isSameLocation) score = 100
  else if (isRemoteFriendly) score = 95
  else if (isNearby) score = 75
  else score = 40 // Still possible with relocation
  
  return {
    isSameLocation,
    isNearby,
    isRemoteFriendly,
    score
  }
}

// Enhanced experience matching
const calculateAdvancedExperienceMatch = (candidateExperience: number, jobExperienceLevel: string) => {
  const experienceLevels = {
    'entry level': { min: 0, max: 2, ideal: 1 },
    'junior': { min: 0, max: 3, ideal: 2 },
    'mid level': { min: 2, max: 6, ideal: 4 },
    'senior level': { min: 5, max: 12, ideal: 8 },
    'senior': { min: 5, max: 12, ideal: 8 },
    'lead': { min: 7, max: 15, ideal: 10 },
    'principal': { min: 10, max: 20, ideal: 15 },
    'architect': { min: 12, max: 25, ideal: 18 }
  }
  
  const normalizedLevel = jobExperienceLevel?.toLowerCase() || 'any level'
  const levelRange = experienceLevels[normalizedLevel] || { min: 0, max: 100, ideal: candidateExperience }
  
  const isUnderqualified = candidateExperience < levelRange.min
  const isOverqualified = candidateExperience > levelRange.max + 3
  const isPerfectMatch = candidateExperience >= levelRange.min && candidateExperience <= levelRange.max
  
  let score = 0
  if (isPerfectMatch) {
    // Calculate how close to ideal experience
    const distanceFromIdeal = Math.abs(candidateExperience - levelRange.ideal)
    score = Math.max(100 - (distanceFromIdeal * 5), 80)
  } else if (isUnderqualified) {
    const gap = levelRange.min - candidateExperience
    score = Math.max(60 - (gap * 15), 20)
  } else if (isOverqualified) {
    const excess = candidateExperience - levelRange.max
    score = Math.max(70 - (excess * 5), 30)
  }
  
  return {
    candidateExperience,
    requiredLevel: jobExperienceLevel,
    isOverqualified,
    isUnderqualified,
    isPerfectMatch,
    score: Math.round(score)
  }
}

// Calculate availability and visa status match
const calculateAvailabilityMatch = (candidate: Profile) => {
  const isAvailable = candidate.availability_status !== 'not_available'
  const visaStatusSuitable = candidate.visa_status === 'citizen' || 
                            candidate.visa_status === 'permanent_resident' ||
                            candidate.visa_status === 'work_permit'
  
  let score = 0
  if (isAvailable && visaStatusSuitable) score = 100
  else if (isAvailable || visaStatusSuitable) score = 70
  else score = 30
  
  return {
    isAvailable,
    visaStatusSuitable,
    score
  }
}

// Get recommendation strength and overall compatibility
const getRecommendationAnalysis = (overallScore: number) => {
  let strength: 'high' | 'medium' | 'low'
  let compatibility: string
  
  if (overallScore >= 85) {
    strength = 'high'
    compatibility = "Exceptional candidate - Perfect alignment with job requirements"
  } else if (overallScore >= 75) {
    strength = 'high'
    compatibility = "Excellent candidate - Strong match across all criteria"
  } else if (overallScore >= 65) {
    strength = 'medium'
    compatibility = "Very good candidate - Good alignment with most requirements"
  } else if (overallScore >= 55) {
    strength = 'medium'
    compatibility = "Good candidate - Solid match with room for growth"
  } else if (overallScore >= 45) {
    strength = 'low'
    compatibility = "Potential candidate - Some alignment but needs development"
  } else {
    strength = 'low'
    compatibility = "Limited match - Consider for future opportunities"
  }
  
  return { strength, compatibility }
}

export const useCandidateRecommendations = (jobId?: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['candidate-recommendations', jobId, limit],
    queryFn: async (): Promise<CandidateMatch[]> => {
      if (!jobId) return []

      // Get job details
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (jobError) throw jobError

      // Get all candidates with complete profiles
      const { data: candidates, error: candidatesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'candidate')
        .not('skills', 'is', null)
        .not('current_location', 'is', null)

      if (candidatesError) throw candidatesError

      if (!candidates?.length) return []

      // Calculate matches for each candidate
      const candidateMatches: CandidateMatch[] = candidates.map(candidate => {
        const skillsMatch = calculateAdvancedSkillsMatch(candidate.skills || [], job.skills || [])
        const locationMatch = calculateAdvancedLocationMatch(candidate.current_location || '', job.location || '')
        const experienceMatch = calculateAdvancedExperienceMatch(candidate.experience_years || 0, job.experience_level || '')
        const availabilityMatch = calculateAvailabilityMatch(candidate)

        // Enhanced weighted scoring
        const weights = {
          skills: 0.45,        // 45% - Most important
          experience: 0.25,    // 25% - Very important
          location: 0.20,      // 20% - Important for logistics
          availability: 0.10   // 10% - Basic requirement
        }

        const overallScore = Math.round(
          (skillsMatch.score * weights.skills) +
          (experienceMatch.score * weights.experience) +
          (locationMatch.score * weights.location) +
          (availabilityMatch.score * weights.availability)
        )

        const { strength, compatibility } = getRecommendationAnalysis(overallScore)

        return {
          ...candidate,
          match_score: overallScore,
          match_reasons: {
            skills_match: {
              matching_skills: skillsMatch.matchingSkills,
              missing_skills: skillsMatch.missingSkills,
              score: skillsMatch.score,
              skill_coverage: skillsMatch.skillCoverage
            },
            location_match: {
              is_same_location: locationMatch.isSameLocation,
              is_nearby: locationMatch.isNearby,
              is_remote_friendly: locationMatch.isRemoteFriendly,
              score: locationMatch.score
            },
            experience_match: {
              candidate_experience: experienceMatch.candidateExperience,
              required_level: experienceMatch.requiredLevel,
              is_overqualified: experienceMatch.isOverqualified,
              is_underqualified: experienceMatch.isUnderqualified,
              is_perfect_match: experienceMatch.isPerfectMatch,
              score: experienceMatch.score
            },
            availability_match: {
              is_available: availabilityMatch.isAvailable,
              visa_status_suitable: availabilityMatch.visaStatusSuitable,
              score: availabilityMatch.score
            },
            overall_compatibility: compatibility,
            recommendation_strength: strength
          }
        }
      })

      // Sort by match score and return top candidates
      return candidateMatches
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, limit)
    },
    enabled: !!jobId,
  })
}

// Hook to get all jobs with their candidate recommendations
export const useAllJobsWithCandidateRecommendations = () => {
  return useQuery({
    queryKey: ['all-jobs-with-candidates'],
    queryFn: async () => {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return jobs || []
    },
  })
}

// Hook for detailed candidate analysis for a specific job
export const useCandidateAnalysis = (candidateId: string, jobId: string) => {
  return useQuery({
    queryKey: ['candidate-analysis', candidateId, jobId],
    queryFn: async () => {
      if (!candidateId || !jobId) return null

      // Get candidate and job details
      const [candidateResponse, jobResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', candidateId).single(),
        supabase.from('jobs').select('*').eq('id', jobId).single()
      ])

      if (candidateResponse.error) throw candidateResponse.error
      if (jobResponse.error) throw jobResponse.error

      const candidate = candidateResponse.data
      const job = jobResponse.data

      const skillsMatch = calculateAdvancedSkillsMatch(candidate.skills || [], job.skills || [])
      const locationMatch = calculateAdvancedLocationMatch(candidate.current_location || '', job.location || '')
      const experienceMatch = calculateAdvancedExperienceMatch(candidate.experience_years || 0, job.experience_level || '')
      const availabilityMatch = calculateAvailabilityMatch(candidate)

      return {
        candidate,
        job,
        analysis: {
          skillsMatch,
          locationMatch,
          experienceMatch,
          availabilityMatch,
          recommendations: {
            hiringAdvice: experienceMatch.isPerfectMatch 
              ? "Excellent candidate for immediate hiring"
              : experienceMatch.isOverqualified
              ? "Consider for senior role or discuss career goals"
              : "Good potential with proper onboarding",
            interviewFocus: [
              ...skillsMatch.matchingSkills.slice(0, 3).map(skill => `Explore ${skill} experience`),
              ...skillsMatch.missingSkills.slice(0, 2).map(skill => `Assess ${skill} learning potential`)
            ],
            developmentAreas: skillsMatch.missingSkills.slice(0, 3)
          }
        }
      }
    },
    enabled: !!candidateId && !!jobId,
  })
}
