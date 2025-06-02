
'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { Database } from "@/integrations/supabase/types";

type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];
type ApplicationUpdate = Database['public']['Tables']['applications']['Update'];

export const useApplications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's applications
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          jobs (
            id,
            title,
            company,
            location,
            type
          )
        `)
        .eq("applicant_id", user.id)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      return data as (Application & { jobs: any })[];
    },
    enabled: !!user?.id,
  });

  // Check if user has applied to a job
  const useHasApplied = (jobId: string) => {
    return useQuery({
      queryKey: ["application", jobId, user?.id],
      queryFn: async () => {
        if (!user?.id || !jobId) return false;

        const { data, error } = await supabase
          .from("applications")
          .select("id")
          .eq("job_id", jobId)
          .eq("applicant_id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
      },
      enabled: !!user?.id && !!jobId,
    });
  };

  // Apply to job mutation
  const applyToJobMutation = useMutation({
    mutationFn: async ({
      jobId,
      coverLetter,
      cvUrl,
    }: {
      jobId: string;
      coverLetter?: string;
      cvUrl?: string;
    }) => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("applications")
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          cover_letter: coverLetter,
          cv_url: cvUrl,
          status: "pending",
          applied_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application"] });
      toast.success("Application submitted successfully");
    },
    onError: (error) => {
      console.error("Error applying to job:", error);
      toast.error("Failed to submit application");
    },
  });

  // Update application status (for admin)
  const updateApplicationMutation = useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: Application['status'];
    }) => {
      const { data, error } = await supabase
        .from("applications")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application status updated");
    },
    onError: (error) => {
      console.error("Error updating application:", error);
      toast.error("Failed to update application");
    },
  });

  // Get all applications (for admin)
  const useAllApplications = () => {
    return useQuery({
      queryKey: ["all-applications"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("applications")
          .select(`
            *,
            jobs (
              id,
              title,
              company,
              location,
              type
            ),
            profiles (
              id,
              first_name,
              last_name,
              email,
              phone,
              cv_url
            )
          `)
          .order("applied_at", { ascending: false });

        if (error) throw error;
        return data as (Application & { jobs: any; profiles: any })[];
      },
    });
  };

  return {
    applications,
    isLoading,
    error,
    useHasApplied,
    useAllApplications,
    applyToJob: applyToJobMutation.mutate,
    applyToJobAsync: applyToJobMutation.mutateAsync,
    updateApplicationStatus: updateApplicationMutation.mutate,
    isApplying: applyToJobMutation.isPending,
    isUpdating: updateApplicationMutation.isPending,
  };
};

export type { Application, ApplicationInsert, ApplicationUpdate };
