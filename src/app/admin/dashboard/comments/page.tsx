"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiArrowLeft,
  FiMessageSquare,
  FiCheck,
  FiCalendar,
  FiUser,
  FiMail,
  FiFileText,
  FiSearch,
  FiCheckSquare,
  FiXSquare,
  FiAlertCircle,
  FiClock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi'
import { ApproveCommentButton, DeleteCommentButton } from '@/components/admin'

// Types
interface CommentWithPost {
  id: string
  author: string
  email: string
  content: string
  approved: boolean
  createdAt: Date
  post: {
    id: string
    title: string
    slug: string
  }
}

interface CommentsStats {
  total: number
  pending: number
  approved: number
}

interface CommentsData {
  comments: CommentWithPost[]
  stats: CommentsStats
}

// Utility function to mask email
const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 3) {
    return `${localPart}@${domain}`
  }
  return `${localPart.substring(0, 3)}...@${domain}`
}

// Utility function to truncate content
const truncateContent = (content: string, maxLength: number = 100): string => {
  return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content
}

// Format date in Turkish
const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Comment Card Component
interface CommentCardProps {
  comment: CommentWithPost
  onApprove: (id: string) => void
  onDelete: (id: string) => void
  loading?: boolean
}

const CommentCard = ({ comment, onApprove, onDelete, loading = false }: CommentCardProps) => {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  const borderColor = comment.approved 
    ? 'border-green-500/30 bg-green-500/5' 
    : 'border-yellow-500/30 bg-yellow-500/5'

  const statusColor = comment.approved 
    ? 'text-green-400 bg-green-500/20' 
    : 'text-yellow-400 bg-yellow-500/20'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border ${borderColor} rounded-xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-medium truncate">{comment.author}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                {comment.approved ? 'Approved' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <FiMail className="w-3 h-3" />
                <span>{maskEmail(comment.email)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                <span>{formatDate(comment.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Info */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <FiFileText className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">Post:</span>
          <button
            onClick={() => router.push(`/admin/dashboard/posts/${comment.post.id}/edit`)}
            className="text-blue-400 hover:text-blue-300 truncate font-medium transition-colors"
            title="Edit post"
          >
            {comment.post.title}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="text-gray-300 leading-relaxed">
          {expanded ? comment.content : truncateContent(comment.content)}
          {comment.content.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {expanded ? (
                <span className="flex items-center gap-1">
                  <FiEyeOff className="w-3 h-3" />
                  Show less
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FiEye className="w-3 h-3" />
                  Show more
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {!comment.approved && (
          <ApproveCommentButton
            commentId={comment.id}
            onApprove={() => onApprove(comment.id)}
          />
        )}
        <DeleteCommentButton
          commentId={comment.id}
          onDelete={() => onDelete(comment.id)}
        />
      </div>
    </motion.div>
  )
}

// Stats Card Component
interface StatsCardProps {
  title: string
  count: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

const StatsCard = ({ title, count, icon, color, bgColor }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${bgColor} border border-gray-700/50 rounded-xl p-6 backdrop-blur-xl`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 ${color} rounded-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{count}</p>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </div>
  </motion.div>
)

const CommentsListPage = () => {
  const router = useRouter()
  const [data, setData] = useState<CommentsData>({ comments: [], stats: { total: 0, pending: 0, approved: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterApproved, setFilterApproved] = useState<'all' | 'pending' | 'approved'>('all')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Fetch comments from API
  useEffect(() => {
    fetchComments()
  }, [filterApproved, searchQuery])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filterApproved !== 'all') {
        params.append('approved', filterApproved === 'approved' ? 'true' : 'false')
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }

      const response = await fetch(`/api/comments?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }

      const data: CommentsData = await response.json()
      setData(data)
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch comments')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleApprove = async (commentId: string) => {
    try {
      setActionLoading(commentId)
      const response = await fetch(`/api/comments/${commentId}/approve`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to approve comment')
      }

      // Update local state
      setData(prev => ({
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId ? { ...comment, approved: true } : comment
        ),
        stats: {
          ...prev.stats,
          pending: prev.stats.pending - 1,
          approved: prev.stats.approved + 1
        }
      }))

      showNotification('success', 'Comment approved successfully')
    } catch (err) {
      console.error('Error approving comment:', err)
      showNotification('error', 'Failed to approve comment')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!deleteId || deleteId !== commentId) return
    
    try {
      setActionLoading(commentId)
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      const deletedComment = data.comments.find(c => c.id === commentId)
      
      // Remove from local state
      setData(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId),
        stats: {
          total: prev.stats.total - 1,
          pending: deletedComment?.approved ? prev.stats.pending : prev.stats.pending - 1,
          approved: deletedComment?.approved ? prev.stats.approved - 1 : prev.stats.approved
        }
      }))

      setDeleteId(null)
      showNotification('success', 'Comment deleted successfully')
    } catch (err) {
      console.error('Error deleting comment:', err)
      showNotification('error', 'Failed to delete comment')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkApprove = async () => {
    const pendingComments = data.comments.filter(c => !c.approved)
    if (pendingComments.length === 0) return

    try {
      setActionLoading('bulk-approve')
      
      const promises = pendingComments.map(comment => 
        fetch(`/api/comments/${comment.id}/approve`, { method: 'POST' })
      )
      
      const results = await Promise.allSettled(promises)
      const successCount = results.filter(r => r.status === 'fulfilled').length
      
      if (successCount > 0) {
        // Refresh data
        await fetchComments()
        showNotification('success', `${successCount} comments approved successfully`)
      } else {
        showNotification('error', 'Failed to approve comments')
      }
    } catch (err) {
      console.error('Error bulk approving:', err)
      showNotification('error', 'Failed to approve comments')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkDelete = async () => {
    const pendingComments = data.comments.filter(c => !c.approved)
    if (pendingComments.length === 0) return

    try {
      setActionLoading('bulk-delete')
      
      const promises = pendingComments.map(comment => 
        fetch(`/api/comments/${comment.id}`, { method: 'DELETE' })
      )
      
      const results = await Promise.allSettled(promises)
      const successCount = results.filter(r => r.status === 'fulfilled').length
      
      if (successCount > 0) {
        // Refresh data
        await fetchComments()
        showNotification('success', `${successCount} pending comments deleted successfully`)
      } else {
        showNotification('error', 'Failed to delete comments')
      }
    } catch (err) {
      console.error('Error bulk deleting:', err)
      showNotification('error', 'Failed to delete comments')
    } finally {
      setActionLoading(null)
    }
  }

  // Filter comments based on current filter
  const filteredComments = data.comments
  const pendingComments = filteredComments.filter(c => !c.approved)
  const approvedComments = filteredComments.filter(c => c.approved)

  if (loading && data.comments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading comments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-700/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button & Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Dashboard</span>
              </button>
              <div className="w-px h-6 bg-gray-700" />
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Comment Moderation
              </h1>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors w-64"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg border ${
              notification.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <FiCheck className="w-4 h-4" />
              ) : (
                <FiAlertCircle className="w-4 h-4" />
              )}
              <p>{notification.message}</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Comments"
            count={data.stats.total}
            icon={<FiMessageSquare className="w-6 h-6 text-white" />}
            color="bg-blue-500/20"
            bgColor="bg-gray-900/50"
          />
          <StatsCard
            title="Pending Review"
            count={data.stats.pending}
            icon={<FiClock className="w-6 h-6 text-white" />}
            color="bg-yellow-500/20"
            bgColor="bg-gray-900/50"
          />
          <StatsCard
            title="Approved"
            count={data.stats.approved}
            icon={<FiCheck className="w-6 h-6 text-white" />}
            color="bg-green-500/20"
            bgColor="bg-gray-900/50"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Comments', count: data.stats.total },
              { key: 'pending', label: 'Pending', count: data.stats.pending },
              { key: 'approved', label: 'Approved', count: data.stats.approved }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterApproved(filter.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterApproved === filter.key
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {data.stats.pending > 0 && filterApproved !== 'approved' && (
            <div className="flex gap-2">
              <button
                onClick={handleBulkApprove}
                disabled={actionLoading === 'bulk-approve'}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCheckSquare className="w-4 h-4" />
                <span className="text-sm">Approve All Pending</span>
                {actionLoading === 'bulk-approve' && (
                  <div className="w-4 h-4 border border-green-400 border-t-transparent rounded-full animate-spin" />
                )}
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading === 'bulk-delete'}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiXSquare className="w-4 h-4" />
                <span className="text-sm">Delete All Pending</span>
                {actionLoading === 'bulk-delete' && (
                  <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-gray-900/50 border border-gray-700/50 rounded-xl backdrop-blur-xl"
          >
            <FiMessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              {searchQuery.trim() 
                ? 'No comments found' 
                : filterApproved === 'pending' 
                  ? 'No pending comments' 
                  : filterApproved === 'approved' 
                    ? 'No approved comments' 
                    : 'No comments yet'
              }
            </h3>
            <p className="text-gray-400">
              {searchQuery.trim() 
                ? 'Try adjusting your search query or filter settings'
                : 'Comments will appear here when users start engaging with your blog posts'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Pending Comments Section */}
            {filterApproved !== 'approved' && pendingComments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-yellow-400" />
                  Pending Comments ({pendingComments.length})
                </h2>
                <div className="space-y-4">
                  {pendingComments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onApprove={handleApprove}
                      onDelete={(id) => setDeleteId(id)}
                      loading={actionLoading === comment.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Approved Comments Section */}
            {filterApproved !== 'pending' && approvedComments.length > 0 && (
              <div className={pendingComments.length > 0 ? 'mt-8' : ''}>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiCheck className="w-5 h-5 text-green-400" />
                  Approved Comments ({approvedComments.length})
                </h2>
                <div className="space-y-4">
                  {approvedComments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onApprove={handleApprove}
                      onDelete={(id) => setDeleteId(id)}
                      loading={actionLoading === comment.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <FiAlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-medium text-white">Delete Comment</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={actionLoading === deleteId}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={actionLoading === deleteId}
                >
                  {actionLoading === deleteId ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CommentsListPage