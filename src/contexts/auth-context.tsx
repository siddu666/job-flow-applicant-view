'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import {OnboardingData} from "@/components/onboarding/OnboardingSteps";

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (onboardingData : OnboardingData ) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Record<string, unknown>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true);

    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          // Check if this is a new user who just confirmed their email
          if (session?.user && !session.user.user_metadata?.profile_created) {
            // Check if profile exists
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', session.user.id)
              .single();

            if (!existingProfile) {
              // Profile doesn't exist, user likely just confirmed email
              console.log('User confirmed email but no profile exists');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          // Only redirect to signin if we're not already there
          if (window.location.pathname !== '/signin') {
            router.push('/signin')
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (onboardingData: OnboardingData) => {
    const { data, error } = await supabase.auth.signUp({
      email: onboardingData.email,
      password: onboardingData.password,
      options: {
        data: {
          role: 'applicant',
          first_name: onboardingData.firstName,
          last_name: onboardingData.lastName,
        },
        emailRedirectTo: `${window.location.origin}/signup`,
      },
    });

    if (error) throw error;

    // Check if user was created successfully
    if (!data.user) {
      throw new Error('User creation failed');
    }

    // Only create profile if user was successfully created and confirmed
    // For email confirmation flows, data.user exists but session might be null
    if (data.user && !data.user.email_confirmed_at && !data.session) {
      // User needs to confirm email - don't create profile yet
      console.log('User needs to confirm email before profile creation');
      return;
    }

    // Create profile record only after successful user creation
    const profileData = {
      id: data.user.id,
      email: data.user.email || '',
      role: 'applicant',
      first_name: onboardingData.firstName,
      last_name: onboardingData.lastName,
      phone: onboardingData.phone,
      current_location: onboardingData.city,
      skills: onboardingData.skills,
      experience_years: onboardingData.experience,
      job_seeking_status: onboardingData.preferredJobType,
      availability: onboardingData.availability,
      linkedin_url: onboardingData.linkedinUrl,
      portfolio_url: onboardingData.portfolioUrl,
      willing_to_relocate: onboardingData.authorizedToWork,
    };

    const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      throw profileError;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/signin?type=recovery`,
    })
    if (error) throw error
  }

  const updateProfile = async (data: Record<string, unknown>) => {
    // Add your update profile logic here, e.g., using supabase.from('profiles').update()
    // Example:
    if (user) {
        const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', user.id);

        if (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }
  }

  const value = {
    user,
    session,
    loading: !isMounted || loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}