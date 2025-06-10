"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

// Enhanced Navigation Component with Cyberpunk Theme

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Hakkımda', href: '#about' },
    { name: 'Deneyim', href: '#experience' },
    { name: 'Projeler', href: '#projects' },
    { name: 'İletişim', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-md border-b border-blue-500/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - removed for cleaner design */}
            <div></div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(147, 51, 234, 0.6)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item.href)}
                  className="relative group px-4 py-2 border border-gray-600/50 bg-gray-900/30 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/70 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-blue-900/20"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-600/0 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-cyan-600/10 transition-all duration-500"></div>
                  
                  {/* Hexagonal corners */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-purple-500/0 group-hover:border-purple-500/70 transition-all duration-300"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-purple-500/0 group-hover:border-purple-500/70 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-purple-500/0 group-hover:border-purple-500/70 transition-all duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-purple-500/0 group-hover:border-purple-500/70 transition-all duration-300"></div>
                  
                  {/* Terminal-style brackets */}
                  <span className="relative z-10 text-gray-300 group-hover:text-white transition-all duration-300 font-mono">
                    <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">[</span>
                    <span className="mx-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                      {item.name}
                    </span>
                    <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">]</span>
                  </span>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/20 group-hover:to-cyan-500/20 blur-sm transition-all duration-300"></div>
                  
                  {/* Bottom scan line */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-500"></div>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="fixed inset-0 bg-black/80" onClick={() => setIsOpen(false)} />
            <div className="fixed right-0 top-0 h-full w-72 bg-gray-900/95 backdrop-blur-md border-l border-purple-500/30 p-6 overflow-hidden">
              {/* Background scan lines */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{ top: `${i * 5}%` }}
                  />
                ))}
              </div>
              
              <div className="mt-16 space-y-4 relative z-10">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      x: 5,
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left relative group px-4 py-3 border border-gray-600/30 bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-blue-900/30"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-cyan-600/0 group-hover:from-purple-600/20 group-hover:to-cyan-600/20 transition-all duration-500"></div>
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-cyan-400/0 group-hover:border-cyan-400/70 transition-all duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-purple-400/0 group-hover:border-purple-400/70 transition-all duration-300"></div>
                    
                    <span className="relative z-10 text-gray-300 group-hover:text-white font-mono text-lg transition-all duration-300">
                      <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{">"}</span>
                      <span className="mx-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                        {item.name}
                      </span>
                      <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{"_"}</span>
                    </span>
                    
                    {/* Side glow */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/70 group-hover:to-purple-400/70 transition-all duration-500"></div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation