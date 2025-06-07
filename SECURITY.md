# Security Policy

## Güvenlik Raporu

Bu belge, arkegu-portfolio projesinin güvenlik politikasını ve uygulanan güvenlik önlemlerini açıklar.

## 🔐 Güvenlik Önlemleri

### API Güvenliği
- **Rate Limiting**: 15 dakikada maksimum 5 istek
- **CORS Protection**: Sadece izin verilen domainlerden erişim
- **Input Sanitization**: XSS ve injection saldırı koruması
- **Environment Variable Validation**: API key format kontrolü
- **Request Timeout**: 10 saniye timeout ile DoS koruması

### HTTP Güvenlik Headers
- `X-Frame-Options: DENY` - Clickjacking koruması
- `X-Content-Type-Options: nosniff` - MIME type sniffing koruması
- `X-XSS-Protection: 1; mode=block` - XSS koruması
- `Referrer-Policy: origin-when-cross-origin` - Referrer bilgi sızıntısı koruması
- `Permissions-Policy` - Tarayıcı API'lerine erişim kontrolü

### Data Validation
- Email format validation (RFC 5322 compliant)
- Input length limitations
- Special character filtering
- SQL injection protection
- HTML tag stripping

## 🚨 Güvenlik Açıkları Bildirimi

Güvenlik açığı tespit ederseniz:

1. **Email**: arslankemalgunduz@gmail.com
2. **Konu**: [SECURITY] Güvenlik Açığı Raporu
3. **İçerik**: 
   - Açığın detaylı açıklaması
   - Yeniden üretim adımları
   - Potansiyel etki analizi

## 🔄 Güvenlik Güncellemeleri

### v1.1.0 (2024-12-06)
- ✅ API key exposure sorunu çözüldü
- ✅ Rate limiting implementasyonu
- ✅ CORS güvenlik katmanı
- ✅ Input sanitization eklendi
- ✅ Security headers konfigürasyonu
- ✅ TypeScript strict mode aktivasyonu

### Yaklaşan Güncellemeler
- [ ] Redis rate limiting (production)
- [ ] API key rotation otomasyonu
- [ ] Security audit automation
- [ ] CSRF token implementasyonu

## 📋 Güvenlik Kontrol Listesi

### Development
- [x] Environment variables güvenliği
- [x] Dependency security audit
- [x] Code quality checks
- [x] Type safety enforcement

### Production
- [x] HTTPS enforcement
- [x] Security headers
- [x] Rate limiting
- [x] Input validation
- [x] Error handling

### Monitoring
- [x] API error logging
- [x] Rate limit monitoring
- [x] Suspicious activity detection

## 🛠️ Güvenlik Testleri

### Manual Tests
```bash
# API rate limiting test
for i in {1..10}; do curl -X POST /api/send-mail; done

# XSS test payloads
curl -X POST /api/send-mail -d '{"message":"<script>alert(1)</script>"}'

# SQL injection test
curl -X POST /api/send-mail -d '{"email":"test@test.com'; DROP TABLE users; --"}'
```

### Automated Security Scan
```bash
npm run security-audit
npm audit --audit-level high
```

## 📚 Güvenlik Kaynakları

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/security/)

## 🔑 Environment Variables

### Required (Production)
```env
BREVO_API_KEY=xkeysib-[VALID_API_KEY]
RECIPIENT_EMAIL=your-email@domain.com
```

### Optional (Production)
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=900000
SENDER_NAME=Your Portfolio Contact Form
SENDER_EMAIL=noreply@yourdomain.com
```

### Development
```env
NODE_ENV=development
# Localhost origins otomatik olarak izin verilir
```

## ⚠️ Bilinen Sınırlamalar

1. **In-Memory Rate Limiting**: Production'da Redis kullanılmalı
2. **Basic XSS Protection**: CSP header implementasyonu önerilir
3. **No CSRF Protection**: Form tabanlı CSRF token eklenmeli
4. **Basic Error Handling**: Structured logging implementasyonu önerilir

## 📞 İletişim

Güvenlik ile ilgili sorularınız için:
- **Email**: arslankemalgunduz@gmail.com
- **LinkedIn**: [Arslan Kemal Gündüz](https://linkedin.com/in/arslan-kemal-gunduz)

---

**Son Güncelleme**: 6 Aralık 2024
**Versiyon**: 1.1.0