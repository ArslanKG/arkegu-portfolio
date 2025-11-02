"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiLoader, FiAlertCircle, FiX, FiUser } from 'react-icons/fi'

interface DeleteCommentButtonProps {
  commentId: string
  onDelete?: () => void
}

const DeleteCommentButton = ({ commentId, onDelete }: DeleteCommentButtonProps) => {
  const router = useRouter()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!commentId) return

    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete comment')
      }

      // Close dialog
      setShowConfirmDialog(false)
      
      // Call optional callback
      if (onDelete) {
        onDelete()
      }

      // Refresh the page data
      router.refresh()

    } catch (err) {
      console.error('Error deleting comment:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmDialog(false)
    setError(null)
  }

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={() => setShowConfirmDialog(true)}
        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:text-red-300 hover:border-red-500/50 transition-all duration-200 group"
        title="Delete comment"
        disabled={isDeleting}
      >
        <FiTrash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-sm">Delete</span>
      </button>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-red-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                    <FiAlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Delete Comment</h3>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-300 mb-3">
                  Are you sure you want to delete this comment? This action cannot be undone and will permanently remove the comment from the system.
                </p>
                <div className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiUser className="w-4 h-4" />
                    <span>Comment ID: {commentId}</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-sm font-medium mb-1">Warning</p>
                    <p className="text-yellow-200 text-sm">
                      Deleting this comment will also remove any replies or engagement metrics associated with it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FiAlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all duration-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/25"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      Delete Comment
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DeleteCommentButton