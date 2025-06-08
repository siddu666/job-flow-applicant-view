'use client'

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'
import {toast} from "sonner";

type Profile = Database['public']['Tables']['profiles']['Row']

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist
          return null
        }
        throw error
      }
      return data as Profile
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] })
    },
  })
}


interface UploadCVParams {
  id: string;
  file: File;
}

export const useUploadCV = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, UploadCVParams>({
    mutationFn: async ({ id, file }: UploadCVParams): Promise<string> => {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}/cv.${fileExt}`;

        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload CV: ${uploadError.message}`);
        }

        const twoYearsInSeconds = 2 * 365 * 24 * 60 * 60; // 63,072,000 seconds

        // Generate a signed URL for private access
        const { data, error: signedUrlError } = await supabase.storage
            .from('documents')
            .createSignedUrl(fileName, twoYearsInSeconds);

        if (signedUrlError) {
          console.error('Error generating signed URL:', signedUrlError);
          throw new Error(`Failed to generate signed URL: ${signedUrlError.message}`);
        }

        return data?.signedUrl;
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
