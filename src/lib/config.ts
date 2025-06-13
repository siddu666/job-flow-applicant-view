
export const config = {
  openai: {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
} as const;

export function validateConfig() {
  const missing: string[] = [];
  
  if (!config.openai.apiKey) {
    missing.push('OPENAI_API_KEY or NEXT_PUBLIC_OPENAI_API_KEY');
  }
  
  if (!config.supabase.url) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!config.supabase.anonKey) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
