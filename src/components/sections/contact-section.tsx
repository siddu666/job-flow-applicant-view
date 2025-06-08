'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react'

export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after success message
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 3000)
  }

  return (
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-indigo-400/20 rounded-full animate-pulse delay-500"></div>

        <div className="relative container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-20 relative">
            <div className="inline-block">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
                Let&apos;s Connect
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your career with Sweden&apos;s leading IT recruitment specialists? 
              Our expert consultants are standing by to connect you with your ideal opportunity. 
              Get personalized career guidance and exclusive access to premium positions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Information Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

                <CardContent className="p-8">
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></div>
                      Get in Touch
                    </h3>

                    <div className="space-y-6">
                      {[
                        { icon: Mail, text: 'hrteam@justeragroup.com', color: 'blue', subtext: 'Response within 2 hours' },
                        { icon: Phone, text: '+46734852217', color: 'green', subtext: 'Direct line to consultants' },
                        { icon: MapPin, text: 'Stockholm, Sweden', color: 'purple', subtext: 'Serving all of Scandinavia' }
                      ].map((item, index) => (
                          <div key={index} className="group/item flex items-center p-4 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 cursor-pointer">
                            <div className={`p-3 rounded-xl bg-${item.color}-500/10 group-hover/item:bg-${item.color}-500/20 transition-all duration-300`}>
                              <item.icon className={`h-6 w-6 text-${item.color}-600 group-hover/item:scale-110 transition-transform duration-300`} />
                            </div>
                            <div className="ml-4">
                              <div className="text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-300">
                                {item.text}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {item.subtext}
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center mb-4">
                      <Clock className="h-5 w-5 text-indigo-600 mr-3" />
                      <h4 className="text-lg font-semibold text-gray-900">Office Hours</h4>
                    </div>
                    <div className="space-y-3 text-gray-600 ml-8">
                      <div className="flex justify-between items-center">
                        <span>Monday - Friday</span>
                        <span className="font-medium text-gray-900">8:00 AM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 group-hover:shadow-3xl group-hover:scale-[1.02]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>

                <CardHeader className="pb-6 pt-8 px-8">
                  <CardTitle className="text-3xl font-bold text-gray-900 flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-4"></div>
                    Send Message
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                          <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
                        <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
                      </div>
                  ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="John"
                                className="border-2 border-gray-200 rounded-xl h-12 px-4 focus:border-blue-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
                                required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Doe"
                                className="border-2 border-gray-200 rounded-xl h-12 px-4 focus:border-blue-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
                                required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                          <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className="border-2 border-gray-200 rounded-xl h-12 px-4 focus:border-blue-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
                              required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
                          <Input
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              placeholder="How can we help you?"
                              className="border-2 border-gray-200 rounded-xl h-12 px-4 focus:border-blue-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
                              required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                          <Textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              placeholder="Tell us more about your inquiry..."
                              rows={5}
                              className="border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 focus:ring-0 transition-all duration-300 hover:border-gray-300 resize-none"
                              required
                          />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                Sending Message...
                              </div>
                          ) : (
                              <div className="flex items-center justify-center">
                                <Send className="h-5 w-5 mr-2" />
                                Send Message
                              </div>
                          )}
                        </Button>
                      </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
  )
}