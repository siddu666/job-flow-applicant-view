
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

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", targetUserId)
          .eq("anonymized", false)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null;
          }
          console.error("Error fetching profile:", error);
          throw new Error(`Failed to fetch profile: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
        throw error;
      }
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

      try {
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
          console.error("Error updating profile:", error);
          throw new Error(`Failed to update profile: ${error.message}`);
        }

        // Log the action for audit trail
        await supabase
          .from("audit_logs")
          .insert({
            user_id: user.id,
            action: "profile_updated",
            resource_type: "profile",
            resource_id: user.id,
            gdpr_related: true,
            metadata: { updates: Object.keys(updates) }
          });

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
      try {
        let query = supabase
          .from("profiles")
          .select("*")
          .eq("role", "applicant")
          .eq("anonymized", false)
          .order("created_at", { ascending: false });

        if (filters?.location) {
          query = query.ilike("location", `%${filters.location}%`);
        }

        if (filters?.job_seeking_status) {
          query = query.eq("job_seeking_status", filters.job_seeking_status);
        }

        if (filters?.experience_years) {
          query = query.gte("experience_years", filters.experience_years);
        }

        if (filters?.search) {
          query = query.or(`full_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%,current_position.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching candidates:", error);
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
      } catch (error) {
        console.error("Unexpected error fetching candidates:", error);
        throw error;
      }
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

      try {
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

export const useSendPeriodicCheck = () => {
  return useMutation({
    mutationFn: async (): Promise<{ sent: number }> => {
      try {
        // This would trigger the periodic check email
        // In a real implementation, this would call an edge function
        const { data, error } = await supabase.functions.invoke('send-periodic-check');

        if (error) {
          throw new Error(`Failed to send periodic check: ${error.message}`);
        }

        return data;
      } catch (error) {
        console.error("Unexpected error sending periodic check:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(`Periodic check emails sent to ${data.sent} candidates!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to send periodic check: ${error.message}`);
    },
  });
};

export const useHandlePeriodicResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      token, 
      response 
    }: { 
      token: string; 
      response: 'keep' | 'remove' 
    }): Promise<void> => {
      try {
        if (response === 'remove') {
          // Call the GDPR deletion function
          const { error } = await supabase.functions.invoke('handle-account-deletion', {
            body: { token }
          });

          if (error) {
            throw new Error(`Failed to process account deletion: ${error.message}`);
          }
        } else {
          // Update last activity
          const { error } = await supabase.functions.invoke('update-activity', {
            body: { token, response }
          });

          if (error) {
            throw new Error(`Failed to update activity: ${error.message}`);
          }
        }
      } catch (error) {
        console.error("Unexpected error handling periodic response:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      const message = variables.response === 'keep' 
        ? "Thank you! Your profile will remain active."
        : "Your account has been scheduled for deletion as requested.";
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(`Failed to process response: ${error.message}`);
    },
  });
};
