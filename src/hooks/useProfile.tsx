import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";
import {UseAllCandidatesResult} from "@/interfaces/UseAllCandidatesResult.ts";

export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<Profile | null> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          throw new Error(`Failed to fetch profile: ${error.message}`);
        }
        
        console.log(data)

        return data;
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: ProfileUpdate;
    }): Promise<Profile> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Error updating profile:", error);
          throw new Error(`Failed to update profile: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error updating profile:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
};

export const useUploadCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      try {
        // For now, return a placeholder URL since we don't have storage configured
        console.log("CV upload not implemented:", file.name);
        return "placeholder-cv-url";
      } catch (error) {
        console.error("Unexpected error uploading CV:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("CV uploaded successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload CV: ${error.message}`);
    },
  });
};

export const useAllCandidates = (filters?: {
  skills?: string[];
  experience_years?: number;
  location?: string;
  job_seeking_status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): UseAllCandidatesResult => {
  const queryResult = useQuery<{ data: Profile[]; total: number }, Error>({
    queryKey: ['candidates', filters],
    queryFn: async (): Promise<{ data: Profile[]; total: number }> => {
      try {
        let query = supabase
            .from("profiles")
            .select("*", { count: 'exact' });

        if (filters?.skills && filters.skills.length > 0) {
          query = query.contains("skills", filters.skills);
        }

        if (filters?.experience_years) {
          query = query.gte("experience_years", filters.experience_years);
        }

        if (filters?.location) {
          query = query.ilike("current_location", `%${filters.location}%`);
        }

        if (filters?.job_seeking_status) {
          query = query.eq("job_seeking_status", filters.job_seeking_status);
        }

        if (filters?.search) {
          query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
        }

        if (filters?.page && filters?.limit) {
          const { from, to } = getPaginationRange(filters.page, filters.limit);
          query = query.range(from, to);
        }

        const { data, error, count } = await query;

        if (error) {
          console.error("Error fetching candidates:", error);
          throw new Error(`Failed to fetch candidates: ${error.message}`);
        }

        return { data: data || [], total: count || 0 };
      } catch (error) {
        console.error("Unexpected error fetching candidates:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: queryResult.data?.data || [],
    total: queryResult.data?.total || 0,
    isLoading: queryResult.isLoading,
    error: queryResult.error || undefined,
  };
};

const getPaginationRange = (page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
};

export const useHandlePeriodicResponse = () => {
  return {
    handleResponse: () => {
      console.log("Periodic response handler not implemented");
    }
  };
};

export const useSendPeriodicCheck = () => {
  return {
    sendCheck: () => {
      console.log("Periodic check sender not implemented");
    }
  };
};
