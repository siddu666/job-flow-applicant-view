
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Job = Tables<'jobs'>;
export type JobWithMatch = Job & { match_score: number };

export const useJobRecommendations = (userId?: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['job-recommendations', userId, limit],
    queryFn: async (): Promise<JobWithMatch[]> => {
      if (!userId) return [];

      try {
        // First get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile for recommendations:", profileError);
          return [];
        }

        // Get all jobs
        const { data: jobs, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (jobsError) {
          console.error("Error fetching jobs for recommendations:", jobsError);
          return [];
        }

        // Calculate match scores using the database function
        const jobsWithScores: JobWithMatch[] = [];

        for (const job of jobs) {
          const { data: matchScore, error: scoreError } = await supabase.rpc(
            'calculate_candidate_match_score',
            {
              candidate_skills: profile.skills || [],
              candidate_experience: profile.experience_years || 0,
              candidate_location: profile.current_location || '',
              job_skills: job.skills || [],
              job_experience_level: job.experience_level || 'entry',
              job_location: job.location || ''
            }
          );

          if (!scoreError && matchScore !== null) {
            jobsWithScores.push({
              ...job,
              match_score: matchScore
            });
          }
        }

        // Sort by match score and return top matches
        return jobsWithScores
          .sort((a, b) => b.match_score - a.match_score)
          .slice(0, limit);

      } catch (error) {
        console.error("Unexpected error fetching job recommendations:", error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
