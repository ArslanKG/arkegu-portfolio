"use client"

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn, FiAlertCircle } from 'react-icons/fi'

interface LoginFormData {
  username: string
  password: string
  rememberMe: boolean
}

const AdminLoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check if user is already authenticated
    const checkAuth = async () => {
      const session = await getSession()
      if (session?.user) {
        router.push('/admin/dashboard')
      }
    }
    checkAuth()
  }, [router])

  if (!mounted) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username and password are required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Attempt authentication
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      // Step 2: Handle authentication result
      if (result?.error) {
        setError('Invalid username or password')
        setIsLoading(false)
        return
      }

      // Step 3: Check if authentication was successful
      if (result?.url) {
        // Successful authentication - redirect manually
        router.push('/admin/dashboard')
        router.refresh()
        // Keep loading state until redirect completes
        return
      }

      // Step 4: Fallback - verify session is established
      const session = await getSession()
      if (session?.user) {
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        setError('Authentication failed. Please try again.')
        setIsLoading(false)
      }
      
    } catch (error) {
      console.error('Login error:', error)
      setError('Authentication failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            animate={{
              y: [-20, -80],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
            }}
          />
        ))}
      </div>

      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-cyan-900/10" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Card Glow Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-xl" />
          
          <div className="relative">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 glow">
                  Admin Portal
                </span>
              </h1>
              <p className="text-gray-400 text-sm">
                Secure access to admin dashboard
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-300"
                >
                  <FiAlertCircle className="flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter your username"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me Checkbox */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center"
              >
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded disabled:opacity-50"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember me for 30 days
                </label>
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <FiLogIn />
                    )}
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                </button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-gray-500">
                Authorized personnel only. All access is monitored.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage