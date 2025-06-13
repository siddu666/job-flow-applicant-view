export const config = {
  app: {
    name: 'Job Flow Platform',
    description: 'Professional recruitment and job matching platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  storage: {
    documentsUrl: process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/documents/',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    enabled: !!process.env.OPENAI_API_KEY,
  },
  features: {
    cvProcessing: true,
    skillGapAnalysis: true,
    adminCVGeneration: true,
    aiParsing: !!process.env.OPENAI_API_KEY,
    simpleParsing: true, // Fallback parsing without AI
  }
} as const;