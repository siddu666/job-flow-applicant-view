'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { Database } from "@/integrations/supabase/types";

type Application = Database['public']['Tables']['applications']['Row'] & {
  job?: {
    id: string;
    title: string;
    company_name: string;
    location: string;
    description: string;
    employment_type?: string;
    salary_range?: string;
  };
};
type ApplicationUpdate = Database['public']['Tables']['applications']['Update'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];

export const useApplications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's applications
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ["all-applications", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");

      // Fetch all applications with job and applicant details
      const { data, error } = await supabase
          .from("applications")
          .select(`
        *,
        jobs(*),
        profiles:applications_applicant_id_fkey(
          id,
          first_name,
          last_name,
          email,
          phone,
          availability,
          skills
        )
      `)
          .order("created_at", { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched applications:', data);

      // Transform data to match your interface
      return data?.map(app => ({
        ...app,
        applicant: app.profiles ? {
          id: app.profiles.id,
          full_name: `${app.profiles.first_name} ${app.profiles.last_name}`,
          email: app.profiles.email,
          phone: app.profiles.phone,
          availability: app.profiles.availability,
          skills: app.profiles.skills
        } : null
      })) || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
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
    mutationFn: async ({ jobId, coverLetter, cvUrl }: { jobId: string; coverLetter?: string; cvUrl?: string }) => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
          .from("applications")
          .insert({
            job_id: jobId,
            applicant_id: user.id,
            cover_letter: coverLetter,
            cv_url: cvUrl,
            status: "pending",
            created_at: new Date().toISOString()
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
  /*const updateApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      const { data, error } = await supabase
          .from("applications")
          .update({
            status
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
  });*/

  // Get all applications (for admin)
  const useAllApplications = () => {
    return useQuery({
      queryKey: ["all-applications"],
      queryFn: async () => {
        const { data, error } = await supabase
            .from("applications")
            .select('*, jobs(*), profiles(*)')
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as (Application & {
          jobs: Database['public']['Tables']['jobs']['Row'];
          profiles: Database['public']['Tables']['profiles']['Row'];
        })[];
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
    //updateApplicationStatus: updateApplicationMutation.mutate,
    isApplying: applyToJobMutation.isPending,
    //isUpdating: updateApplicationMutation.isPending,
  };
};

export type { Application, ApplicationInsert, ApplicationUpdate };
