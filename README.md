# 🚀 Arslan Kemal Gündüz - Portfolio

Modern, güvenli ve performans odaklı portfolio websitesi. Next.js 14, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🔥 Özellikler

- ⚡ **Next.js 14** - App Router ve modern React features
- 🔒 **Enterprise Security** - Rate limiting, CORS, XSS protection
- 🎨 **Modern UI/UX** - Framer Motion animasyonları
- 📱 **Responsive Design** - Tüm cihazlarda mükemmel görünüm
- 🌙 **Dark/Light Theme** - next-themes ile tema desteği
- 📧 **Contact Form** - Brevo API ile güvenli mail gönderimi
- 🔍 **SEO Optimized** - Meta tags ve structured data
- ⚡ **Performance** - Dynamic imports ve lazy loading
- 🛡️ **Type Safety** - Strict TypeScript konfigürasyonu

## 💼 Ana Projelerim

<table>
<tr>
<td width="33%">

#### 🎨 [Arkegu Portfolio](https://github.com/ArslanKG/arkegu-portfolio)
**Cyberpunk Temalı Modern Portfolio**
- Next.js 14 + TypeScript
- Tailwind CSS + Framer Motion
- Responsive & Interactive Design
- **[🌐 Canlı Demo](https://arkegu-portfolio.vercel.app)**

**Özellikler:**
- ✨ Particle efektleri
- 🎭 Typewriter animasyonu
- 🌓 Dark/Light mode
- 📱 Fully responsive

</td>
<td width="33%">

#### 🤖 [Prompt Optimizer](https://github.com/ArslanKG/prompt-optimizer-frontend)
**AI Prompt Optimizasyon Sistemi**
- React Frontend + .NET 8 Backend
- MCP Server Implementation
- Multi-Model AI Strategy
- Gerçek zamanlı chat arayüzü
- **[🌐 Canlı Demo](https://arkeguai.vercel.app/)**

**Özellikler:**
- 🧠 7 farklı AI model desteği
- 🚀 Prompt optimizasyon algoritmaları
- 💬 Public chat (auth-free)
- 📊 Model karşılaştırma tools

</td>
<td width="33%">

#### 🎵 [TuneSync](https://github.com/ArslanKG/MusicTransferHub)
**Playlist Transfer API**
- ASP.NET Core 9.0 + React
- OAuth 2.0 Authentication
- Smart Music Matching Algorithm
- Docker Production Ready
- **[🌐 Canlı Demo](https://tunesync.onrender.com/)**

**Özellikler:**
- 🔐 Spotify & YouTube OAuth
- 🎯 Akıllı şarkı eşleştirme
- 📊 Real-time transfer progress
- 🛡️ Rate limiting & security
- 🐳 Docker containerization
- 📈 Health monitoring

</td>
</tr>
</table>

## 🛡️ Güvenlik Özellikleri

- **Rate Limiting**: 15 dakikada max 5 istek
- **CORS Protection**: Whitelist tabanlı domain kontrolü
- **Input Sanitization**: XSS ve injection saldırı koruması
- **Security Headers**: OWASP önerilerinde HTTP headers
- **Environment Validation**: API key format kontrolü
- **Type Safety**: Strict TypeScript ve runtime validation

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js 18.17+
- npm veya yarn

### Proje Kurulumu

```bash
# Repository'yi clone edin
git clone https://github.com/ArslanKG/arkegu-portfolio.git
cd arkegu-portfolio

# Dependencies'leri yükleyin
npm install

# Environment variables'ları konfigüre edin
cp .env.example .env.local
```

### Environment Konfigürasyonu

`.env.local` dosyasını aşağıdaki şekilde doldurun:

```env
# Brevo SMTP API Ayarları (ZORUNLU)
BREVO_API_KEY=xkeysib-your-api-key-here
RECIPIENT_EMAIL=your-email@domain.com

# Mail Gönderen Bilgileri (OPSİYONEL)
SENDER_NAME=Portfolio İletişim Formu
SENDER_EMAIL=noreply@yourdomain.com

# Güvenlik Ayarları (OPSİYONEL)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=900000
```

### Brevo API Key Alma

1. [Brevo.com](https://brevo.com)'a ücretsiz kayıt olun
2. Dashboard → API Keys → Create New API Key
3. Key'i `.env.local` dosyasına ekleyin

## 🖥️ Geliştirme

```bash
# Development server'ı başlatın
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Bundle analysis
npm run analyze

# Security audit
npm run security-audit
```

## 📦 Production Deployment

### Vercel (Önerilen)

```bash
# Vercel CLI ile deploy
npm i -g vercel
vercel

# Environment variables'ları Vercel dashboard'da ayarlayın
```

### Manuel Build

```bash
# Production build
npm run build

# Production server
npm run start
```

### Environment Variables (Production)

Vercel Dashboard → Settings → Environment Variables:

```
BREVO_API_KEY=xkeysib-your-production-api-key
RECIPIENT_EMAIL=your-production-email@domain.com
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=900000
```

## 🔧 Konfigürasyon

### Custom Domain

```javascript
// next.config.js
const nextConfig = {
  // Domain'inizi image domains'e ekleyin
  images: {
    domains: ['yourdomain.com']
  }
}
```

### CORS Ayarları

```env
# Allowed origins (comma separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 📊 Performance

- **Lighthouse Score**: 95+ (Mobile/Desktop)
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

### Optimizasyon Teknikleri

- Dynamic imports ile code splitting
- Image optimization (Next.js Image)
- Font optimization (Google Fonts)
- CSS purging (Tailwind CSS)
- Bundle analysis

## 🧪 Testing

```bash
# Manual security tests
curl -X POST http://localhost:3000/api/send-mail \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test message"}'

# Rate limiting test
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/send-mail
done

# XSS test
curl -X POST http://localhost:3000/api/send-mail \
  -d '{"message":"<script>alert(1)</script>"}'
```

## 📁 Proje Yapısı

```
arkegu-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/send-mail/     # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── sections/          # Page sections
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Utility functions
│   │   └── security.ts        # Security utilities
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── .env.example              # Environment template
├── SECURITY.md               # Security documentation
└── README.md                 # Project documentation
```

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **next-themes** - Theme management

### Backend
- **Next.js API Routes** - Serverless functions
- **Brevo API** - Email service
- **Custom Security Layer** - Rate limiting, CORS

### DevOps
- **Vercel** - Hosting platform
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 🔐 Güvenlik

Güvenlik politikası ve best practices için [SECURITY.md](./SECURITY.md) dosyasını inceleyin.

### Güvenlik Özeti
- ✅ Input sanitization
- ✅ Rate limiting (5 req/15min)
- ✅ CORS protection
- ✅ Security headers
- ✅ Type safety
- ✅ Environment validation

## 📈 SEO Optimizasyonu

- **Structured Data**: JSON-LD schema
- **Meta Tags**: Open Graph, Twitter Cards
- **Sitemap**: `/sitemap.xml`
- **Robots**: `/robots.txt`
- **Canonical URLs**: Duplicate content prevention

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](./LICENSE) dosyasını inceleyin.

## 📞 İletişim

**Arslan Kemal Gündüz**
- 📧 Email: arslankemalgunduz@gmail.com
- 💼 LinkedIn: [arslan-kemal-gunduz](https://linkedin.com/in/arslan-kemal-gunduz)
- 🐙 GitHub: [ArslanKG](https://github.com/ArslanKG)
- 🌐 Website: [arslankg.dev](https://arslankg.dev)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - Amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Brevo](https://brevo.com/) - Email API service
- [Vercel](https://vercel.com/) - Hosting platform

---

⭐ Bu projeyi beğendiyseniz star vermeyi unutmayın!

**Made with ❤️ in Turkey 🇹🇷**