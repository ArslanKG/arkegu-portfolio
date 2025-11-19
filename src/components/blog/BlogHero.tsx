"use client"

import Link from "next/link"
import Image from "next/image"
import { FiCalendar, FiClock, FiArrowRight, FiMessageCircle } from "react-icons/fi"

interface BlogHeroProps {
  featuredPost?: {
    id: string
    slug: string
    title: string
    excerpt: string
    coverImage?: string | null
    publishedAt: string
    readTime: number
    tags: string[]
    commentCount?: number
    isFeatured?: boolean
  }
}

export default function BlogHero({ featuredPost }: BlogHeroProps) {
  if (!featuredPost) return null

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <section className="relative mb-16">
      <Link href={`/blog/${featuredPost.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>
          
          <div className="relative">
            <div className={`flex flex-col ${featuredPost.coverImage && !featuredPost.isFeatured ? 'lg:flex-row' : ''}`}>
              {/* Content */}
              <div className="flex-1 p-8 lg:p-12">
                {/* Featured Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Öne Çıkan Yazı
                </div>

                {/* Tags */}
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-blue-100 transition-colors">
                  {featuredPost.title}
                </h1>

                {/* Excerpt */}
                <p className="text-lg text-blue-100 mb-6 leading-relaxed line-clamp-3 max-w-2xl">
                  {featuredPost.excerpt}
                </p>

                {/* Meta & CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      <span>{featuredPost.readTime} dakika okuma</span>
                    </div>
                    {featuredPost.commentCount && featuredPost.commentCount > 0 && (
                      <div className="flex items-center gap-1">
                        <FiMessageCircle className="w-4 h-4" />
                        <span>{featuredPost.commentCount} yorum</span>
                      </div>
                    )}
                  </div>

                  {/* Read More Button */}
                  <div className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-medium transition-all duration-200 group-hover:translate-x-1">
                    <span>Yazıyı Oku</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Cover Image - Only show for non-featured posts or when explicitly needed */}
              {featuredPost.coverImage && !featuredPost.isFeatured && (
                <div className="flex-shrink-0 lg:w-1/2">
                  <div className="relative h-64 lg:h-full min-h-[300px]">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={85}
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent lg:from-blue-600/40" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

    </section>
  )
}
