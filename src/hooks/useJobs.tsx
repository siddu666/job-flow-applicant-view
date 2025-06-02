import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

interface JobFilters {
  location?: string;
  type?: string;
  experience_level?: string;
  skills?: string[];
}

export const useJobs = (filters: JobFilters = {}) => {
  const queryClient = useQueryClient();

  // Get all jobs with filters
  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters.type) {
        query = query.eq("type", filters.type);
      }

      if (filters.experience_level) {
        query = query.eq("experience_level", filters.experience_level);
      }

      if (filters.skills && filters.skills.length > 0) {
        query = query.overlaps("skills", filters.skills);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Job[];
    },
  });

  // Get single job
  const useJob = (jobId: string) => {
    return useQuery({
      queryKey: ["job", jobId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        if (error) throw error;
        return data as Job;
      },
      enabled: !!jobId,
    });
  };

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (jobData: Omit<JobInsert, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          ...jobData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job posted successfully");
    },
    onError: (error) => {
      console.error("Error creating job:", error);
      toast.error("Failed to create job");
    },
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, ...updates }: JobUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("jobs")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job updated successfully");
    },
    onError: (error) => {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    },
  });

  return {
    jobs,
    isLoading,
    error,
    useJob,
    createJob: createJobMutation.mutate,
    createJobAsync: createJobMutation.mutateAsync,
    updateJob: updateJobMutation.mutate,
    deleteJob: deleteJobMutation.mutate,
    isCreating: createJobMutation.isPending,
    isUpdating: updateJobMutation.isPending,
    isDeleting: deleteJobMutation.isPending,
  };
};

export type { Job, JobInsert, JobUpdate };