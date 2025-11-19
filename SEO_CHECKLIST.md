# SEO Kontrol Listesi - arkegu.com.tr

## ✅ Tamamlanan İyileştirmeler

### 1. Domain Güncellemeleri
- [x] `sitemap.xml` → `sitemap.ts` (Dinamik sitemap)
- [x] `robots.txt` → `robots.ts` (Dinamik robots)
- [x] Tüm URL'ler `arkegu.com.tr` olarak güncellendi
- [x] `package.json` homepage güncellendi
- [x] Ana layout metadata güncellendi
- [x] Blog sayfaları metadata güncellendi
- [x] Blog detay sayfası metadata güncellendi

### 2. Sitemap İyileştirmeleri
- [x] Dinamik sitemap oluşturuldu (`src/app/sitemap.ts`)
- [x] Blog postları otomatik olarak sitemap'e ekleniyor
- [x] `lastModified` tarihler dinamik
- [x] SEO öncelik değerleri optimize edildi

### 3. Robots.txt İyileştirmeleri
- [x] Admin paneli koruması eklendi (`/admin/`)
- [x] Auth API koruması eklendi (`/api/auth/`)
- [x] Modern Next.js 14 format kullanılıyor

### 4. Metadata İyileştirmeleri
- [x] OpenGraph etiketleri güncellendi
- [x] Twitter Card etiketleri güncellendi
- [x] Canonical URL'ler eklendi
- [x] Locale ayarları (tr_TR)
- [x] Keywords genişletildi

## 📋 Yapılması Gerekenler

### 1. Google Search Console
- [ ] Google Search Console'a giriş yapın: https://search.google.com/search-console
- [ ] `arkegu.com.tr` domain'ini ekleyin
- [ ] DNS doğrulaması veya HTML dosyası yöntemiyle doğrulayın
- [ ] Doğrulama kodunu `src/app/layout.tsx` içindeki `verification.google` alanına ekleyin
- [ ] Sitemap'i manuel olarak gönderin: https://arkegu.com.tr/sitemap.xml

### 2. Google Analytics (Opsiyonel)
- [ ] Google Analytics 4 hesabı oluşturun
- [ ] Tracking ID'yi alın
- [ ] `_app.tsx` veya `layout.tsx`'e Google Analytics script'ini ekleyin

### 3. Performans İyileştirmeleri
- [ ] PageSpeed Insights testi yapın: https://pagespeed.web.dev/
- [ ] Core Web Vitals metriklerini kontrol edin
- [ ] Görsel optimizasyonlarını kontrol edin

### 4. Schema.org Yapılandırılmış Veri
- [ ] Person/Organization schema ekleyin
- [ ] Blog post'lar için Article schema ekleyin
- [ ] BreadcrumbList schema ekleyin

### 5. Social Media
- [ ] OpenGraph görsellerini test edin: https://www.opengraph.xyz/
- [ ] Twitter Card'ları test edin: https://cards-dev.twitter.com/validator
- [ ] LinkedIn post preview'larını kontrol edin

### 6. Güvenlik
- [ ] SSL sertifikası kontrolü
- [ ] Security headers kontrolü
- [ ] Content Security Policy (CSP) implementasyonu

## 🔍 Test Araçları

### SEO Test Araçları
1. **Google Search Console**: https://search.google.com/search-console
2. **Google PageSpeed Insights**: https://pagespeed.web.dev/
3. **Google Rich Results Test**: https://search.google.com/test/rich-results
4. **Lighthouse (Chrome DevTools)**: F12 > Lighthouse

### Social Media Test Araçları
1. **OpenGraph Debugger**: https://www.opengraph.xyz/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### Sitemap ve Robots Test
1. **Sitemap URL**: https://arkegu.com.tr/sitemap.xml
2. **Robots URL**: https://arkegu.com.tr/robots.txt
3. **XML Sitemap Validator**: https://www.xml-sitemaps.com/validate-xml-sitemap.html

## 📊 Hedef Metrikler

### Google PageSpeed Insights
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: 100

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🚀 Deployment Sonrası

1. **Sitemap'i Google'a Gönder**
   ```bash
   # Google Search Console'da manuel olarak gönder
   https://arkegu.com.tr/sitemap.xml
   ```

2. **robots.txt Kontrolü**
   ```bash
   curl https://arkegu.com.tr/robots.txt
   ```

3. **Sitemap Kontrolü**
   ```bash
   curl https://arkegu.com.tr/sitemap.xml
   ```

4. **Metadata Kontrolü**
   ```bash
   curl -I https://arkegu.com.tr
   ```

## 📝 Notlar

### Dinamik Sitemap
- Blog postları otomatik olarak sitemap'e eklenir
- Her yeni post yayınlandığında sitemap otomatik güncellenir
- Unpublished post'lar sitemap'e dahil edilmez

### SEO Best Practices
- Her sayfa için unique title ve description
- Canonical URL'ler kullanılıyor
- OpenGraph ve Twitter Card meta etiketleri mevcut
- Responsive ve mobile-friendly
- HTTPS zorunlu
- Loading performance optimize edilmiş

### Güvenlik
- Admin paneli robots.txt ile korunuyor
- API endpoints rate-limited
- Security headers aktif
- CORS politikaları yapılandırılmış

## 🔗 Faydalı Linkler

- **Google Search Central**: https://developers.google.com/search
- **Next.js SEO**: https://nextjs.org/learn/seo/introduction-to-seo
- **Schema.org**: https://schema.org/
- **Open Graph Protocol**: https://ogp.me/

