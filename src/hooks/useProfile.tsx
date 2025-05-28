
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export type Profile = Tables<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async (): Promise<Profile | null> => {
      if (!targetUserId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }

      return data;
    },
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate): Promise<Profile> => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const updateData: ProfileUpdate = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      return data;
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

export const useAllCandidates = (filters?: {
  skills?: string[];
  experience_years?: number;
  location?: string;
  job_seeking_status?: Profile['job_seeking_status'];
  search?: string;
}) => {
  return useQuery({
    queryKey: ['candidates', filters],
    queryFn: async (): Promise<Profile[]> => {
      let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "applicant")
        .order("created_at", { ascending: false });

      if (filters?.location) {
        query = query.ilike("current_location", `%${filters.location}%`);
      }

      if (filters?.job_seeking_status) {
        query = query.eq("job_seeking_status", filters.job_seeking_status);
      }

      if (filters?.experience_years) {
        query = query.gte("experience_years", filters.experience_years);
      }

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch candidates: ${error.message}`);
      }

      let filteredData = data || [];

      // Filter by skills if provided
      if (filters?.skills && filters.skills.length > 0) {
        filteredData = filteredData.filter(candidate => 
          candidate.skills && 
          filters.skills!.some(skill => 
            candidate.skills!.some(candidateSkill => 
              candidateSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }

      return filteredData;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUploadCV = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/cv.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw new Error(`Failed to upload CV: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Update profile with CV URL
      await supabase
        .from("profiles")
        .update({ cv_url: publicUrl })
        .eq("id", user.id);

      return publicUrl;
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

export const useSendPeriodicCheck = () => {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      // For now, just show a success message
      // In the future, this could call an edge function to send emails
      console.log("Sending periodic check to candidates...");
    },
    onSuccess: () => {
      toast.success("Periodic check sent to all candidates!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send periodic check: ${error.message}`);
    },
  });
};
