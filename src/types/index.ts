// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface MailRequest {
  name: string
  email: string
  subject: string
  message: string
}

export interface MailResponse extends ApiResponse {
  messageId?: string
  retryAfter?: number
}

// Environment Variables Type Safety
export interface EnvironmentConfig {
  BREVO_API_KEY: string
  RECIPIENT_EMAIL: string
  SENDER_NAME?: string
  SENDER_EMAIL?: string
  ALLOWED_ORIGINS?: string
  RATE_LIMIT_MAX?: string
  RATE_LIMIT_WINDOW?: string
  NODE_ENV: 'development' | 'production' | 'test'
}

// Component Props Types
export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Utility Types
export type Awaitable<T> = T | Promise<T>

export type NonEmptyArray<T> = [T, ...T[]]

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

// Form Validation Types
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormValidation {
  [field: string]: ValidationRule[]
}

// Security Types
export interface RateLimitRecord {
  count: number
  resetTime: number
}

export interface SecurityHeaders {
  'X-Frame-Options': 'DENY' | 'SAMEORIGIN'
  'X-Content-Type-Options': 'nosniff'
  'Referrer-Policy': string
  'X-XSS-Protection': string
  'Permissions-Policy': string
}