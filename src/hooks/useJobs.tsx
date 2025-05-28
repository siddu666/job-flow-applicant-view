
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Simple, explicit type definitions
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range: string | null;
  description: string;
  requirements: string;
  experience_level: string | null;
  skills: string[] | null;
  posted_by: string;
  created_at: string;
  updated_at: string | null;
}

export interface JobInsert {
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string | null;
  description: string;
  requirements: string;
  experience_level?: string | null;
  skills?: string[] | null;
  posted_by: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobUpdate {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  salary_range?: string | null;
  description?: string;
  requirements?: string;
  experience_level?: string | null;
  skills?: string[] | null;
  posted_by?: string;
  updated_at?: string;
}

interface JobFilters {
  status?: string;
  location?: string;
  type?: string;
  posted_by?: string;
}

interface PublishedJobFilters {
  location?: string;
  type?: string;
  experience?: string;
  search?: string;
}

const fetchJobs = async (filters?: JobFilters): Promise<Job[]> => {
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

    return (data || []) as Job[];
  } catch (error) {
    console.error("Unexpected error fetching jobs:", error);
    throw error;
  }
};

export const useJobs = (filters?: JobFilters) => {
  return useQuery<Job[], Error>({
    queryKey: ['jobs', filters] as const,
    queryFn: () => fetchJobs(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

const fetchPublishedJobs = async (filters?: PublishedJobFilters): Promise<Job[]> => {
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

    return (data || []) as Job[];
  } catch (error) {
    console.error("Unexpected error fetching published jobs:", error);
    throw error;
  }
};

export const usePublishedJobs = (filters?: PublishedJobFilters) => {
  return useQuery<Job[], Error>({
    queryKey: ['published-jobs', filters] as const,
    queryFn: () => fetchPublishedJobs(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, JobInsert>({
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

        return data as Job;
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

  return useMutation<Job, Error, { id: string; updates: JobUpdate }>({
    mutationFn: async ({ id, updates }: { id: string; updates: JobUpdate }) => {
      try {
        const updateData = {
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

        return data as Job;
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

  return useMutation<void, Error, string>({
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

const fetchJobById = async (id: string): Promise<Job | null> => {
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

    return data as Job;
  } catch (error) {
    console.error("Unexpected error fetching job:", error);
    throw error;
  }
};

export const useJobById = (id: string) => {
  return useQuery<Job | null, Error>({
    queryKey: ['job', id] as const,
    queryFn: () => fetchJobById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

const fetchJobStats = async (): Promise<{ total: number; published: number }> => {
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
};

export const useJobStats = () => {
  return useQuery<{ total: number; published: number }, Error>({
    queryKey: ['job-stats'] as const,
    queryFn: fetchJobStats,
    staleTime: 2 * 60 * 1000,
  });
};
