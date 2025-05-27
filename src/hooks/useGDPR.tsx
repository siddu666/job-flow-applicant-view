
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type GDPRRequest = Tables<'gdpr_requests'>;
export type GDPRRequestInsert = TablesInsert<'gdpr_requests'>;

export const useGDPRRequests = (filters?: {
  userId?: string;
  status?: GDPRRequest['status'];
  requestType?: GDPRRequest['request_type'];
}) => {
  return useQuery({
    queryKey: ['gdpr-requests', filters],
    queryFn: async (): Promise<GDPRRequest[]> => {
      try {
        let query = supabase
          .from("gdpr_requests")
          .select(`
            *,
            user:profiles!gdpr_requests_user_id_fkey(
              id,
              full_name,
              email
            ),
            processor:profiles!gdpr_requests_processed_by_fkey(
              id,
              full_name,
              email
            )
          `)
          .order("created_at", { ascending: false });

        if (filters?.userId) {
          query = query.eq("user_id", filters.userId);
        }

        if (filters?.status) {
          query = query.eq("status", filters.status);
        }

        if (filters?.requestType) {
          query = query.eq("request_type", filters.requestType);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching GDPR requests:", error);
          throw new Error(`Failed to fetch GDPR requests: ${error.message}`);
        }

        return data || [];
      } catch (error) {
        console.error("Unexpected error fetching GDPR requests:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateGDPRRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Omit<GDPRRequestInsert, 'verification_token'>): Promise<GDPRRequest> => {
      try {
        const verificationToken = crypto.randomUUID();
        
        const requestData: GDPRRequestInsert = {
          ...request,
          verification_token: verificationToken,
          status: 'pending',
        };

        const { data, error } = await supabase
          .from("gdpr_requests")
          .insert(requestData)
          .select()
          .single();

        if (error) {
          console.error("Error creating GDPR request:", error);
          throw new Error(`Failed to create GDPR request: ${error.message}`);
        }

        // Log the action for audit trail
        await supabase
          .from("audit_logs")
          .insert({
            user_id: request.user_id,
            action: "gdpr_request_created",
            resource_type: "gdpr_request",
            resource_id: data.id,
            gdpr_related: true,
            metadata: { 
              request_type: request.request_type,
              requested_by_email: request.requested_by_email
            }
          });

        // TODO: Send verification email
        // This would typically integrate with an email service

        return data;
      } catch (error) {
        console.error("Unexpected error creating GDPR request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gdpr-requests'] });
      toast.success("GDPR request submitted successfully! Please check your email for verification.");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit GDPR request: ${error.message}`);
    },
  });
};

export const useProcessGDPRRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      action,
      processedBy,
      completionDetails,
      rejectionReason 
    }: { 
      id: string; 
      action: 'approve' | 'reject' | 'complete';
      processedBy: string;
      completionDetails?: any;
      rejectionReason?: string;
    }): Promise<GDPRRequest> => {
      try {
        const updateData = {
          processed_by: processedBy,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...(action === 'approve' && { status: 'in_progress' as const }),
          ...(action === 'complete' && { 
            status: 'completed' as const,
            completion_details: completionDetails 
          }),
          ...(action === 'reject' && { 
            status: 'rejected' as const,
            rejection_reason: rejectionReason 
          }),
        };

        const { data, error } = await supabase
          .from("gdpr_requests")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Error processing GDPR request:", error);
          throw new Error(`Failed to process GDPR request: ${error.message}`);
        }

        // Log the action for audit trail
        await supabase
          .from("audit_logs")
          .insert({
            user_id: processedBy,
            action: `gdpr_request_${action}`,
            resource_type: "gdpr_request",
            resource_id: id,
            gdpr_related: true,
            metadata: { 
              action,
              completion_details: completionDetails,
              rejection_reason: rejectionReason
            }
          });

        // If it's a data deletion request that's completed, anonymize the user data
        if (action === 'complete' && data.request_type === 'data_deletion') {
          await supabase.rpc('anonymize_user_data', { user_id: data.user_id });
        }

        return data;
      } catch (error) {
        console.error("Unexpected error processing GDPR request:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gdpr-requests'] });
      const actionMessage = {
        approve: 'approved',
        reject: 'rejected',
        complete: 'completed'
      }[variables.action];
      toast.success(`GDPR request ${actionMessage} successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to process GDPR request: ${error.message}`);
    },
  });
};

export const useExportUserData = () => {
  return useMutation({
    mutationFn: async (userId: string): Promise<any> => {
      try {
        // Fetch all user data for export
        const [profileData, applicationsData, gdprRequestsData] = await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single(),
          supabase
            .from("applications")
            .select("*")
            .eq("applicant_id", userId)
            .eq("anonymized", false),
          supabase
            .from("gdpr_requests")
            .select("*")
            .eq("user_id", userId)
        ]);

        if (profileData.error) {
          throw new Error(`Failed to fetch profile data: ${profileData.error.message}`);
        }

        const exportData = {
          profile: profileData.data,
          applications: applicationsData.data || [],
          gdpr_requests: gdprRequestsData.data || [],
          export_date: new Date().toISOString(),
          format_version: "1.0"
        };

        return exportData;
      } catch (error) {
        console.error("Unexpected error exporting user data:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("User data exported successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to export user data: ${error.message}`);
    },
  });
};

export const useDataRetentionCleanup = () => {
  return useMutation({
    mutationFn: async (): Promise<{ cleaned: number }> => {
      try {
        const { error } = await supabase.rpc('cleanup_expired_data');

        if (error) {
          console.error("Error cleaning up expired data:", error);
          throw new Error(`Failed to cleanup expired data: ${error.message}`);
        }

        // This would return the number of records cleaned up
        // The actual implementation would be in the database function
        return { cleaned: 0 };
      } catch (error) {
        console.error("Unexpected error cleaning up expired data:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(`Data retention cleanup completed. ${data.cleaned} records processed.`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to cleanup expired data: ${error.message}`);
    },
  });
};

export const useAuditLogs = (filters?: {
  userId?: string;
  action?: string;
  resourceType?: string;
  gdprRelated?: boolean;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("audit_logs")
          .select(`
            *,
            user:profiles(
              id,
              full_name,
              email
            )
          `)
          .order("created_at", { ascending: false })
          .limit(1000); // Limit to last 1000 entries

        if (filters?.userId) {
          query = query.eq("user_id", filters.userId);
        }

        if (filters?.action) {
          query = query.eq("action", filters.action);
        }

        if (filters?.resourceType) {
          query = query.eq("resource_type", filters.resourceType);
        }

        if (filters?.gdprRelated !== undefined) {
          query = query.eq("gdpr_related", filters.gdprRelated);
        }

        if (filters?.dateFrom) {
          query = query.gte("created_at", filters.dateFrom);
        }

        if (filters?.dateTo) {
          query = query.lte("created_at", filters.dateTo);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching audit logs:", error);
          throw new Error(`Failed to fetch audit logs: ${error.message}`);
        }

        return data || [];
      } catch (error) {
        console.error("Unexpected error fetching audit logs:", error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};
