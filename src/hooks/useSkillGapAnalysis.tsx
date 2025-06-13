
import { useMemo } from 'react';

interface Job {
  id: string;
  title: string;
  required_skills: string[];
  preferred_skills?: string[];
  experience_required?: number;
}

interface SkillGapResult {
  hasGaps: boolean;
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  hasExperienceGap: boolean;
  experienceGap: number;
  matchPercentage: number;
  canApply: boolean;
}

export const useSkillGapAnalysis = (
  job: Job | null,
  userSkills: string[] = [],
  userExperience: number = 0
): SkillGapResult => {
  return useMemo(() => {
    if (!job) {
      return {
        hasGaps: false,
        missingRequiredSkills: [],
        missingPreferredSkills: [],
        hasExperienceGap: false,
        experienceGap: 0,
        matchPercentage: 0,
        canApply: false
      };
    }

    // Calculate missing skills
    const missingRequiredSkills = job.required_skills.filter(
      skill => !userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    const missingPreferredSkills = (job.preferred_skills || []).filter(
      skill => 
        !userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        ) && 
        !job.required_skills.includes(skill)
    );

    // Calculate experience gap
    const hasExperienceGap = job.experience_required ? userExperience < job.experience_required : false;
    const experienceGap = job.experience_required ? Math.max(0, job.experience_required - userExperience) : 0;

    // Calculate match percentage
    const totalRequiredSkills = job.required_skills.length;
    const matchedRequiredSkills = totalRequiredSkills - missingRequiredSkills.length;
    const skillMatchPercentage = totalRequiredSkills > 0 ? (matchedRequiredSkills / totalRequiredSkills) * 100 : 100;
    
    const experienceMatchPercentage = job.experience_required 
      ? Math.min(100, (userExperience / job.experience_required) * 100)
      : 100;

    const matchPercentage = Math.round((skillMatchPercentage + experienceMatchPercentage) / 2);

    // Determine if user has gaps and can apply
    const hasGaps = missingRequiredSkills.length > 0 || hasExperienceGap;
    const canApply = missingRequiredSkills.length === 0 && !hasExperienceGap;

    return {
      hasGaps,
      missingRequiredSkills,
      missingPreferredSkills,
      hasExperienceGap,
      experienceGap,
      matchPercentage,
      canApply
    };
  }, [job, userSkills, userExperience]);
};
