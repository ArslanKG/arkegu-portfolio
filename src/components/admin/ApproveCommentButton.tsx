"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi'

interface ApproveCommentButtonProps {
  commentId: string
  onApprove?: () => void
}

const ApproveCommentButton = ({ commentId, onApprove }: ApproveCommentButtonProps) => {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  const handleApprove = async () => {
    if (!commentId || isApproving || isApproved) return

    try {
      setIsApproving(true)
      setError(null)

      // Optimistic UI update
      setIsApproved(true)

      const response = await fetch(`/api/comments/${commentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        // Revert optimistic update on error
        setIsApproved(false)
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to approve comment')
      }

      // Show success notification
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)

      // Call optional callback
      if (onApprove) {
        onApprove()
      }

      // Refresh the page data
      router.refresh()

    } catch (err) {
      console.error('Error approving comment:', err)
      setError(err instanceof Error ? err.message : 'Failed to approve comment')
      setIsApproved(false) // Ensure we revert optimistic update
      
      // Auto-hide error after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <div className="relative">
      {/* Approve Button */}
      <button
        onClick={handleApprove}
        disabled={isApproving || isApproved}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed ${
          isApproved
            ? 'bg-green-500/30 text-green-300 border border-green-500/50 cursor-default'
            : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 hover:text-green-300 hover:border-green-500/50'
        }`}
        title={isApproved ? 'Comment approved' : 'Approve comment'}
      >
        {isApproving ? (
          <FiLoader className="w-4 h-4 animate-spin" />
        ) : (
          <FiCheck className={`w-4 h-4 ${isApproved ? 'animate-pulse' : ''}`} />
        )}
        <span className="text-sm">
          {isApproving ? 'Approving...' : isApproved ? 'Approved' : 'Approve'}
        </span>
      </button>

      {/* Success Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute top-full left-0 mt-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-xl z-50"
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <FiCheck className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-300">Comment approved!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute top-full left-0 mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-xl z-50 max-w-xs"
          >
            <div className="flex items-start gap-2">
              <FiAlertCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-red-300">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApproveCommentButton