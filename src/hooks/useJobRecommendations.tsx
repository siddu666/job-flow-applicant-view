
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

        // Get all active jobs
        const { data: jobs, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50); // Limit to prevent too many API calls

        if (jobsError) {
          console.error("Error fetching jobs for recommendations:", jobsError);
          return [];
        }

        if (!jobs || jobs.length === 0) return [];

        // Calculate match scores using the database function
        const jobsWithScores: JobWithMatch[] = [];

        // Process jobs in batches to avoid overwhelming the database
        const batchSize = 10;
        for (let i = 0; i < jobs.length; i += batchSize) {
          const batch = jobs.slice(i, i + batchSize);
          
          const batchPromises = batch.map(async (job) => {
            try {
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

              if (!scoreError && matchScore !== null && matchScore > 20) { // Only include jobs with >20% match
                return {
                  ...job,
                  match_score: matchScore
                };
              }
              return null;
            } catch (error) {
              console.error(`Error calculating match for job ${job.id}:`, error);
              return null;
            }
          });

          const batchResults = await Promise.all(batchPromises);
          const validResults = batchResults.filter(result => result !== null) as JobWithMatch[];
          jobsWithScores.push(...validResults);
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
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
