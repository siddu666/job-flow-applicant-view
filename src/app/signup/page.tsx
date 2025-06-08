// pages/signup.js
'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OnboardingSteps from "@/components/onboarding/OnboardingSteps";
import Link from 'next/link';

const SignUpPage = () => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Us</h1>
            <p className="text-lg text-gray-600 text-center">
              Create your account and start your journey with us.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <OnboardingSteps />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <Link href="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
              Already have an account? <span className="text-purple-600">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default SignUpPage;
