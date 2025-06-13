'use client'
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e : any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(loginForm.email, loginForm.password);
      toast.success('Successfully signed in!');

      // Extract the redirect URL from the query parameters
      const redirectUrl = searchParams.get('redirect');
      // Redirect to the stored URL or a default page
      router.push(redirectUrl || '/jobs/recommended');
    } catch (err) {
      console.error('Sign in error:', err);
      toast.error('Failed to sign in. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 p-4">
        <Card className="w-full max-w-md mx-4 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-lg font-medium text-gray-700">Email</Label>
                <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-lg font-medium text-gray-700">Password</Label>
                <Input
                    id="login-password"
                    type="password"
                    placeholder="Your Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                    required
                />
              </div>
              <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-lg"
                  disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="text-center mt-4">
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Do not have an account? <span className="text-purple-600">Sign Up</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
