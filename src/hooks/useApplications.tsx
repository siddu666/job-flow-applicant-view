import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/integrations/supabase/client.ts";

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error.message);
        throw new Error(error.message);
      }

      return data ?? [];
    },
  });
};