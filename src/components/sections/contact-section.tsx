'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-lg">Have questions? We'd love to hear from you</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="bg-white text-gray-900 min-h-32"
                required
              />
            </div>
            <div className="text-center">
              <Button type="submit" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}