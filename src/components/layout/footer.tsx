
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                Justera Group
              </h3>
              <div className="text-blue-300 font-medium mb-4">Career Platform</div>
            </div>
            <p className="text-gray-300 mb-6 max-w-lg leading-relaxed">
              Connecting exceptional talent with outstanding opportunities worldwide. 
              We specialize in executive search, professional recruitment, and career advancement 
              services across multiple industries.
            </p>
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://linkedin.com/company/justera-ab" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://twitter.com/justeragroup" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Justera Group. All rights reserved.
            </div>
          </div>
          
          {/* Job Seekers */}
          <div>
            <h4 className="font-semibold mb-6 text-lg text-blue-300">For Job Seekers</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/jobs" className="hover:text-blue-400 transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-blue-400 transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Apply Now
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-blue-400 transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-blue-400 transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-6 text-lg text-blue-300">Company</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a 
                  href="https://justeragroup.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-400 transition-colors flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="https://careers.justeragroup.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-400 transition-colors flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Our Services
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-sm text-center lg:text-left">
              Professional recruitment solutions trusted by leading companies worldwide
            </div>
            <div className="text-gray-400 text-sm text-center lg:text-right">
              Empowering careers since 2020 | Global reach, personal touch
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
