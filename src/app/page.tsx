
'use client'

import { useAuth } from "@/contexts/auth-context";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Building, Users, Briefcase, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile(user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Justera Group AB</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                Jobs
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                      Admin
                    </Link>
                  )}
                  <Button onClick={signOut} variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button>Sign In</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Find Your Next Career Opportunity
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            GDPR-compliant job application platform designed for the Swedish market
            with comprehensive data protection and security features.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/jobs">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Browse Jobs
              </Button>
            </Link>
            {!user && (
              <Link href="/auth">
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">GDPR Compliant</h3>
            <p className="text-gray-600">Full compliance with Swedish and EU data protection regulations</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Friendly</h3>
            <p className="text-gray-600">Intuitive interface for both candidates and employers</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional</h3>
            <p className="text-gray-600">Advanced features for modern recruitment needs</p>
          </div>
        </div>
      </main>
    </div>
  );
}
