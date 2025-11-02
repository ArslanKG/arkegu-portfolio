import { NextRequest } from 'next/server'
import type { RateLimitRecord, EnvironmentConfig } from '@/types'

// XSS koruması için input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    // Script taglerini kaldır
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // iframe taglerini kaldır  
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // object ve embed taglerini kaldır
    .replace(/<(object|embed|form)[^>]*>.*?<\/\1>/gi, '')
    // javascript: protokolünü kaldır
    .replace(/javascript:/gi, '')
    // on* event handlerları kaldır
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // HTML entity encoding için temel karakterleri encode et
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

// SQL injection koruması için özel karakterleri temizle
export function sanitizeForDatabase(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/['";\\]/g, '') // SQL injection karakterleri
    .replace(/--/g, '') // SQL comment
    .replace(/\/\*/g, '') // SQL block comment start
    .replace(/\*\//g, '') // SQL block comment end
    .trim()
}

// Email validation (RFC 5322 compliant)
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

// Input length validation
export function validateLength(input: string, min: number, max: number): boolean {
  return input.length >= min && input.length <= max
}

// Rate limiting için IP address extraction
export function getClientIP(request: NextRequest): string {
  // Vercel, Cloudflare, AWS, generic reverse proxy headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  const awsForwardedFor = request.headers.get('x-amzn-forwarded-for')
  
  if (cfConnectingIP) return cfConnectingIP
  if (awsForwardedFor) return awsForwardedFor.split(',')[0]?.trim() || 'unknown'
  if (realIP) return realIP
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'
  
  return 'unknown'
}

// In-memory rate limiting (production'da Redis kullanılmalı)
const rateLimitStore = new Map<string, RateLimitRecord>()

export function checkRateLimit(
  key: string, 
  maxRequests: number = 5, 
  windowMs: number = 900000 // 15 dakika
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    // Yeni window başlat
    const newRecord: RateLimitRecord = { count: 1, resetTime: now + windowMs }
    rateLimitStore.set(key, newRecord)
    return { allowed: true, remaining: maxRequests - 1, resetTime: newRecord.resetTime }
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  // Count'u artır
  record.count++
  rateLimitStore.set(key, record)
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime }
}

// Environment variable validation
export function validateEnvironment(): EnvironmentConfig {
  const env = process.env as Partial<EnvironmentConfig>
  
  // Required environment variables
  if (!env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is required')
  }
  
  if (!env.RECIPIENT_EMAIL) {
    throw new Error('RECIPIENT_EMAIL environment variable is required')
  }
  
  // API key format validation
  if (!env.BREVO_API_KEY.startsWith('xkeysib-') || 
      env.BREVO_API_KEY.includes('your-') || 
      env.BREVO_API_KEY.includes('here')) {
    throw new Error('Invalid BREVO_API_KEY format')
  }
  
  // Email format validation
  if (!validateEmail(env.RECIPIENT_EMAIL)) {
    throw new Error('Invalid RECIPIENT_EMAIL format')
  }
  
  return {
    BREVO_API_KEY: env.BREVO_API_KEY,
    RECIPIENT_EMAIL: env.RECIPIENT_EMAIL,
    SENDER_NAME: env.SENDER_NAME || 'Portfolio İletişim Formu',
    SENDER_EMAIL: env.SENDER_EMAIL || 'arkegugame@gmail.com',
    ALLOWED_ORIGINS: env.ALLOWED_ORIGINS || 'https://arslankg.dev,https://arkegu-portfolio.vercel.app',
    RATE_LIMIT_MAX: env.RATE_LIMIT_MAX || '5',
    RATE_LIMIT_WINDOW: env.RATE_LIMIT_WINDOW || '900000',
    NODE_ENV: (env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
  }
}

// CORS origin validation
export function validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false
  
  // Development ortamında localhost'a izin ver
  if (process.env.NODE_ENV === 'development') {
    const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']
    allowedOrigins = [...allowedOrigins, ...devOrigins]
  }
  
  return allowedOrigins.includes(origin)
}

// Security headers helper
export function getSecurityHeaders(origin?: string) {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Access-Control-Allow-Origin': origin || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // 24 saat cache
  }
}

