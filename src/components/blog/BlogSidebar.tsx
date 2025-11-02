"use client"

import { useState } from "react"
import Link from "next/link"
import { FiSearch, FiUser, FiTrendingUp, FiTag, FiCalendar } from "react-icons/fi"

interface BlogSidebarProps {
  popularPosts?: Array<{
    id: string
    title: string
    slug: string
    publishedAt: string
    commentCount?: number
  }>
  tags?: Array<{
    name: string
    count: number
  }>
}

export default function BlogSidebar({ popularPosts = [], tags = [] }: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/blog?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!email.trim()) {
      setMessage("Lütfen e-posta adresinizi girin.")
      return
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      setMessage(data.message)
    } catch (error) {
      setMessage("Abonelik sırasında bir hata oluştu.")
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', { 
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <aside className="space-y-8">
      {/* Search Box */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiSearch className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Arama
        </h3>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yazı ara..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Popüler Yazılar
          </h3>
          <div className="space-y-4">
            {popularPosts.slice(0, 5).map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <FiCalendar className="w-3 h-3" />
                      <span>{formatDate(post.publishedAt)}</span>
                      {post.commentCount && post.commentCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{post.commentCount} yorum</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Etiketler
          </h3>
          <div className="space-y-2">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tag.name}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Yazar Hakkında
        </h3>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">AK</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Arslan Kemal Gündüz
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Full-Stack Developer olarak çalışıyor, modern web teknolojileri ve yazılım geliştirme 
            süreçleri hakkında deneyimlerini paylaşıyor.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          📧 Yeni Yazılardan Haberdar Ol
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Yeni yazılarımı ve güncellemeleri e-posta ile almak için abone ol.
        </p>
        <form onSubmit={handleSubscription} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresin"
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Abone Ol
          </button>
        </form>
        {message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{message}</p>}
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          İstediğin zaman abonelikten çıkabilirsin.
        </p>
      </div>
    </aside>
  )
}
