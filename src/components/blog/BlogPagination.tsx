"use client"

import Link from "next/link"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
}

export default function BlogPagination({ 
  currentPage, 
  totalPages, 
  baseUrl = "/blog" 
}: BlogPaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl
    return `${baseUrl}?page=${page}`
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Calculate range
    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    // Add first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    // Add range
    rangeWithDots.push(...range)

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex justify-center">
      <nav className="flex items-center gap-1" aria-label="Pagination Navigation">
        {/* Previous Button */}
        <Link
          href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentPage > 1
              ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }
          `}
          tabIndex={currentPage > 1 ? 0 : -1}
          aria-disabled={currentPage <= 1}
        >
          <FiChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Önceki</span>
        </Link>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-500"
                  aria-hidden="true"
                >
                  ...
                </span>
              )
            }

            const pageNumber = page as number
            const isCurrentPage = pageNumber === currentPage

            return (
              <Link
                key={pageNumber}
                href={getPageUrl(pageNumber)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95
                  ${isCurrentPage
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                aria-label={`${isCurrentPage ? 'Geçerli sayfa, ' : ''}Sayfa ${pageNumber}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNumber}
              </Link>
            )
          })}
        </div>

        {/* Next Button */}
        <Link
          href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentPage < totalPages
              ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }
          `}
          tabIndex={currentPage < totalPages ? 0 : -1}
          aria-disabled={currentPage >= totalPages}
        >
          <span className="hidden sm:inline">Sonraki</span>
          <FiChevronRight className="w-4 h-4" />
        </Link>
      </nav>
    </div>
  )
}

// Helper component for pagination info
export function BlogPaginationInfo({ 
  currentPage, 
  totalPages, 
  totalPosts,
  postsPerPage 
}: {
  currentPage: number
  totalPages: number
  totalPosts: number
  postsPerPage: number
}) {
  const startPost = (currentPage - 1) * postsPerPage + 1
  const endPost = Math.min(currentPage * postsPerPage, totalPosts)

  return (
    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
      <p>
        <span className="font-medium text-gray-900 dark:text-white">
          {startPost}-{endPost}
        </span>
        {' '}arası gösteriliyor, toplam{' '}
        <span className="font-medium text-gray-900 dark:text-white">
          {totalPosts}
        </span>
        {' '}yazı
      </p>
    </div>
  )
}