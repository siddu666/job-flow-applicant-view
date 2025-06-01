import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, InsertTables, UpdateTables } from "@/integrations/supabase/types";
import { toast } from "sonner";

// Define types for applications
export type Application = Tables<'applications'>;
export type ApplicationInsert = InsertTables<'applications'>;
export type ApplicationUpdate = UpdateTables<'applications'>;

export type ApplicationWithCandidate = Application & {
  applicant: Tables<'profiles'>;
  job: Tables<'jobs'>;
  match_score?: number;
};

export const useApplications = (filters?: {
  jobId?: string;
  status?: string;
  applicantId?: string;
}) => {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async (): Promise<ApplicationWithCandidate[]> => {
      try {
        let query = supabase
          .from("applications")
          .select(`
            *,
            applicant:profiles(*),
            job:jobs(*)
          `);

        if (filters?.jobId) {
          query = query.eq("job_id", filters.jobId);
        }

        if (filters?.status) {
          query = query.eq("status", filters.status);
        }

        if (filters?.applicantId) {
          query = query.eq("applicant_id", filters.applicantId);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching applications:", error);
          throw new Error(`Failed to fetch applications: ${error.message}`);
        }

        // Calculate match scores for each application
        const applicationsWithScores = await Promise.all(
          (data || []).map(async (app) => {
            try {
              const { data: matchScore } = await supabase.rpc(
                'calculate_candidate_match_score',
                {
                  candidate_skills: app.applicant?.skills || [],
                  candidate_experience: app.applicant?.experience_years || 0,
                  candidate_location: app.applicant?.current_location || '',
                  job_skills: app.job?.skills || [],
                  job_experience_level: app.job?.experience_level || 'entry',
                  job_location: app.job?.location || ''
                }
              );

              return {
                ...app,
                match_score: matchScore || 0
              };
            } catch (error) {
              console.error("Error calculating match score:", error);
              return {
                ...app,
                match_score: 0
              };
            }
          })
        );

        return applicationsWithScores;
      } catch (error) {
        console.error("Unexpected error fetching applications:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useApplicationStats = () => {
  return useQuery({
    queryKey: ['application-stats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("status");

        if (error) {
          console.error("Error fetching application stats:", error);
          throw new Error(`Failed to fetch application stats: ${error.message}`);
        }

        const stats = {
          total: data?.length || 0,
          pending: data?.filter(app => app.status === 'pending').length || 0,
          under_review: data?.filter(app => app.status === 'under_review').length || 0,
          interview_scheduled: data?.filter(app => app.status === 'interview_scheduled').length || 0,
          accepted: data?.filter(app => app.status === 'accepted').length || 0,
          rejected: data?.filter(app => app.status === 'rejected').length || 0,
        };

        return stats;
      } catch (error) {
        console.error("Unexpected error fetching application stats:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: ApplicationInsert): Promise<Application> => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .insert(application)
          .select()
          .single();

        if (error) {
          console.error("Error creating application:", error);
          throw new Error(`Failed to create application: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error creating application:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success("Application submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit application: ${error.message}`);
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: ApplicationUpdate;
    }): Promise<Application> => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Error updating application:", error);
          throw new Error(`Failed to update application: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error updating application:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success("Application updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update application: ${error.message}`);
    },
  });
};
