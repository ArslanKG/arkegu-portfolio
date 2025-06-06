# 🚀 Arslan Kemal Gündüz - Portfolio

Modern ve interaktif kişisel portfolio websitesi. Cyberpunk/futuristik tema ile tasarlanmış, responsive ve kullanıcı dostu arayüze sahip profesyonel portfolio.

## 🌟 Özellikler

- **Modern Tasarım**: Cyberpunk/futuristik tema ile etkileyici görsel deneyim
- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Interaktif Animasyonlar**: Framer Motion ile smooth animasyonlar
- **Particle Efektleri**: Dinamik arka plan parçacık sistemi
- **Typewriter Efekti**: Profesyonel yazma animasyonu
- **Dark/Light Mode**: Kullanıcı tercihine uygun tema seçenekleri
- **Scroll Animasyonları**: Sayfa kaydırma sırasında etkileyici geçişler
- **Proje Showcase**: Detaylı proje kartları ve modal görünümler
- **İletişim Formu**: Brevo SMTP API ile gerçek mail gönderimi
- **Email Entegrasyonu**: Güvenli environment variables ile API yönetimi

## 🛠️ Teknolojiler

### Frontend
- **Next.js 14+** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library

### Backend & API
- **Next.js API Routes** - Serverless API endpoints
- **Brevo SMTP API** - Email gönderim servisi

### Geliştirme Araçları
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## 🚀 Kurulum

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/ArslanKG/arkegu-portfolio.git
cd arkegu-portfolio
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
# veya
yarn dev
```

4. **Tarayıcınızda açın**
```
http://localhost:3000
```

## 📧 Email Konfigürasyonu

İletişim formunun çalışması için email entegrasyonu kurulumu gereklidir:

### 1. Brevo Hesabı Oluşturma
1. [Brevo.com](https://www.brevo.com) adresine gidin
2. Ücretsiz hesap oluşturun
3. Dashboard → SMTP & API → API Keys bölümüne gidin
4. "Create a new API key" ile yeni anahtar oluşturun
5. SMTP izninin aktif olduğundan emin olun

### 2. Environment Variables Kurulumu
1. `.env.example` dosyasını `.env.local` olarak kopyalayın:
```bash
cp .env.example .env.local
```

2. `.env.local` dosyasını düzenleyin:
```env
# Brevo SMTP API Ayarları
BREVO_API_KEY=your-brevo-api-key-here
RECIPIENT_EMAIL=your-email@example.com

# Mail gönderen bilgileri (opsiyonel)
SENDER_NAME=Portfolio İletişim Formu
SENDER_EMAIL=noreply@your-domain.com
```

### 3. Güvenlik Notları
- `.env.local` dosyası zaten `.gitignore`'da bulunur
- API anahtarlarınızı asla public repository'lerde paylaşmayın
- Production'da Vercel/Netlify environment variables kullanın

### 4. Production Deployment
Vercel/Netlify'da environment variables ekleyin:
- `BREVO_API_KEY`: Brevo API anahtarınız
- `RECIPIENT_EMAIL`: Mesajları alacağınız email
- `SENDER_NAME`: Gönderen adı (opsiyonel)
- `SENDER_EMAIL`: Gönderen email (opsiyonel)

##  Proje Yapısı

```
arkegu-portfolio/
├── public/
│   ├── images/               # Statik görseller
│   └── ...
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── globals.css       # Global stiller
│   │   ├── layout.tsx        # Ana layout
│   │   └── page.tsx          # Ana sayfa
│   └── components/
│       ├── sections/         # Sayfa bölümleri
│       │   ├── Hero.tsx
│       │   ├── About.tsx
│       │   ├── Experience.tsx
│       │   ├── Projects.tsx
│       │   └── Contact.tsx
│       ├── Navigation.tsx    # Header navigation
│       ├── ThemeToggle.tsx   # Tema değiştirici
│       ├── ParticleBackground.tsx
│       └── TypewriterEffect.tsx
├── .gitignore
├── README.md
├── LICENSE
└── package.json
```

## 🎨 Özelleştirme

### Renk Paleti
Proje cyberpunk teması kullanır:
- **Primary**: Purple (#9333ea)
- **Secondary**: Cyan (#06b6d4)
- **Accent**: Blue (#3b82f6)
- **Background**: Dark grays

### Kişisel Bilgileri Güncelleme
`src/components/sections/` klasöründeki ilgili dosyaları düzenleyin:
- `Hero.tsx` - Ana başlık ve açıklama
- `About.tsx` - Hakkımda bilgileri ve yetenekler
- `Experience.tsx` - İş deneyimi
- `Projects.tsx` - Projeler listesi
- `Contact.tsx` - İletişim bilgileri

## 🚀 Deployment

### Vercel (Önerilen)
1. [Vercel](https://vercel.com) hesabı oluşturun
2. Repository'yi Vercel'e bağlayın
3. Otomatik deployment başlayacak

### Netlify
1. [Netlify](https://netlify.com) hesabı oluşturun
2. Repository'yi drag & drop ile yükleyin
3. Build command: `npm run build`
4. Publish directory: `out`

### Manual Build
```bash
npm run build
npm run export
```

## 🌐 Demo

Canlı demo: [Portfolio Website](https://arkegu-portfolio.vercel.app)

## 📧 İletişim

**Arslan Kemal Gündüz**
- Email: arslankemalgunduz@gmail.com
- LinkedIn: [arslan-kemal-gunduz](https://www.linkedin.com/in/arslan-kemal-gunduz)
- GitHub: [@ArslanKG](https://github.com/ArslanKG)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!