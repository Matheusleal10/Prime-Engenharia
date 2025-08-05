import DOMPurify from 'dompurify';

/**
 * Security utilities for input sanitization and validation
 */

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitize HTML content for display
 */
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: []
  });
};

/**
 * Basic rate limiting implementation
 */
export const isRateLimited = (key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (record.count >= maxAttempts) {
    return true;
  }
  
  record.count++;
  return false;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
  }
  
  if (password.length > 50) {
    return { isValid: false, message: 'Senha muito longa' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
  }
  
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Senha deve conter pelo menos um número' };
  }
  
  return { isValid: true };
};

/**
 * Clean and validate phone number
 */
export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d+\-\s()]/g, '').substring(0, 20);
};

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  action: string;
  userId?: string;
  details: Record<string, any>;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

/**
 * Create audit log entry (in production, send to backend)
 */
export const createAuditLog = (entry: Omit<AuditLogEntry, 'timestamp'>): AuditLogEntry => {
  const auditEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date(),
  };
  
  // In production, send this to your backend audit service
  console.log('AUDIT LOG:', auditEntry);
  
  return auditEntry;
};