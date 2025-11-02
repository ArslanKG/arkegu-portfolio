"use client"

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import PostEditor from '@/components/admin/PostEditor'

const NewPostPage = () => {
  const router = useRouter()

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
                Create New Post
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
            Create New Blog Post
          </h2>
          <p className="text-gray-400">
            Write and publish your next blog post using our rich text editor.
          </p>
        </motion.div>

        {/* PostEditor Component */}
        <PostEditor />
      </div>
    </div>
  )
}

export default NewPostPage