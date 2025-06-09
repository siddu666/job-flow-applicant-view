
'use client'

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<'profiles'>;
export type Job = Tables<'jobs'>;
export type CandidateWithMatch = Profile & { match_score: number };

export const useCandidateRecommendations = (jobId?: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['candidate-recommendations', jobId, limit],
    queryFn: async (): Promise<CandidateWithMatch[]> => {
      if (!jobId) return [];

      try {
        // First get the specific job
        const { data: job, error: jobError } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        if (jobError) {
          console.error("Error fetching job for recommendations:", jobError);
          return [];
        }

        // Get all candidates (non-admin profiles)
        const { data: candidates, error: candidatesError } = await supabase
          .from("profiles")
          .select("*")
          .neq("role", "admin")
          .order("created_at", { ascending: false });

        if (candidatesError) {
          console.error("Error fetching candidates for recommendations:", candidatesError);
          return [];
        }

        // Calculate match scores using the database function
        const candidatesWithScores: CandidateWithMatch[] = [];

        for (const candidate of candidates) {
          const { data: matchScore, error: scoreError } = await supabase.rpc(
            'calculate_candidate_match_score',
            {
              candidate_skills: candidate.skills || [],
              candidate_experience: candidate.experience_years || 0,
              candidate_location: candidate.current_location || '',
              job_skills: job.skills || [],
              job_experience_level: job.experience_level || 'entry',
              job_location: job.location || ''
            }
          );

          if (!scoreError && matchScore !== null && matchScore > 0) {
            candidatesWithScores.push({
              ...candidate,
              match_score: matchScore
            });
          }
        }

        // Sort by match score and return top matches
        return candidatesWithScores
          .sort((a, b) => b.match_score - a.match_score)
          .slice(0, limit);

      } catch (error) {
        console.error("Unexpected error fetching candidate recommendations:", error);
        return [];
      }
    },
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAllJobsWithCandidateRecommendations = () => {
  return useQuery({
    queryKey: ['jobs-with-candidate-recommendations'],
    queryFn: async () => {
      try {
        const { data: jobs, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (jobsError) {
          console.error("Error fetching jobs:", jobsError);
          return [];
        }

        return jobs;
      } catch (error) {
        console.error("Unexpected error fetching jobs:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
