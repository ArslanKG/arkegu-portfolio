"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiSave, 
  FiEye, 
  FiEyeOff, 
  FiImage, 
  FiX, 
  FiPlus,
  FiCalendar,
  FiEdit3,
  FiUpload,
  FiCheck,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi'
import { generateSlug, generateExcerpt } from '@/lib/blog-utils'
import type { BlogPost, CreateBlogPostRequest, UpdateBlogPostRequest } from '@/types/blog'

// Form data interface
interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  tags: string[]
  published: boolean
  isFeatured: boolean
  publishedAt: string
}

// Component props
interface PostEditorProps {
  post?: BlogPost | null
  onSave?: (saved: boolean) => void
}

const PostEditor = ({ post, onSave }: PostEditorProps) => {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [],
    published: false,
    isFeatured: false,
    publishedAt: ''
  })
  
  // UI state
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true)
  const [autoGenerateExcerpt, setAutoGenerateExcerpt] = useState(true)

  // Initialize form data when post changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        coverImage: post.coverImage || '',
        tags: post.tags || [],
        published: post.published,
        isFeatured: post.isFeatured || false,
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ''
      })
      setAutoGenerateSlug(false)
      setAutoGenerateExcerpt(!post.excerpt)
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: [],
        published: false,
        isFeatured: false,
        publishedAt: ''
      })
      setAutoGenerateSlug(true)
      setAutoGenerateExcerpt(true)
    }
  }, [post])

  // Auto-generate slug when title changes
  useEffect(() => {
    if (autoGenerateSlug && formData.title) {
      const newSlug = generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: newSlug }))
    }
  }, [formData.title, autoGenerateSlug])

  // Auto-generate excerpt when content changes
  useEffect(() => {
    if (autoGenerateExcerpt && formData.content) {
      const newExcerpt = generateExcerpt(formData.content)
      setFormData(prev => ({ ...prev, excerpt: newExcerpt }))
    }
  }, [formData.content, autoGenerateExcerpt])

  // Handle form field changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setError(null)
    setSuccess(null)

    // Disable auto-generation when user manually edits
    if (field === 'slug') {
      setAutoGenerateSlug(false)
    }
    if (field === 'excerpt') {
      setAutoGenerateExcerpt(false)
    }
  }

  // Handle tag input
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      handleChange('tags', [...formData.tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      const { url } = await response.json()
      handleChange('coverImage', url)
      setSuccess('Image uploaded successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Title is required'
    if (!formData.content.trim()) return 'Content is required'
    if (!formData.slug.trim()) return 'Slug is required'
    if (formData.slug.length < 3) return 'Slug must be at least 3 characters'
    if (formData.publishedAt && new Date(formData.publishedAt) < new Date()) {
      if (!formData.published) return 'Cannot schedule post in the past unless published'
    }
    return null
  }

  // Save post
  const handleSave = async (publishNow: boolean = false) => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Prepare data
      const saveData: CreateBlogPostRequest | UpdateBlogPostRequest = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        content: formData.content.trim(),
        coverImage: formData.coverImage.trim() || undefined,
        published: publishNow || formData.published,
        isFeatured: formData.isFeatured,
        publishedAt: formData.publishedAt || null,
        tags: formData.tags
      }

      let response: Response

      if (post) {
        // Update existing post
        response = await fetch(`/api/posts/${post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(saveData)
        })
      } else {
        // Create new post
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(saveData)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save post')
      }

      const { post: savedPost } = await response.json()
      
      setSuccess(publishNow ? 'Post published successfully!' : 'Post saved successfully!')
      setIsDirty(false)
      
      if (onSave) {
        onSave(true)
      }

      // Redirect to posts list after a short delay
      setTimeout(() => {
        router.push('/admin/dashboard/posts')
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
      if (onSave) {
        onSave(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Get current date for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-gray-700/50 rounded-xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="border-b border-gray-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FiEdit3 className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">
                {post ? 'Edit Post' : 'Create New Post'}
              </h2>
              <p className="text-sm text-gray-400">
                {post ? 'Update your existing blog post' : 'Write and publish your blog post'}
              </p>
            </div>
          </div>
          
          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-300"
          >
            {showPreview ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
            >
              <FiAlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2"
            >
              <FiCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter post title..."
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Slug *
                </label>
                <button
                  onClick={() => setAutoGenerateSlug(!autoGenerateSlug)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    autoGenerateSlug 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'bg-gray-700 text-gray-400 border border-gray-600'
                  }`}
                >
                  Auto-generate
                </button>
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="post-slug"
                disabled={autoGenerateSlug}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {formData.slug && (
                <p className="text-xs text-gray-500 mt-1">
                  URL: /blog/{formData.slug}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Excerpt
                </label>
                <button
                  onClick={() => setAutoGenerateExcerpt(!autoGenerateExcerpt)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    autoGenerateExcerpt 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'bg-gray-700 text-gray-400 border border-gray-600'
                  }`}
                >
                  Auto-generate
                </button>
              </div>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Brief description of the post..."
                disabled={autoGenerateExcerpt}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image
              </label>
              <div className="space-y-3">
                {formData.coverImage && (
                  <div className="relative">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleChange('coverImage', '')}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiUpload className="w-4 h-4" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags ({formData.tags.length}/10)
              </label>
              
              {/* Tag Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 10}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Tag List */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-blue-200 transition-colors"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Publishing Options */}
            <div className="space-y-4 p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300">Publishing Options</h3>
              
              {/* Published Status */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500/50"
                />
                <span className="text-sm text-gray-300">
                  Published {formData.published ? '(Live)' : '(Draft)'}
                </span>
              </label>

              {/* Featured Status */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="w-4 h-4 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500/50"
                />
                <span className="text-sm text-gray-300">
                  Featured Post {formData.isFeatured ? '⭐' : ''}
                </span>
              </label>
              {formData.isFeatured && (
                <p className="text-xs text-amber-400 ml-7">
                  This post will be displayed prominently without cover image
                </p>
              )}

              {/* Scheduled Publishing */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-2" />
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => handleChange('publishedAt', e.target.value)}
                  min={getCurrentDateTime()}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                {formData.publishedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(formData.publishedAt) > new Date() ? 'Scheduled for future' : 'Will be published immediately'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Content & Preview */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Content *
                </label>
                <span className="text-xs text-gray-500">
                  {formData.content.length} characters
                </span>
              </div>

              <div className="relative">
                {!showPreview ? (
                  // Markdown Editor
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Write your blog post content in Markdown..."
                    rows={20}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none font-mono text-sm"
                  />
                ) : (
                  // Preview
                  <div className="w-full h-[500px] p-4 bg-gray-800/30 border border-gray-600/50 rounded-lg overflow-y-auto">
                    <div className="prose prose-invert prose-blue max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formData.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-gray-700 rounded text-sm">$1</code>')
                            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mt-6 mb-3">$1</h3>')
                            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mt-6 mb-4">$1</h2>')
                            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-6 mb-4">$1</h1>')
                            .replace(/\n/g, '<br>')
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {isDirty && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                Unsaved changes
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={isLoading || !isDirty}
              className="flex items-center gap-2 px-6 py-3 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              Save Draft
            </button>
            
            <button
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiCheck className="w-4 h-4" />
              )}
              {post ? 'Update Post' : 'Publish Now'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PostEditor