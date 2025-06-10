"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi'
import CVDownloadDropdown from '@/components/CVDownloadDropdown'

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'arslankemalgunduz@gmail.com',
      href: 'mailto:arslankemalgunduz@gmail.com',
      color: 'text-blue-400'
    },
    {
      icon: FiMapPin,
      label: 'Lokasyon',
      value: 'Eskişehir, Türkiye',
      href: '#',
      color: 'text-green-400'
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      value: '/in/arslan-kemal-gunduz',
      href: 'https://www.linkedin.com/in/arslan-kemal-gunduz',
      color: 'text-blue-600'
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      value: '/ArslanKG',
      href: 'https://github.com/ArslanKG',
      color: 'text-purple-400'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Hata mesajını temizle
    if (submitError) {
      setSubmitError(null)
    }
  }

  const validateForm = () => {
    // Ad soyad kontrolü
    if (!formData.name.trim()) {
      setSubmitError('Lütfen ad soyad alanını doldurun.')
      return false
    }
    
    if (formData.name.trim().length < 2) {
      setSubmitError('Ad soyad en az 2 karakter olmalıdır.')
      return false
    }

    // Email kontrolü
    if (!formData.email.trim()) {
      setSubmitError('Lütfen e-posta adresinizi girin.')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Lütfen geçerli bir e-posta adresi girin.')
      return false
    }

    // Konu kontrolü
    if (!formData.subject.trim()) {
      setSubmitError('Lütfen mesaj konusunu belirtin.')
      return false
    }

    if (formData.subject.trim().length < 3) {
      setSubmitError('Mesaj konusu en az 3 karakter olmalıdır.')
      return false
    }

    // Mesaj kontrolü
    if (!formData.message.trim()) {
      setSubmitError('Lütfen mesajınızı yazın.')
      return false
    }

    if (formData.message.trim().length < 10) {
      setSubmitError('Mesajınız en az 10 karakter olmalıdır.')
      return false
    }

    if (formData.message.trim().length > 2000) {
      setSubmitError('Mesajınız en fazla 2000 karakter olabilir.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    // Form validasyonu
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        // API'den gelen hata mesajını göster
        setSubmitError(result.message || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      console.error('Form gönderim hatası:', error)
      
      // Bağlantı hatası detayları
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setSubmitError('İnternet bağlantınızı kontrol edin ve tekrar deneyin.')
      } else if (error instanceof Error && error.name === 'AbortError') {
        setSubmitError('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.')
      } else {
        setSubmitError('Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Birlikte <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Çalışalım</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Yeni projeler, iş birlikleri veya sadece merhaba demek için benimle iletişime geçin
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Yeni fırsatlar, projeler ve iş birlikleri için her zaman açığım. 
                  Birlikte harika şeyler yaratabilir ve teknoloji dünyasında iz bırakabiliriz.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="group"
                  >
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : '_self'}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:bg-gray-800/70"
                    >
                      <div className={`p-3 ${info.color} bg-gray-700/50 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        <info.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{info.label}</p>
                        <p className="text-white font-medium">{info.value}</p>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0 }}
                className="pt-8"
              >
                <CVDownloadDropdown variant="primary" />
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Mesaj Gönder</h3>
              
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/30 rounded-lg mb-6 text-green-400"
                >
                  <FiCheck size={20} />
                  Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg mb-6 text-red-400"
                >
                  <FiAlertCircle size={20} />
                  {submitError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-400"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-400"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-400"
                    placeholder="Mesaj konusu"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-400 resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Mesaj Gönder
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-500"
      >
        <p>© 2024 Arslan Kemal Gündüz. Tüm hakları saklıdır.</p>
        <p className="mt-2 text-sm">Next.js ve TypeScript ile geliştirilmiştir.</p>
      </motion.footer>
    </section>
  )
}

export default Contact