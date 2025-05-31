
import Link from 'next/link'
import { Briefcase, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Our Services', href: '/#services' },
    { label: 'Industries', href: '/#industries' },
    { label: 'Contact', href: '/#contact' },
  ],
  careers: [
    { label: 'Open Positions', href: '/jobs' },
    { label: 'Life at Justera', href: '/jobs#culture' },
    { label: 'Benefits', href: '/jobs#benefits' },
    { label: 'Apply Now', href: '/auth' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Justera Group AB</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering businesses with innovative IT solutions. Join our team for exciting career opportunities.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://linkedin.com/company/justera-group" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/justera-group" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Careers Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Careers</h3>
            <ul className="space-y-3">
              {footerLinks.careers.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <a 
                  href="mailto:info@justera-group.com" 
                  className="hover:text-white transition-colors"
                >
                  info@justera-group.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <a 
                  href="tel:+46123456789" 
                  className="hover:text-white transition-colors"
                >
                  +46 12 345 67 89
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Stockholm, Sweden</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2024 Justera Group AB. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
