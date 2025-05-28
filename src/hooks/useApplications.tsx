
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Application = Tables<'applications'>;
export type ApplicationInsert = TablesInsert<'applications'>;
export type ApplicationUpdate = TablesUpdate<'applications'>;

export const useApplications = (filters?: {
  jobId?: string;
  status?: Application['status'];
  applicantId?: string;
}) => {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async (): Promise<Application[]> => {
      try {
        let query = supabase
          .from("applications")
          .select(`
            *,
            job:jobs(
              id,
              title
            ),
            applicant:profiles(
              id,
              full_name,
              email
            )
          `)
          .order("created_at", { ascending: false });

        if (filters?.jobId) {
          query = query.eq("job_id", filters.jobId);
        }

        if (filters?.status) {
          query = query.eq("status", filters.status);
        }

        if (filters?.applicantId) {
          query = query.eq("applicant_id", filters.applicantId);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching applications:", error);
          throw new Error(`Failed to fetch applications: ${error.message}`);
        }

        return data || [];
      } catch (error) {
        console.error("Unexpected error fetching applications:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: ApplicationInsert): Promise<Application> => {
      try {
        const applicationData: ApplicationInsert = {
          ...application,
          status: 'pending',
        };

        const { data, error } = await supabase
          .from("applications")
          .insert(applicationData)
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
      updates,
      updatedBy 
    }: { 
      id: string; 
      updates: ApplicationUpdate;
      updatedBy: string;
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

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      deletedBy,
      reason 
    }: { 
      id: string; 
      deletedBy: string;
      reason?: string;
    }): Promise<void> => {
      try {
        const { error } = await supabase
          .from("applications")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error deleting application:", error);
          throw new Error(`Failed to delete application: ${error.message}`);
        }
      } catch (error) {
        console.error("Unexpected error deleting application:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success("Application deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete application: ${error.message}`);
    },
  });
};

export const useApplicationById = (id: string) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async (): Promise<Application | null> => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select(`
            *,
            job:jobs(
              id,
              title,
              description,
              location
            ),
            applicant:profiles(
              id,
              full_name,
              email,
              phone,
              linkedin_url,
              portfolio_url
            )
          `)
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // Not found
          }
          console.error("Error fetching application:", error);
          throw new Error(`Failed to fetch application: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error fetching application:", error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
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

        const stats = data.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          total: data.length,
          pending: stats.pending || 0,
          under_review: stats.under_review || 0,
          interview_scheduled: stats.interview_scheduled || 0,
          rejected: stats.rejected || 0,
          accepted: stats.accepted || 0,
        };
      } catch (error) {
        console.error("Unexpected error fetching application stats:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
