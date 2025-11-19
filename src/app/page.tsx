"use client"

import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import ThemeToggle from '@/components/ThemeToggle'
import Hero from '@/components/sections/Hero'

// Lazy load SADECE non-critical component'ler
const About = dynamic(() => import('@/components/sections/About'), {
  ssr: false,
})

const Experience = dynamic(() => import('@/components/sections/Experience'), {
  ssr: false,
})

const Projects = dynamic(() => import('@/components/sections/Projects'), {
  ssr: false,
})

const Contact = dynamic(() => import('@/components/sections/Contact'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-black dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Basit CSS Animated Background - canvas yerine */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent" style={{ animationDuration: '8s' }} />
      </div>
      
      {/* Fixed Navigation */}
      <Navigation />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Main Content - motion.div kaldırıldı (framer-motion) */}
      <main className="relative z-10 animate-fadeIn">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
    </div>
  )
}