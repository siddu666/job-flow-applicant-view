
export interface OnboardingData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Basic Info
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  
  // Professional Info
  currentTitle: string
  experience: string
  skills: string[]
  education: string
  expectedSalary: string
  
  // Visa/Work Eligibility
  workAuthorization: string
  visaStatus: string
  
  // Resume/Links
  resumeUrl: string
  linkedinUrl: string
  portfolioUrl: string
  githubUrl: string
}
