'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    phone: '',
    current_location: '',
    bio: '',
    skills: [],
    experience_years: null,
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    email: '',
    role: '',
    certifications: [],
    preferred_cities: [],
    willing_to_relocate: false,
    job_seeking_status: '',
    expected_salary_sek: null,
    cv_url: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()

          if (error) {
            console.error('Error fetching profile:', error)
            return
          }

          if (data) {
            console.log('Fetched profile data:', data) // Log the fetched data
            setProfile({
              first_name: data.first_name || '',
              last_name: data.last_name || '',
              phone: data.phone || '',
              current_location: data.current_location || '',
              bio: data.bio || '',
              skills: data.skills || [],
              experience_years: data.experience_years !== undefined ? data.experience_years : null,
              linkedin_url: data.linkedin_url || '',
              github_url: data.github_url || '',
              portfolio_url: data.portfolio_url || '',
              email: data.email || '',
              role: data.role || '',
              certifications: data.certifications || [],
              preferred_cities: data.preferred_cities || [],
              willing_to_relocate: data.willing_to_relocate || false,
              job_seeking_status: data.job_seeking_status || '',
              expected_salary_sek: data.expected_salary_sek !== undefined ? data.expected_salary_sek : null,
              cv_url: data.cv_url || ''
            })
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      }

      fetchProfile()
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!user?.id) {
        throw new Error('User ID is not defined')
      }

      const profileData = {
        id: user.id,
        ...profile
      }

      const { error } = await supabase
          .from('profiles')
          .upsert(profileData)

      if (error) throw error

      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
    )
  }

  if (!user) {
    return null
  }

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-2 text-gray-600">Manage your professional information</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your professional details to improve job matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        value={profile.first_name}
                        onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                        required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        value={profile.last_name}
                        onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                        required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="current_location">Location</Label>
                  <Input
                      id="current_location"
                      value={profile.current_location}
                      onChange={(e) => setProfile({...profile, current_location: e.target.value})}
                      placeholder="City, Country"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      placeholder="Tell us about yourself and your career goals..."
                      rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                      id="skills"
                      value={profile.skills.join(', ')}
                      onChange={(e) => setProfile({...profile, skills: e.target.value.split(', ')})}
                      placeholder="List your key skills (e.g., JavaScript, React, Node.js, etc.)"
                      rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="experience_years">Experience Years</Label>
                  <Input
                      id="experience_years"
                      type="number"
                      value={profile.experience_years || ''}
                      onChange={(e) => setProfile({...profile, experience_years: e.target.value ? parseInt(e.target.value) : null})}
                      placeholder="e.g., 5"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Links</h3>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                        id="linkedin_url"
                        value={profile.linkedin_url}
                        onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                        id="github_url"
                        value={profile.github_url}
                        onChange={(e) => setProfile({...profile, github_url: e.target.value})}
                        placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio_url">Portfolio URL</Label>
                    <Input
                        id="portfolio_url"
                        value={profile.portfolio_url}
                        onChange={(e) => setProfile({...profile, portfolio_url: e.target.value})}
                        placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/jobs')}
                  >
                    View Jobs
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
