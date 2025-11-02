import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getClientIP(request: NextRequest): string {
  // Vercel, Cloudflare, AWS, generic reverse proxy headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'
  
  return 'unknown'
}

function isRateLimited(ip: string): boolean {
  const key = `rate_limit:${ip}`
  const now = Date.now()
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '5')
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '900000') // 15 dakika

  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }
  
  if (record.count >= maxRequests) {
    return true
  }
  
  record.count++
  rateLimitStore.set(key, record)
  return false
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://arslankg.dev',
    'https://arkegu-portfolio.vercel.app'
  ]
  
  // Development için localhost'a izin ver
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000')
  }
  
  return allowedOrigins.includes(origin)
}

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    // Origin kontrolü
    const origin = request.headers.get('origin')
    if (!isOriginAllowed(origin)) {
      return NextResponse.json(
        { success: false, message: 'Bu domain\'den erişim yetkisi yok.' },
        { status: 403 }
      )
    }

    // IP adresini al (Vercel için)
    const ip = getClientIP(request);

    // Rate limiting kontrolü
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Çok fazla istek gönderdiniz. 15 dakika sonra tekrar deneyin.',
          retryAfter: 900 
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email }: { email: string } = body

    // Input sanitization
    const sanitizedEmail = sanitizeInput(email)

    // Form verilerini doğrula
    if (!sanitizedEmail) {
      return NextResponse.json(
        { success: false, message: 'Lütfen e-posta adresinizi girin.' },
        { status: 400 }
      )
    }

    // Email formatını kontrol et
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Geçerli bir e-posta adresi girin.' },
        { status: 400 }
      )
    }

    // Environment variables'dan güvenli bilgi alma
    const API_KEY = process.env.BREVO_API_KEY
    const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL
    const SENDER_NAME = "Newsletter Subscription"
    const SENDER_EMAIL = "arkegugame@gmail.com"
    const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

    // Environment variables kontrolü
    if (!API_KEY || !RECIPIENT_EMAIL) {
      console.error('Eksik environment variables: BREVO_API_KEY veya RECIPIENT_EMAIL')
      return NextResponse.json(
        {
          success: false,
          message: 'Sunucu yapılandırma hatası. Lütfen sistem yöneticisine başvurun.',
        },
        { status: 500 }
      )
    }

    // HTML mail şablonu
    const htmlContent = `
    <html>
    <body>
      <h2>New Newsletter Subscription</h2>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>IP Address:</strong> ${ip}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</p>
    </body>
    </html>
    `

    // Brevo API'ye gönderilecek veri
    const mailData = {
      sender: {
        name: SENDER_NAME,
        email: SENDER_EMAIL
      },
      to: [{ email: RECIPIENT_EMAIL }],
      subject: `📧 New Newsletter Subscription: ${sanitizedEmail}`,
      htmlContent: htmlContent,
    }

    // Brevo API çağrısı
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(mailData),
    })

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Aboneliğiniz için teşekkürler!',
      })
    } else {
      const responseData = await response.json()
      console.error('Brevo API Hatası:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      })
      return NextResponse.json(
        {
          success: false,
          message: 'Abonelik sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Abonelik hatası:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  if (!isOriginAllowed(origin)) {
    return new NextResponse(null, { status: 403 })
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin || '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
