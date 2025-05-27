
import { z } from "zod";

// GDPR and security validations
export const gdprConsentSchema = z.object({
  gdpr_consent: z.boolean().refine(val => val === true, {
    message: "GDPR consent is required"
  }),
  gdpr_marketing_consent: z.boolean().optional(),
});

// Profile validation
export const profileSchema = z.object({
  full_name: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Full name contains invalid characters"),
  
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  
  linkedin_url: z.string()
    .url("Invalid LinkedIn URL")
    .regex(/^https:\/\/(www\.)?linkedin\.com\/.*$/, "Must be a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  
  github_url: z.string()
    .url("Invalid GitHub URL")
    .regex(/^https:\/\/(www\.)?github\.com\/.*$/, "Must be a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  
  portfolio_url: z.string()
    .url("Invalid portfolio URL")
    .optional()
    .or(z.literal("")),
  
  bio: z.string()
    .max(2000, "Bio must not exceed 2000 characters")
    .optional(),
  
  skills: z.array(z.string().min(1, "Skill cannot be empty").max(50, "Skill name too long"))
    .max(20, "Maximum 20 skills allowed")
    .optional(),
  
  experience_years: z.number()
    .int("Experience years must be a whole number")
    .min(0, "Experience years cannot be negative")
    .max(70, "Experience years seems unrealistic")
    .optional(),
  
  current_position: z.string()
    .max(100, "Current position must not exceed 100 characters")
    .optional(),
  
  current_company: z.string()
    .max(100, "Current company must not exceed 100 characters")
    .optional(),
  
  location: z.string()
    .max(100, "Location must not exceed 100 characters")
    .optional(),
  
  preferred_salary: z.number()
    .min(0, "Preferred salary cannot be negative")
    .max(10000000, "Preferred salary seems unrealistic")
    .optional(),
  
  job_seeking_status: z.enum(['actively_looking', 'open_to_offers', 'not_looking'])
    .optional(),
}).merge(gdprConsentSchema);

// Job validation
export const jobSchema = z.object({
  title: z.string()
    .min(5, "Job title must be at least 5 characters")
    .max(200, "Job title must not exceed 200 characters"),
  
  description: z.string()
    .min(50, "Job description must be at least 50 characters")
    .max(10000, "Job description must not exceed 10,000 characters"),
  
  requirements: z.array(z.string().min(1, "Requirement cannot be empty").max(200))
    .min(1, "At least one requirement is needed")
    .max(20, "Maximum 20 requirements allowed")
    .optional(),
  
  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters"),
  
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'temporary']),
  
  salary_min: z.number()
    .min(0, "Minimum salary cannot be negative")
    .max(10000000, "Minimum salary seems unrealistic")
    .optional(),
  
  salary_max: z.number()
    .min(0, "Maximum salary cannot be negative")
    .max(10000000, "Maximum salary seems unrealistic")
    .optional(),
  
  salary_currency: z.string()
    .length(3, "Currency code must be 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency code must be uppercase letters")
    .default("SEK"),
  
  remote_work: z.boolean().default(false),
  
  benefits: z.array(z.string().min(1).max(100))
    .max(15, "Maximum 15 benefits allowed")
    .optional(),
  
  department: z.string()
    .max(100, "Department must not exceed 100 characters")
    .optional(),
  
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']),
  
  application_deadline: z.string()
    .datetime("Invalid deadline format")
    .refine(date => new Date(date) > new Date(), "Deadline must be in the future")
    .optional(),
  
  start_date: z.string()
    .datetime("Invalid start date format")
    .optional(),
  
  working_hours: z.string()
    .max(200, "Working hours description too long")
    .optional(),
  
  application_instructions: z.string()
    .max(1000, "Application instructions too long")
    .optional(),
  
  gdpr_notice: z.string()
    .min(50, "GDPR notice must be comprehensive")
    .max(2000, "GDPR notice too long")
    .default("Personal data will be processed according to GDPR regulations and our privacy policy."),
  
  data_controller_info: z.string()
    .min(20, "Data controller information must be provided")
    .max(500, "Data controller information too long")
    .default("Data controller information available in our privacy policy."),
}).refine(data => {
  if (data.salary_min && data.salary_max) {
    return data.salary_min <= data.salary_max;
  }
  return true;
}, {
  message: "Minimum salary cannot be greater than maximum salary",
  path: ["salary_max"],
});

