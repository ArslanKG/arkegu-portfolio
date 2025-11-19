# SEO Deployment Rehberi - arkegu.com.tr

## 🎯 Yapılan Değişiklikler Özeti

### 1. Domain Güncellemeleri ✅
Tüm dosyalarda eski domain referansları (`arkegu-portfolio.vercel.app`, `arslankg.dev`) yeni domain'e (`arkegu.com.tr`) güncellendi:

- `src/app/layout.tsx` - Ana metadata
- `src/app/blog/page.tsx` - Blog listesi metadata
- `src/app/blog/[slug]/page.tsx` - Blog detay metadata
- `package.json` - Homepage URL
- `public/robots.txt` - Robots dosyası
- `src/app/sitemap.ts` - Yeni dinamik sitemap

### 2. Dinamik Sitemap Sistemi ✅
**Dosya:** `src/app/sitemap.ts`

Özellikler:
- ✅ Statik sayfalar (ana sayfa, sections, blog ana sayfa)
- ✅ Dinamik blog postları (otomatik ekleme)
- ✅ Doğru tarih bilgileri (lastModified)
- ✅ SEO öncelik değerleri
- ✅ Changefreq ayarları
- ✅ Hata yönetimi

**Test:**
```bash
# Local test
npm run dev
# Browser'da: http://localhost:3000/sitemap.xml

# Production test
curl https://arkegu.com.tr/sitemap.xml
```

### 3. Robots.txt İyileştirmeleri ✅
**Dosyalar:** 
- `public/robots.txt` (statik - yedek)
- `src/app/robots.ts` (dinamik - Next.js 14)

Özellikler:
- ✅ Admin paneli koruması (`/admin/`)
- ✅ Auth API koruması (`/api/auth/`)
- ✅ Sitemap referansı
- ✅ Host bilgisi

**Test:**
```bash
curl https://arkegu.com.tr/robots.txt
```

### 4. Yapılandırılmış Veri (Schema.org) ✅
**Dosya:** `src/components/StructuredData.tsx`

Eklenen Schema'lar:
- ✅ Person Schema (Ana sayfa)
- ✅ Website Schema (Ana sayfa)
- ✅ Article Schema (Blog postları)
- ✅ Organization Schema (hazır)

**Test:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

### 5. Enhanced Metadata ✅

#### Ana Layout (`src/app/layout.tsx`)
- ✅ metadataBase: `https://arkegu.com.tr`
- ✅ OpenGraph tam yapılandırma
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Locale: tr_TR
- ✅ Google verification placeholder

#### Blog Pages
- ✅ Unique titles
- ✅ Rich descriptions
- ✅ Keywords optimization
- ✅ OpenGraph images
- ✅ Canonical URLs
- ✅ Article metadata

## 🚀 Deployment Adımları

### 1. Pre-Deployment Kontroller

```bash
# Build testi
npm run build

# Type check
npm run type-check

# Lint check
npm run lint
```

### 2. Domain Yapılandırması

**Vercel Dashboard:**
1. Project Settings > Domains
2. `arkegu.com.tr` ekleyin
3. DNS kayıtlarını yapılandırın:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP)

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 3. Environment Variables

**Vercel Dashboard > Environment Variables:**
```bash
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="https://arkegu.com.tr"
NEXTAUTH_SECRET="your-secret"

# Email (contact form)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Blob Storage
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

### 4. Deploy

```bash
# Git push
git add .
git commit -m "feat: SEO optimization for arkegu.com.tr domain"
git push origin main

# Vercel otomatik deploy edecek
```

## 📊 Post-Deployment SEO Görevleri

### 1. Google Search Console (ÖNEMLİ!)

**Adımlar:**
1. https://search.google.com/search-console adresine gidin
2. "Add Property" > "Domain" seçin
3. `arkegu.com.tr` domain'ini ekleyin
4. DNS TXT kaydı ile doğrulayın
5. Sitemap'i ekleyin: `https://arkegu.com.tr/sitemap.xml`
6. URL inceleme aracı ile test edin

