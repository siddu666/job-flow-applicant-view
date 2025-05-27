
import { supabase } from "@/integrations/supabase/client";

// Security constants
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_MIN_LENGTH: 8,
  DATA_RETENTION_YEARS: 7,
  GDPR_RESPONSE_DAYS: 30,
  FILE_SIZE_LIMIT: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp'
  ],
} as const;

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/XML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 10000); // Limit length
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^\w\s.-]/g, '') // Only allow word characters, spaces, dots, and hyphens
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toLowerCase()
    .substring(0, 255); // Limit length
};

// Email validation and sanitization
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Phone number validation
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/[\s\-\(\)]/g, '');
};

// URL validation
export const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// File validation
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > SECURITY_CONFIG.FILE_SIZE_LIMIT) {
    return { isValid: false, error: 'File size exceeds limit (10MB)' };
  }

  if (!SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.scr$/i,
    /\.com$/i,
    /\.pif$/i,
    /\.js$/i,
    /\.jar$/i,
    /\.php$/i,
    /\.asp$/i,
    /\.aspx$/i,
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    return { isValid: false, error: 'File type potentially dangerous' };
  }

  return { isValid: true };
};

// Rate limiting utilities
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return true;
  };
};

// Audit logging
export const logSecurityEvent = async (
  userId: string | null,
  action: string,
  details: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    await supabase
      .from("audit_logs")
      .insert({
        user_id: userId,
        action: `security_${action}`,
        resource_type: "security_event",
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: details,
        gdpr_related: false,
      });
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
};

// Session management
export const getClientInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}`,
    platform: navigator.platform,
  };
};

// Data encryption/decryption utilities (for client-side use)
export const hashString = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate secure tokens
export const generateSecureToken = (): string => {
  return crypto.randomUUID();
};

// GDPR compliance utilities
export const calculateDataRetentionDate = (): string => {
  const retentionDate = new Date();
  retentionDate.setFullYear(retentionDate.getFullYear() + SECURITY_CONFIG.DATA_RETENTION_YEARS);
  return retentionDate.toISOString();
};

export const isDataExpired = (retentionDate: string): boolean => {
  return new Date(retentionDate) <= new Date();
};

// Content Security Policy helpers
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// XSS prevention
export const escapeHTML = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// SQL injection prevention (for client-side validation)
export const containsSQLPatterns = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/|xp_|sp_)/i,
    /(\b(OR|AND)\b\s*\d+\s*=\s*\d+)/i,
    /('(\s)*(OR|AND)(\s)*')/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    feedback.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain lowercase letters');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain uppercase letters');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push('Password must contain numbers');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Password must contain special characters');
  } else {
    score += 1;
  }

  // Check for common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /(.)\1{2,}/, // Repeated characters
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    feedback.push('Password contains common patterns');
    score = Math.max(0, score - 1);
  }

  return {
    isValid: score >= 4 && feedback.length === 0,
    score,
    feedback,
  };
};

// IP address validation
export const isValidIPAddress = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Honeypot field for bot detection
export const createHoneypot = () => {
  return {
    fieldName: `field_${Math.random().toString(36).substr(2, 9)}`,
    style: {
      position: 'absolute' as const,
      left: '-9999px',
      top: '-9999px',
      visibility: 'hidden' as const,
      opacity: 0,
      pointerEvents: 'none' as const,
      tabIndex: -1,
    },
  };
};

// Device fingerprinting (basic)
export const getDeviceFingerprint = async (): Promise<string> => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.platform,
    navigator.hardwareConcurrency || 0,
  ];

  const fingerprint = components.join('|');
  return await hashString(fingerprint);
};

// Security headers validation
export const validateSecurityHeaders = (): Record<string, boolean> => {
  const headers = {
    'Content-Security-Policy': false,
    'X-Frame-Options': false,
    'X-Content-Type-Options': false,
    'Referrer-Policy': false,
    'Permissions-Policy': false,
  };

  // This would be checked server-side in a real application
  // For client-side, we can only check what's available
  
  return headers;
};

export const securityUtils = {
  sanitizeInput,
  sanitizeFileName,
  sanitizeEmail,
  sanitizePhoneNumber,
  isValidEmail,
  isValidPhoneNumber,
  isValidURL,
  validateFile,
  createRateLimiter,
  logSecurityEvent,
  getClientInfo,
  hashString,
  generateSecureToken,
  calculateDataRetentionDate,
  isDataExpired,
  sanitizeHTML,
  escapeHTML,
  containsSQLPatterns,
  validatePasswordStrength,
  isValidIPAddress,
  createHoneypot,
  getDeviceFingerprint,
  validateSecurityHeaders,
};
