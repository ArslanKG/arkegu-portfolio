"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCalendar, FiTag } from 'react-icons/fi'
import PostEditor from '@/components/admin/PostEditor'
import type { BlogPost } from '@/types/blog'

const EditPostPage = () => {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch post data
  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/posts/${postId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found')
          }
          throw new Error('Failed to fetch post')
        }

        const data = await response.json()
        setPost(data.post)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-white mb-2">Error Loading Post</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/admin/dashboard/posts')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Posts
          </button>
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
                onClick={() => router.push('/admin/dashboard/posts')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back to Posts</span>
              </button>
              <div className="w-px h-6 bg-gray-700" />
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Edit Post: {post?.title || 'Loading...'}
              </h1>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Edit Blog Post
          </h2>
          <p className="text-gray-400">
            Make changes to your blog post using our rich text editor.
          </p>
        </motion.div>

        {/* Post Info Cards */}
        {post && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${post.published ? 'bg-green-400' : 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-white font-medium">{post.published ? 'Published' : 'Draft'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-white font-medium">{formatDate(post.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <FiTag className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Tags</p>
                  <p className="text-white font-medium">{post.tags.length > 0 ? post.tags.join(', ') : 'No tags'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PostEditor Component */}
        <PostEditor post={post} />
      </div>
    </div>
  )
}

export default EditPostPage