
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Job = Tables<'jobs'>;
export type JobInsert = TablesInsert<'jobs'>;
export type JobUpdate = TablesUpdate<'jobs'>;

export const useJobs = (filters?: {
  status?: string;
  location?: string;
  type?: string;
  posted_by?: string;
}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (filters?.status) {
          query = query.eq("status", filters.status);
        }

        if (filters?.location) {
          query = query.ilike("location", `%${filters.location}%`);
        }

        if (filters?.type) {
          query = query.eq("type", filters.type);
        }

        if (filters?.posted_by) {
          query = query.eq("posted_by", filters.posted_by);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching jobs:", error);
          throw new Error(`Failed to fetch jobs: ${error.message}`);
        }

        return data || [];
      } catch (error) {
        console.error("Unexpected error fetching jobs:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePublishedJobs = (filters?: {
  location?: string;
  type?: string;
  experience?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['published-jobs', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (filters?.location) {
          query = query.ilike("location", `%${filters.location}%`);
        }

        if (filters?.type) {
          query = query.eq("type", filters.type);
        }

        if (filters?.experience) {
          query = query.eq("experience_level", filters.experience);
        }

        if (filters?.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching published jobs:", error);
          throw new Error(`Failed to fetch published jobs: ${error.message}`);
        }

        return data || [];
      } catch (error) {
        console.error("Unexpected error fetching published jobs:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: JobInsert) => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .insert(job)
          .select()
          .single();

        if (error) {
          console.error("Error creating job:", error);
          throw new Error(`Failed to create job: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error creating job:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success("Job created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create job: ${error.message}`);
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: JobUpdate;
    }) => {
      try {
        const updateData: JobUpdate = {
          ...updates,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("jobs")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Error updating job:", error);
          throw new Error(`Failed to update job: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error updating job:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success("Job updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update job: ${error.message}`);
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from("jobs")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error deleting job:", error);
          throw new Error(`Failed to delete job: ${error.message}`);
        }
      } catch (error) {
        console.error("Unexpected error deleting job:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success("Job deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete job: ${error.message}`);
    },
  });
};

export const useJobById = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null;
          }
          console.error("Error fetching job:", error);
          throw new Error(`Failed to fetch job: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error fetching job:", error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useJobStats = () => {
  return useQuery({
    queryKey: ['job-stats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("id");

        if (error) {
          console.error("Error fetching job stats:", error);
          throw new Error(`Failed to fetch job stats: ${error.message}`);
        }

        return {
          total: data.length,
          published: data.length,
        };
      } catch (error) {
        console.error("Unexpected error fetching job stats:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};