**Doğrulama Kodu Ekleme:**
```typescript
// src/app/layout.tsx içinde
verification: {
  google: 'BURAYA-GOOGLE-VERIFICATION-CODE', // Search Console'dan alın
}
```

### 2. Google Analytics (Opsiyonel)

**Setup:**
```bash
# Google Analytics script'i ekleyin
# src/app/layout.tsx > <head> tag'ine
```

```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### 3. Performance Testing

**Test Siteleri:**
1. **PageSpeed Insights**: https://pagespeed.web.dev/
   - URL: `https://arkegu.com.tr`
   - Hedef: 90+ score

2. **Lighthouse** (Chrome DevTools)
   - F12 > Lighthouse
   - Performance, SEO, Accessibility testleri

3. **GTmetrix**: https://gtmetrix.com/

### 4. SEO Validation

**Test Araçları:**
```bash
# Sitemap kontrolü
curl https://arkegu.com.tr/sitemap.xml | head -50

# Robots kontrolü
curl https://arkegu.com.tr/robots.txt

# Headers kontrolü
curl -I https://arkegu.com.tr
```

**Online Araçlar:**
1. **Structured Data Test**: https://search.google.com/test/rich-results
2. **OpenGraph Debugger**: https://www.opengraph.xyz/?url=https://arkegu.com.tr
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **XML Sitemap Validator**: https://www.xml-sitemaps.com/validate-xml-sitemap.html

### 5. Social Media Testing

**Facebook/LinkedIn:**
```bash
# Debug URL'leri
https://developers.facebook.com/tools/debug/
https://www.linkedin.com/post-inspector/
```

**Twitter:**
```bash
https://cards-dev.twitter.com/validator
```

## 🔧 Troubleshooting

### Sitemap Görünmüyor
```bash
# Build ve restart
npm run build
npm start

# Cache temizle
vercel --prod
```

### Robots.txt Çalışmıyor
```bash
# public/robots.txt ve src/app/robots.ts ikisi de mevcut
# Next.js 14 önce src/app/robots.ts'i kullanır
```

### Metadata Görünmüyor
```bash
# Browser cache temizle
# Incognito mode'da test et
# View Page Source ile HTML'i kontrol et
```

## 📈 Monitoring

### Google Search Console (Haftalık)
- [ ] İndexing durumu
- [ ] Hata raporları
- [ ] Performance metrikleri
- [ ] Core Web Vitals

### Analytics (Aylık)
- [ ] Traffic analizi
- [ ] Popular pages
- [ ] Bounce rate
- [ ] Conversion tracking

### Uptime Monitoring
- [ ] UptimeRobot kurulumu
- [ ] SSL sertifika expiry
- [ ] Performance alerts

## 🎯 Hedefler (3 Ay)

### SEO Metrikleri
- [ ] Google'da ilk sayfada yer alma (target keywords için)
- [ ] Domain Authority > 20
- [ ] Backlink sayısı > 50
- [ ] Organic traffic > 1000/ay

### Technical SEO
- [ ] PageSpeed Score > 90
- [ ] Core Web Vitals: All Green
- [ ] Mobile Usability: No issues
- [ ] Security: A+ (SSLLabs)

### Content
- [ ] 20+ blog post
- [ ] Weekly publish schedule
- [ ] Multi-language support (TR/EN)
- [ ] Newsletter integration

## 📚 Kaynaklar

### Official Documentation
- Next.js SEO: https://nextjs.org/learn/seo/introduction-to-seo
- Google Search Central: https://developers.google.com/search
- Schema.org: https://schema.org/

### Tools
- Ahrefs: https://ahrefs.com/
- SEMrush: https://www.semrush.com/
- Moz: https://moz.com/

### Communities
- r/SEO: https://www.reddit.com/r/SEO/
- WebmasterWorld: https://www.webmasterworld.com/
- Google Search Central Community: https://support.google.com/webmasters/community

---

**Son Güncelleme:** 19 Kasım 2025
**Domain:** arkegu.com.tr
**Status:** Production Ready ✅

