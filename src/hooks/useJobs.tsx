
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  experience_level?: string;
  skills?: string[];
  page?: number;
  limit?: number;
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

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

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

export const useAllJobs = (filters: JobFilters = {}) => {
  const { page = 1, limit = 10, ...otherFilters } = filters;
  
  return useQuery({
    queryKey: ["allJobs", filters],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select("*", { count: 'exact' })
        .order("created_at", { ascending: false });

      if (otherFilters.search) {
        query = query.or(`title.ilike.%${otherFilters.search}%,description.ilike.%${otherFilters.search}%,company.ilike.%${otherFilters.search}%`);
      }

      if (otherFilters.location) {
        query = query.ilike("location", `%${otherFilters.location}%`);
      }

      if (otherFilters.type) {
        query = query.eq("type", otherFilters.type);
      }

      if (otherFilters.experience_level) {
        query = query.eq("experience_level", otherFilters.experience_level);
      }

      if (otherFilters.skills && otherFilters.skills.length > 0) {
        query = query.overlaps("skills", otherFilters.skills);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      
      return {
        data: data as Job[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
  });
};

export type { Job, JobInsert, JobUpdate };