// Form data validation
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}): ValidationResult {
  const errors: string[] = []
  
  // Name validation
  if (!data.name?.trim()) {
    errors.push('Ad soyad gereklidir')
  } else if (!validateLength(data.name.trim(), 2, 100)) {
    errors.push('Ad soyad 2-100 karakter arasında olmalıdır')
  }
  
  // Email validation
  if (!data.email?.trim()) {
    errors.push('E-posta adresi gereklidir')
  } else if (!validateEmail(data.email.trim())) {
    errors.push('Geçerli bir e-posta adresi giriniz')
  }
  
  // Subject validation
  if (!data.subject?.trim()) {
    errors.push('Konu gereklidir')
  } else if (!validateLength(data.subject.trim(), 3, 200)) {
    errors.push('Konu 3-200 karakter arasında olmalıdır')
  }
  
  // Message validation
  if (!data.message?.trim()) {
    errors.push('Mesaj gereklidir')
  } else if (!validateLength(data.message.trim(), 10, 2000)) {
    errors.push('Mesaj 10-2000 karakter arasında olmalıdır')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Comment form validation
export function validateCommentForm(data: {
  postId: string
  author: string
  email: string
  content: string
}): ValidationResult {
  const errors: string[] = []
  
  // PostId validation
  if (!data.postId?.trim()) {
    errors.push('Post ID is required')
  } else if (!validateLength(data.postId.trim(), 1, 50)) {
    errors.push('Invalid post ID format')
  }
  
  // Author validation
  if (!data.author?.trim()) {
    errors.push('Author name is required')
  } else if (!validateLength(data.author.trim(), 2, 50)) {
    errors.push('Author name must be between 2-50 characters')
  } else {
    // Check for HTML tags in author name
    const cleanAuthor = sanitizeInput(data.author.trim())
    if (cleanAuthor !== data.author.trim()) {
      errors.push('Author name contains invalid characters')
    }
  }
  
  // Email validation
  if (!data.email?.trim()) {
    errors.push('Email address is required')
  } else if (!validateEmail(data.email.trim())) {
    errors.push('Please enter a valid email address')
  }
  
  // Content validation
  if (!data.content?.trim()) {
    errors.push('Comment content is required')
  } else if (!validateLength(data.content.trim(), 10, 1000)) {
    errors.push('Comment must be between 10-1000 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Enhanced HTML sanitization for comments
export function sanitizeCommentContent(content: string): string {
  if (typeof content !== 'string') return ''
  
  return content
    // Remove all HTML tags except basic formatting (optional - for now remove all)
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Basic HTML entity encoding
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

// Comment rate limiting (more restrictive than contact form)
export function checkCommentRateLimit(
  key: string,
  maxRequests: number = 3,
  windowMs: number = 300000 // 5 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  return checkRateLimit(key, maxRequests, windowMs)
}

// Validate comment ID format (cuid)
export function validateCommentId(id: string): boolean {
  if (!id || typeof id !== 'string') return false
  
  // Basic cuid format validation (starts with 'c' and has correct length)
  const cuidRegex = /^c[a-z0-9]{24}$/
  return cuidRegex.test(id)
}

// Check for spam patterns in comment content
export function checkSpamPatterns(content: string): boolean {
  const spamPatterns = [
    // Multiple URLs
    /(https?:\/\/[^\s]+.*){3,}/gi,
    // Excessive capitalization
    /[A-Z]{10,}/g,
    // Repeated characters
    /(.)\1{10,}/g,
    // Common spam phrases
    /(buy now|click here|free money|guaranteed|make money|viagra|casino)/gi,
    // Excessive punctuation
    /[!?]{5,}/g
  ]
  
  return spamPatterns.some(pattern => pattern.test(content))
}