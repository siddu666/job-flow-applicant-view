import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";

// Security constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REQUIRES_MIXED_CASE = true;
const PASSWORD_REQUIRES_NUMBERS = true;
const PASSWORD_REQUIRES_SYMBOLS = true;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const SESSION_EXPIRY_DAYS = 7;
const SENSITIVE_OPERATIONS_REQUIRE_REAUTH = true;

// Rate limiting
const rateLimits: Record<string, { count: number; timestamp: number }> = {};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }

  if (PASSWORD_REQUIRES_MIXED_CASE && !/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: "Password must contain both uppercase and lowercase letters" };
  }

  if (PASSWORD_REQUIRES_NUMBERS && !/\d/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }

  if (PASSWORD_REQUIRES_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" };
  }

  return { valid: true };
};

export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const generateSecureToken = (): string => {
  return uuidv4() + uuidv4().replace(/-/g, "");
};

export const checkRateLimit = (
  key: string,
  limit: number,
  windowSeconds: number
): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const record = rateLimits[key] || { count: 0, timestamp: now };

  // Reset if outside window
  if (now - record.timestamp > windowSeconds * 1000) {
    record.count = 0;
    record.timestamp = now;
  }

  if (record.count >= limit) {
    const retryAfter = Math.ceil(
      (record.timestamp + windowSeconds * 1000 - now) / 1000
    );
    return { allowed: false, retryAfter };
  }

  // Update rate limit record
  record.count += 1;
  rateLimits[key] = record;

  return { allowed: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const validateFileType = (file: File, allowedMimeTypes: string[]): string => {
  const allowedTypes = [
    "application/pdf",
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/webp"
  ];
  
  const fileType = file.type;
  
  if (!allowedTypes.includes(fileType)) {
    throw new Error(`File type ${fileType} is not allowed`);
  }
  
  return fileType;
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds the maximum allowed size of ${maxSizeMB}MB`);
  }
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic international phone validation
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  return phoneRegex.test(phone);
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

export const requiresReauthentication = (lastAuthTime: number): boolean => {
  if (!SENSITIVE_OPERATIONS_REQUIRE_REAUTH) return false;
  
  const now = Date.now();
  const authAgeMinutes = (now - lastAuthTime) / (1000 * 60);
  
  // Require re-auth if last authentication was more than 30 minutes ago
  return authAgeMinutes > 30;
};

export const logSecurityEvent = async (
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  metadata: Record<string, any> = {}
) => {
  try {
    // Security logging placeholder - audit_logs table doesn't exist
    console.log("Security event:", { userId, action, resourceType, resourceId, metadata });
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) {
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  let result = token.length === storedToken.length;
  let diff = 0;
  
  for (let i = 0; i < token.length && i < storedToken.length; i++) {
    diff |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result && diff === 0;
};

export const generateCSRFToken = (): string => {
  return uuidv4() + uuidv4();
};

export const sanitizeHtml = (html: string): string => {
  // Very basic HTML sanitization - for production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/on\w+=\w+/g, '');
};
