# 🚀 Deployment Guide

Portfolio websitesini canlı yayına almak için adım adım rehber.

## 📋 Pre-Deployment Checklist

### ✅ Tamamlananlar
- [x] README.md oluşturuldu
- [x] LICENSE (MIT) eklendi
- [x] .gitignore yapılandırıldı
- [x] SEO metadata optimizasyonu (layout.tsx)
- [x] robots.txt eklendi
- [x] sitemap.xml oluşturuldu
- [x] package.json production ready
- [x] Responsive tasarım test edildi
- [x] Performance optimizasyonları yapıldı

### ⚠️ Manuel Yapılması Gerekenler
- [ ] favicon.ico dosyası ekle (public/favicon.ico)
- [ ] og-image.jpg oluştur (1200x630px, public/og-image.jpg)
- [ ] Google Analytics/Tag Manager entegrasyonu (isteğe bağlı)
- [ ] Contact form backend bağlantısı (isteğe bağlı)

## 🌐 Vercel Deployment (Önerilen)

### 1. GitHub Repository Hazırlığı
```bash
# Repository'yi GitHub'a push et
git add .
git commit -m "feat: production ready portfolio"
git push origin main
```

### 2. Vercel Deploy
1. [vercel.com](https://vercel.com) hesabı oluştur
2. "New Project" → GitHub repository'yi seç
3. Deploy ayarları:
   - **Framework**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Environment Variables (Gerekirse)
```env
# Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_CONTACT_FORM_URL=your-contact-form-endpoint
```

### 4. Custom Domain (Opsiyonel)
- Vercel Dashboard → Domains
- Custom domain ekle
- DNS ayarlarını güncelle

## 🔧 Netlify Deployment

### 1. Build Settings
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Deploy
1. [netlify.com](https://netlify.com) hesabı oluştur
2. Repository'yi bağla veya drag & drop
3. Build ayarlarını yapılandır

## 📊 Performance Optimization

### Yapılanlar
- ✅ Image optimization (Next.js Image component)
- ✅ Font optimization (Google Fonts)
- ✅ Code splitting (Next.js automatic)
- ✅ CSS minification (Tailwind purge)
- ✅ Bundle analysis ready

### Test Komutları
```bash
# Production build test
npm run build
npm start

# Bundle analysis
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Lighthouse test
npx lighthouse http://localhost:3000 --view
```

## 🔍 SEO Verification

### 1. Meta Tags Kontrolü
- ✅ Title, description, keywords
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs

### 2. Sitemap & Robots
- ✅ `/robots.txt` accessible
- ✅ `/sitemap.xml` accessible
- ✅ Google Search Console integration ready

### 3. Accessibility
- ✅ Alt tags for images
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Screen reader friendly

## 🚨 Final Checks

### Before Deploy
```bash
# Test production build locally
npm run build
npm start

# Check for console errors
# Test all navigation links
# Verify responsive design
# Test contact form
# Check loading performance
```

### After Deploy
- [ ] Test live URL
- [ ] Verify SSL certificate
- [ ] Check all pages load correctly
- [ ] Test contact form submission
- [ ] Validate SEO tags (view source)
- [ ] Run Lighthouse audit
- [ ] Submit to Google Search Console

## 📱 Social Media Optimization

### Open Graph Image
- Boyut: 1200x630px
- Format: JPG/PNG
- Dosya adı: `public/og-image.jpg`
- İçerik: İsim, title, logo/avatar

### Social Links Verification
- ✅ LinkedIn profile link
- ✅ GitHub profile link
- ✅ Email contact link

## 📈 Analytics Setup (Opsiyonel)

### Google Analytics 4
```javascript
// src/lib/gtag.js
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
```

### Microsoft Clarity (Opsiyonel)
```javascript
// User behavior analytics
// Free tool for heatmaps and session recordings
```

## 🔄 Maintenance

### Regular Updates
- Dependencies güncelleme: `npm update`
- Security audit: `npm audit`
- Performance monitoring
- Content güncellemeleri

### Backup Strategy
- GitHub repository (kod)
- Vercel automatic backups
- Database backup (contact form varsa)

---

## 🎯 Quick Deploy Commands

```bash
# Son kontroller
npm run lint
npm run build
npm start

# GitHub push
git add .
git commit -m "feat: ready for production"
git push origin main

# Vercel CLI (alternative)
npm i -g vercel
vercel --prod
```

## 📞 Support

Deployment sırasında sorun yaşarsanız:
- Vercel Docs: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Tailwind Docs: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**Deployment başarılı! 🎉**