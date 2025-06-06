"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiEye } from 'react-icons/fi'
import TypewriterEffect from '@/components/TypewriterEffect'

const Hero = () => {
  const [mounted, setMounted] = useState(false)
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrollIndicatorVisible(scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) {
    return null
  }

  const socialLinks = [
    {
      icon: FiGithub,
      href: 'https://github.com/ArslanKG',
      label: 'GitHub'
    },
    {
      icon: FiLinkedin,
      href: 'https://www.linkedin.com/in/arslan-kemal-gunduz',
      label: 'LinkedIn'
    },
    {
      icon: FiMail,
      href: 'mailto:arslankemalgunduz@gmail.com',
      label: 'Email'
    }
  ]

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400" style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}>
              Arslan Kemal
            </span>
            <br />
            <span className="text-white">
              Gündüz
            </span>
          </motion.h1>

          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 h-16 flex items-center justify-center"
          >
            <TypewriterEffect
              strings={[
                'Senior Software Developer',
                '.NET Expert',
                'FinTech Developer',
                'SaaS Solutions Expert',
                'React & Vue.js Developer',
              ]}
              speed={75}
              deleteSpeed={50}
              delay={1000}
              loop={true}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Eskişehir'de yaşayan, bulut tabanlı muhasebe ve fintech çözümleri geliştiren
            deneyimli yazılım geliştiricisi. Modern teknolojilerle ölçeklenebilir
            SaaS ürünleri tasarlıyor ve geliştiriyorum.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-blue-400 hover:border-cyan-400 text-blue-400 hover:text-cyan-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden relative group"
            >
              <motion.span
                className="relative flex items-center gap-2"
                animate={{ x: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FiEye />
                Projeler
              </motion.span>
            </motion.button>

            <motion.a
              href="/pdf/CV.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-gray-400 hover:border-blue-400 text-gray-300 hover:text-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <FiDownload />
              CV İndir
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex justify-center gap-6 mb-12"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="p-3 bg-gray-800/50 border border-gray-700 hover:border-blue-500 rounded-lg text-gray-400 hover:text-blue-400 transition-all duration-300 backdrop-blur-sm"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>

        </motion.div>

      </div>

      {/* Fixed Scroll Indicator */}
      <AnimatePresence>
        {scrollIndicatorVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-blue-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Hero