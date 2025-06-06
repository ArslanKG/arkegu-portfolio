import { NextRequest, NextResponse } from 'next/server'

interface MailRequest {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message }: MailRequest = await request.json()

    // Form verilerini doğrula
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Lütfen tüm alanları doldurun.' },
        { status: 400 }
      )
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Geçerli bir e-posta adresi girin.' },
        { status: 400 }
      )
    }

    // Environment variables'dan güvenli bilgi alma
    const API_KEY = process.env.BREVO_API_KEY
    const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL
    const SENDER_NAME = process.env.SENDER_NAME || "Portfolio İletişim Formu"
    const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@arkegu-portfolio.com"
    const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

    // Environment variables kontrolü
    if (!API_KEY || !RECIPIENT_EMAIL) {
      console.error('Eksik environment variables: BREVO_API_KEY veya RECIPIENT_EMAIL')
      return NextResponse.json(
        {
          success: false,
          message: 'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.',
          error: 'Gerekli ortam değişkenleri eksik'
        },
        { status: 500 }
      )
    }

    // HTML mail şablonu
    const htmlContent = `
    <html>
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
            <span style="color: #1e293b; font-weight: 600;">${name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #475569; display: inline-block; width: 120px;">📧 E-posta:</strong>
            <a href="mailto:${email}" style="color: #0891b2; text-decoration: none; font-weight: 600;">${email}</a>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #475569; display: inline-block; width: 120px;">📋 Konu:</strong>
            <span style="color: #1e293b; font-weight: 600;">${subject}</span>
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
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #1e293b; margin-bottom: 15px; font-size: 20px; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            💬 Mesaj İçeriği
          </h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #0891b2;">
            <p style="margin: 0; color: #334155; white-space: pre-wrap; font-size: 16px; line-height: 1.6;">${message}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Bu mesaj arkegu-portfolio sitesinden otomatik olarak gönderilmiştir.
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
            Yanıtlamak için doğrudan <a href="mailto:${email}" style="color: #0891b2;">${email}</a> adresini kullanabilirsiniz.
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
      subject: `📧 Portfolio İletişim: ${subject}`,
      htmlContent: htmlContent,
      replyTo: { email: email, name: name }
    }

    // Brevo API çağrısı
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(mailData)
    })

    const responseData = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.',
        messageId: responseData.messageId
      })
    } else {
      console.error('Brevo API Hatası:', responseData)
      
      // Brevo API hatalarını Türkçeye çevir
      let turkishError = 'Mail gönderilemedi. Lütfen daha sonra tekrar deneyin.'
      
      if (responseData.message) {
        if (responseData.message.includes('Invalid API key')) {
          turkishError = 'Geçersiz API anahtarı. Sunucu yapılandırmasını kontrol edin.'
        } else if (responseData.message.includes('rate limit')) {
          turkishError = 'Çok fazla mail gönderim isteği. Lütfen birkaç dakika bekleyin.'
        } else if (responseData.message.includes('Invalid email')) {
          turkishError = 'Geçersiz e-posta adresi format hatası.'
        } else if (responseData.message.includes('blocked')) {
          turkishError = 'Mail adresi engellenmiş. Farklı bir adres deneyin.'
        }
      }
      
      return NextResponse.json(
        {
          success: false,
          message: turkishError,
          error: responseData.message || 'Bilinmeyen API hatası'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Mail gönderim hatası:', error)
    
    // Hata türüne göre Türkçe mesaj
    let turkishError = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        turkishError = 'İnternet bağlantısı hatası. Bağlantınızı kontrol edin.'
      } else if (error.message.includes('timeout')) {
        turkishError = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
      } else if (error.message.includes('network')) {
        turkishError = 'Ağ bağlantı hatası. İnternet bağlantınızı kontrol edin.'
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: turkishError,
        error: error instanceof Error ? error.message : 'Bilinmeyen sistem hatası'
      },
      { status: 500 }
    )
  }
}

// OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}