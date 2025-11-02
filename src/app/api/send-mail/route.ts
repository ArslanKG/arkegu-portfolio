import { NextRequest, NextResponse } from 'next/server'

interface MailRequest {
  name: string
  email: string
  subject: string
  message: string
}

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
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

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
    const { name, email, subject, message }: MailRequest = body

    // Input sanitization
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message)
    }

    // Form verilerini doğrula
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.subject || !sanitizedData.message) {
      return NextResponse.json(
        { success: false, message: 'Lütfen tüm alanları doldurun.' },
        { status: 400 }
      )
    }

    // Uzunluk kontrolleri
    if (sanitizedData.name.length < 2 || sanitizedData.name.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Ad soyad 2-100 karakter arasında olmalıdır.' },
        { status: 400 }
      )
    }

    if (sanitizedData.subject.length < 3 || sanitizedData.subject.length > 200) {
      return NextResponse.json(
        { success: false, message: 'Konu 3-200 karakter arasında olmalıdır.' },
        { status: 400 }
      )
    }

    if (sanitizedData.message.length < 10 || sanitizedData.message.length > 2000) {
      return NextResponse.json(
        { success: false, message: 'Mesaj 10-2000 karakter arasında olmalıdır.' },
        { status: 400 }
      )
    }

    // Email formatını kontrol et (daha güçlü regex)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(sanitizedData.email)) {
      return NextResponse.json(
        { success: false, message: 'Geçerli bir e-posta adresi girin.' },
        { status: 400 }
      )
    }

    // Environment variables'dan güvenli bilgi alma
    const API_KEY = process.env.BREVO_API_KEY
    const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL
    const SENDER_NAME = process.env.SENDER_NAME || "Portfolio İletişim Formu"
    const SENDER_EMAIL = process.env.SENDER_EMAIL || "arkegugame@gmail.com"
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

    // API key placeholder kontrolü (sadece obvious placeholder'lar için)
    if (API_KEY.includes('your-new-brevo-api-key-here') ||
        API_KEY.includes('your-brevo-api-key-here') ||
        API_KEY === 'your-api-key-here') {
      console.error('API key placeholder değeri kullanılıyor')
      return NextResponse.json(
        {
          success: false,
          message: 'API anahtarı henüz yapılandırılmamış. Lütfen .env.local dosyasında geçerli bir Brevo API anahtarı ayarlayın.',
        },
        { status: 500 }
      )
    }

    // HTML mail şablonu (güvenli)
    const htmlContent = `
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Portfolio İletişim Mesajı</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="border: 2px solid #0891b2; border-radius: 10px; padding: 30px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
        <h2 style="color: #0891b2; text-align: center; margin-bottom: 30px; font-size: 28px;">
          📧 Yeni Portfolio İletişim Mesajı
        </h2>
        
        <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin-bottom: 20px; font-size: 22px; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            📝 Mesaj Detayları
          </h3>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #475569; display: inline-block; width: 120px;">👤 Gönderen:</strong>
            <span style="color: #1e293b; font-weight: 600;">${sanitizedData.name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #475569; display: inline-block; width: 120px;">📧 E-posta:</strong>
            <a href="mailto:${sanitizedData.email}" style="color: #0891b2; text-decoration: none; font-weight: 600;">${sanitizedData.email}</a>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #475569; display: inline-block; width: 120px;">📋 Konu:</strong>
            <span style="color: #1e293b; font-weight: 600;">${sanitizedData.subject}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #475569; display: inline-block; width: 120px;">🕒 Tarih:</strong>
            <span style="color: #64748b;">${new Date().toLocaleString('tr-TR', { 
              timeZone: 'Europe/Istanbul',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #475569; display: inline-block; width: 120px;">🌐 IP:</strong>
            <span style="color: #64748b;">${ip}</span>
          </div>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #1e293b; margin-bottom: 15px; font-size: 20px; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            💬 Mesaj İçeriği
          </h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #0891b2;">
            <p style="margin: 0; color: #334155; white-space: pre-wrap; font-size: 16px; line-height: 1.6;">${sanitizedData.message}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Bu mesaj arkegu-portfolio sitesinden otomatik olarak gönderilmiştir.
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
            Yanıtlamak için doğrudan <a href="mailto:${sanitizedData.email}" style="color: #0891b2;">${sanitizedData.email}</a> adresini kullanabilirsiniz.
          </p>
        </div>
      </div>
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
      subject: `📧 Portfolio İletişim: ${sanitizedData.subject}`,
      htmlContent: htmlContent,
      replyTo: { email: sanitizedData.email, name: sanitizedData.name }
    }

    // Brevo API çağrısı (timeout ile)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 saniye timeout

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(mailData),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const responseData = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.',
        messageId: responseData.messageId
      })
    } else {
      console.error('Brevo API Hatası:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      })
      
      // Brevo API hatalarını Türkçeye çevir
      let turkishError = 'Mail gönderilemedi. Lütfen daha sonra tekrar deneyin.'
      
      if (responseData.message) {
        if (responseData.message.includes('Invalid API key') || response.status === 401) {
          turkishError = 'API anahtarı geçersiz. Lütfen sistem yöneticisine başvurun.'
        } else if (responseData.message.includes('rate limit') || response.status === 429) {
          turkishError = 'Çok fazla mail gönderim isteği. Lütfen birkaç dakika bekleyin.'
        } else if (responseData.message.includes('Invalid email')) {
          turkishError = 'E-posta adresi format hatası.'
        } else if (responseData.message.includes('blocked')) {
          turkishError = 'Mail adresi engellenmiş. Farklı bir adres deneyin.'
        }
      }
      
      return NextResponse.json(
        {
          success: false,
          message: turkishError,
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Mail gönderim hatası:', error)
    
    // Hata türüne göre Türkçe mesaj
    let turkishError = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        turkishError = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
        statusCode = 408
      } else if (error.message.includes('fetch')) {
        turkishError = 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.'
        statusCode = 503
      } else if (error.message.includes('JSON')) {
        turkishError = 'Veri format hatası. Lütfen formu tekrar doldurun.'
        statusCode = 400
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: turkishError,
      },
      { status: statusCode }
    )
  }
}

// OPTIONS method for CORS (güvenli versiyon)
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
      'Access-Control-Max-Age': '86400', // 24 saat cache
    },
  })
}