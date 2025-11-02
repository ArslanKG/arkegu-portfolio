"use client"

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect if not loading and not already on login page
    if (status === 'loading') return
    
    if (!session && pathname !== '/admin') {
      router.push('/admin')
    }
  }, [session, status, router, pathname])

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not on login page, show nothing (will redirect)
  if (!session && pathname !== '/admin') {
    return null
  }

  // If on login page, show login page without layout
  if (pathname === '/admin') {
    return <>{children}</>
  }

  // Authenticated - show full admin layout
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="admin-layout">
        {children}
      </div>
    </div>
  )
}