// Application validation
export const applicationSchema = z.object({
  job_id: z.string().uuid("Invalid job ID"),
  
  applicant_id: z.string().uuid("Invalid applicant ID"),
  
  full_name: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Full name contains invalid characters"),
  
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  
  cv_url: z.string()
    .url("Invalid CV URL")
    .optional()
    .or(z.literal("")),
  
  cover_letter: z.string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(5000, "Cover letter must not exceed 5,000 characters")
    .optional(),
  
  skills: z.array(z.string().min(1).max(50))
    .max(20, "Maximum 20 skills allowed")
    .optional(),
  
  salary_expectation: z.number()
    .min(0, "Salary expectation cannot be negative")
    .max(10000000, "Salary expectation seems unrealistic")
    .optional(),
  
  available_start_date: z.string()
    .datetime("Invalid start date format")
    .refine(date => new Date(date) >= new Date(), "Start date cannot be in the past")
    .optional(),
  
  application_source: z.string()
    .max(100, "Application source too long")
    .optional(),
}).merge(gdprConsentSchema);

// Company validation
export const companySchema = z.object({
  name: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must not exceed 200 characters"),
  
  description: z.string()
    .max(5000, "Company description must not exceed 5,000 characters")
    .optional(),
  
  website: z.string()
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),
  
  logo_url: z.string()
    .url("Invalid logo URL")
    .optional()
    .or(z.literal("")),
  
  industry: z.string()
    .max(100, "Industry must not exceed 100 characters")
    .optional(),
  
  size: z.string()
    .max(50, "Company size must not exceed 50 characters")
    .optional(),
  
  location: z.string()
    .max(200, "Location must not exceed 200 characters")
    .optional(),
  
  founded_year: z.number()
    .int("Founded year must be a whole number")
    .min(1800, "Founded year seems too old")
    .max(new Date().getFullYear(), "Founded year cannot be in the future")
    .optional(),
  
  linkedin_url: z.string()
    .url("Invalid LinkedIn URL")
    .regex(/^https:\/\/(www\.)?linkedin\.com\/.*$/, "Must be a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  
  culture_values: z.array(z.string().min(1).max(100))
    .max(10, "Maximum 10 culture values allowed")
    .optional(),
  
  benefits: z.array(z.string().min(1).max(100))
    .max(20, "Maximum 20 benefits allowed")
    .optional(),
  
  gdpr_contact_email: z.string()
    .email("Invalid GDPR contact email")
    .max(255, "Email must not exceed 255 characters"),
  
  data_protection_officer: z.string()
    .max(200, "DPO name must not exceed 200 characters")
    .optional(),
  
  privacy_policy_url: z.string()
    .url("Invalid privacy policy URL")
    .max(500, "Privacy policy URL too long"),
});

// GDPR request validation
export const gdprRequestSchema = z.object({
  user_id: z.string().uuid("Invalid user ID"),
  
  request_type: z.enum(['data_export', 'data_deletion', 'data_rectification', 'data_portability', 'processing_restriction']),
  
  requested_by_email: z.string()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),
  
  legal_basis: z.string()
    .min(10, "Legal basis must be specified")
    .max(1000, "Legal basis too long")
    .optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(file => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      return allowedTypes.includes(file.type);
    }, "File type must be PDF, DOC, DOCX, or TXT"),
});

// Search and filter validation
export const searchFiltersSchema = z.object({
  query: z.string()
    .max(200, "Search query too long")
    .optional(),
  
  location: z.string()
    .max(100, "Location filter too long")
    .optional(),
  
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'temporary'])
    .optional(),
  
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive'])
    .optional(),
  
  remote_work: z.boolean().optional(),
  
  salary_min: z.number()
    .min(0, "Minimum salary cannot be negative")
    .optional(),
  
  salary_max: z.number()
    .min(0, "Maximum salary cannot be negative")
    .optional(),
  
  date_from: z.string()
    .datetime("Invalid date format")
    .optional(),
  
  date_to: z.string()
    .datetime("Invalid date format")
    .optional(),
}).refine(data => {
  if (data.salary_min && data.salary_max) {
    return data.salary_min <= data.salary_max;
  }
  return true;
}, {
  message: "Minimum salary cannot be greater than maximum salary",
  path: ["salary_max"],
}).refine(data => {
  if (data.date_from && data.date_to) {
    return new Date(data.date_from) <= new Date(data.date_to);
  }
  return true;
}, {
  message: "From date cannot be after to date",
  path: ["date_to"],
});

// Export all schemas for use throughout the application
export const validationSchemas = {
  profile: profileSchema,
  job: jobSchema,
  application: applicationSchema,
  company: companySchema,
  gdprRequest: gdprRequestSchema,
  fileUpload: fileUploadSchema,
  searchFilters: searchFiltersSchema,
  gdprConsent: gdprConsentSchema,
};

// Type inference helpers
export type ProfileFormData = z.infer<typeof profileSchema>;
export type JobFormData = z.infer<typeof jobSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type CompanyFormData = z.infer<typeof companySchema>;
export type GDPRRequestFormData = z.infer<typeof gdprRequestSchema>;
export type SearchFiltersData = z.infer<typeof searchFiltersSchema>;
