// types.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          company: string;
          location: string; 
          salary_range: string | null;
          requirements: string[];
          benefits: string[];
          status: string;
          posted_by: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description: string;
          company: string;
          location: string;
          salary_range?: string | null;
          requirements: string[];
          benefits: string[];
          status?: string;
          posted_by: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string;
          company?: string;
          location?: string;
          salary_range?: string | null;
          requirements?: string[];
          benefits?: string[];
          status?: string;
          posted_by?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          job_id: string;
          user_id: string;
          status: string;
          cover_letter: string | null;
          resume_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          job_id: string;
          user_id: string;
          status?: string;
          cover_letter?: string | null;
          resume_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          job_id?: string;
          user_id?: string;
          status?: string;
          cover_letter?: string | null;
          resume_url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
