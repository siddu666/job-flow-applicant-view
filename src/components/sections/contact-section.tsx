'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin } from 'lucide-react'

export function ContactSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold">Email</h3>
                </div>
                <p className="text-gray-600">contact@jobflow.com</p>
                <p className="text-gray-600">support@jobflow.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold">Phone</h3>
                </div>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-gray-600">Mon-Fri 9am-6pm EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold">Office</h3>
                </div>
                <p className="text-gray-600">123 Business Avenue</p>
                <p className="text-gray-600">Suite 100</p>
                <p className="text-gray-600">New York, NY 10001</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}