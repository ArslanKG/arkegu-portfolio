"use client"

import Link from "next/link"
import Image from "next/image"
import { FiCalendar, FiClock, FiArrowRight, FiMessageCircle } from "react-icons/fi"

interface BlogCardProps {
  title: string
  excerpt: string
  date: string
  readTime: string
  slug: string
  tags?: string[]
  coverImage?: string | null
  commentCount?: number
  isFeatured?: boolean
}

export default function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  slug,
  tags,
  coverImage,
  commentCount = 0,
  isFeatured = false
}: BlogCardProps) {
  // Format date to Turkish locale
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <Link href={`/blog/${slug}`} className="block">
      <article className="group border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-sm cursor-pointer bg-white dark:bg-gray-900">
        {/* Cover Image - Only show for non-featured posts */}
        {coverImage && !isFeatured && (
          <div className="aspect-video relative overflow-hidden w-full max-h-64 md:max-h-48">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              quality={75}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
            />
          </div>
        )}

        <div className="p-6">
          {/* Featured Badge */}
          {isFeatured && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                ⭐ Öne Çıkan
              </span>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Post Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Post Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-3">
            {excerpt}
          </p>

          {/* Post Meta and Read More */}
          <div className="flex items-center justify-between">
            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                <span>{formatDate(date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
              {commentCount > 0 && (
                <div className="flex items-center gap-1">
                  <FiMessageCircle className="w-4 h-4" />
                  <span>{commentCount}</span>
                </div>
              )}
            </div>

            {/* Read More Arrow */}
            <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}