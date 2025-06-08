'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Database } from "@/integrations/supabase/types"

type Job = Database['public']['Tables']['jobs']['Row']
type JobInsert = Database['public']['Tables']['jobs']['Insert']

export const useJobs = () => {
  const { data: jobs, isLoading: loading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  return { jobs, loading, error }
}

export const useCreateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobData: JobInsert) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job posted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to post job: ${error.message}`)
    },
  })
}
type JobUpdate = Database['public']['Tables']['jobs']['Update']

// Get all jobs
export function useAllJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Job[]
    },
  })
}

// Get job by ID
export function useJobById(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required')

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (error) throw error
      return data as Job
    },
    enabled: !!jobId,
  })
}


// Update job
export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: JobUpdate }) => {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single()

      if (error) throw error
      return data as Job
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['job', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job updated successfully')
    },
    onError: (error) => {
      console.error('Error updating job:', error)
      toast.error('Failed to update job')
    },
  })
}

// Delete job
export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting job:', error)
      toast.error('Failed to delete job')
    },
  })
}

export type { Job, JobInsert, JobUpdate }