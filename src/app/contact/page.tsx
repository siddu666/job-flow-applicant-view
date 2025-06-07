'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import OnboardingSteps from '@/components/onboarding/OnboardingSteps'
import {ContactSection} from "@/components/sections/contact-section";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(loginForm.email, loginForm.password)
      toast.success('Successfully signed in!')
      router.push('/profile')
    } catch {
      toast.error('Failed to sign in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex flex-col min-h-screen">
        {/* Contact section */}
        <ContactSection />

        {/* Login/Register Tabs */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Job Application System
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your account or create a new one
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                      Enter your email and password to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                            id="login-email"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                            id="login-password"
                            type="password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <OnboardingSteps />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  )
}
