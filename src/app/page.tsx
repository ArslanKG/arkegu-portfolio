"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'
import Navigation from '@/components/Navigation'
import ThemeToggle from '@/components/ThemeToggle'
import ParticleBackground from '@/components/ParticleBackground'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-black dark:via-gray-900 dark:to-black relative overflow-hidden">
      <ParticleBackground />
      
      {/* Fixed Navigation */}
      <Navigation />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Main Content */}
      <main className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-0"
        >
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Contact />
        </motion.div>
      </main>
      
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
    </div>
  )
}