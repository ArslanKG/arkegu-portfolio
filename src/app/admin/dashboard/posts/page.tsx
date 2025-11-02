"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiCalendar, FiMessageSquare, FiArrowLeft, FiFileText } from 'react-icons/fi'
import type { BlogPostWithCount } from '@/types/blog'
import { DeletePostButton } from '@/components/admin'

const PostsListPage = () => {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPostWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts from API
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts')
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }


  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  const truncateTitle = (title: string, maxLength: number = 50) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  const StatusBadge = ({ published }: { published: boolean }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      published 
        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    }`}>
      {published ? 'Published' : 'Draft'}
    </span>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading posts...</p>
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
                Blog Posts
              </h1>
            </motion.div>

            {/* Create New Post Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push('/admin/dashboard/posts/new')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <FiPlus className="w-4 h-4" />
              Create New Post
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 border border-gray-700/50 rounded-xl backdrop-blur-xl overflow-hidden"
        >
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">Create your first blog post to get started</p>
              <button
                onClick={() => router.push('/admin/dashboard/posts/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
              >
                <FiPlus className="w-4 h-4" />
                Create New Post
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Title</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Comments</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <h3 className="text-white font-medium mb-1">
                            {truncateTitle(post.title)}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-gray-400 line-clamp-1">
                              {truncateTitle(post.excerpt, 80)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge published={post.published} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-gray-300">
                          <FiMessageSquare className="w-4 h-4" />
                          <span className="text-sm">{post.commentCount || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-gray-400">
                          <FiCalendar className="w-4 h-4" />
                          <span className="text-sm">{formatDate(post.updatedAt)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/dashboard/posts/${post.id}/edit`)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                            title="Edit post"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <DeletePostButton
                            postId={post.id}
                            postTitle={post.title}
                            onDelete={() => {
                              // Remove from local state for immediate UI update
                              setPosts(posts.filter(p => p.id !== post.id))
                            }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}

export default PostsListPage