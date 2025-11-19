import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/blog/BlogCard";
import BlogHero from "@/components/blog/BlogHero";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogPagination, { BlogPaginationInfo } from "@/components/blog/BlogPagination";

export const metadata: Metadata = {
  title: "Blog | Arslan Kemal Gündüz",
  description: "Yazılım geliştirme, teknoloji ve kişisel deneyimler hakkında yazılar. .NET, React, Next.js, Cloud ve FinTech konularında teknik içerikler.",
  keywords: ["blog", "yazılım geliştirme", "teknoloji", "programlama", "software development", "dotnet", "react", "nextjs", "cloud", "fintech"],
  openGraph: {
    title: "Blog | Arslan Kemal Gündüz",
    description: "Yazılım geliştirme, teknoloji ve kişisel deneyimler hakkında yazılar",
    url: "https://arkegu.com.tr/blog",
    type: "website",
    images: [
      {
        url: '/images/arkegu-logo.png',
        width: 1200,
        height: 630,
        alt: 'Arslan Kemal Gündüz Blog',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Arslan Kemal Gündüz",
    description: "Yazılım geliştirme, teknoloji ve kişisel deneyimler hakkında yazılar",
    images: ['/images/arkegu-logo.png'],
  },
  alternates: {
    canonical: '/blog',
  },
};

// Constants for pagination
const POSTS_PER_PAGE = 6;

// Database functions
async function getBlogPosts(page: number = 1, tag?: string, query?: string) {
  try {
    const skip = (page - 1) * POSTS_PER_PAGE;
    const take = page === 1 ? POSTS_PER_PAGE + 1 : POSTS_PER_PAGE;
    
    const where: any = {
      published: true,
      publishedAt: { lte: new Date() },
      ...(tag && { tags: { has: tag } }),
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      }),
    };

    const [posts, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        include: {
          _count: { select: { comments: true } }
        },
        skip,
        take: take
      }),
      prisma.blogPost.count({
        where
      })
    ]);

    return { posts, totalPosts };
  } catch (error) {
    console.error("Database error fetching blog posts:", error);
    return { posts: [], totalPosts: 0 };
  }
}

async function getFeaturedPost() {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        published: true,
        isFeatured: true,
        publishedAt: { lte: new Date() }
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        _count: { select: { comments: true } }
      }
    });

    if (!post) return null;

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      coverImage: post.coverImage,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      readTime: post.readTime || 5,
      tags: post.tags,
      commentCount: post._count.comments,
      isFeatured: post.isFeatured
    };
  } catch (error) {
    console.error("Error fetching featured post:", error);
    return null;
  }
}

async function getPopularPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { lte: new Date() }
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        _count: { select: { comments: true } }
      }
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      commentCount: post._count.comments
    }));
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
}

async function getBlogStats() {
  try {
    // Get unique tags with counts
    const allPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { lte: new Date() }
      },
      select: { tags: true }
    });

    const tagCounts: Record<string, number> = {};
    allPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { tags };
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    return { tags: [] };
  }
}

interface BlogPageProps {
  searchParams: { page?: string, tag?: string, q?: string }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const { tag, q: query } = searchParams;
  
  const [
    { posts, totalPosts },
    featuredPost,
    popularPosts,
    { tags }
  ] = await Promise.all([
    getBlogPosts(currentPage, tag, query),
    getFeaturedPost(),
    getPopularPosts(),
    getBlogStats()
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Exclude featured post from regular posts if it's on the first page
  const filteredPosts = currentPage === 1 && featuredPost 
    ? posts.filter(post => post.id !== featuredPost.id)
    : posts;

  const displayPosts = filteredPosts.slice(0, POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Ana Sayfa</span>
            </Link>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Blog</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Post (Hero) */}
        {featuredPost && (
          <div className="mb-16">
            <BlogHero featuredPost={featuredPost} />
          </div>
        )}

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {tag ? `Etiket: ${tag}` : query ? `Arama: "${query}"` : currentPage > 1 ? `Blog - Sayfa ${currentPage}` : 'Tüm Yazılar'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {tag || query ? `${totalPosts} sonuç bulundu` : 'Yazılım geliştirme serüvenimde öğrendiklerimi, karşılaştığım zorlukları ve teknoloji dünyasındaki gelişmeleri sizlerle paylaşıyorum.'}
              </p>
              {(tag || query) && (
                <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Filtreleri Temizle
                </Link>
              )}
            </div>

            {/* Pagination Info */}
            {displayPosts.length > 0 && totalPages > 1 && (
              <BlogPaginationInfo 
                currentPage={currentPage}
                totalPages={totalPages}
                totalPosts={totalPosts}
                postsPerPage={POSTS_PER_PAGE}
              />
            )}

            {/* Blog Posts Grid */}
            {displayPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {displayPosts.map((post) => (
                    <div key={post.id} className="h-full">
                      <BlogCard
                        title={post.title}
                        excerpt={post.excerpt || ""}
                        date={post.publishedAt?.toISOString() || post.createdAt.toISOString()}
                        readTime={post.readTime ? `${post.readTime} dakika okuma` : "5 dakika okuma"}
                        slug={post.slug}
                        tags={post.tags}
                        coverImage={post.coverImage}
                        commentCount={post._count?.comments ?? 0}
                        isFeatured={post.isFeatured || false}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <BlogPagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      baseUrl="/blog"
                    />
                  </div>
                )}
              </>
            ) : (
              // Empty State
              <div className="text-center py-20">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    Henüz yazı bulunmuyor
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    Yakında paylaşacağım yazılım geliştirme deneyimleri ve teknoloji yazılarım 
                    için takipte kalın.
                  </p>
                </div>
                
                {/* Coming Soon Badge */}
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Yeni yazılar yakında eklenecek...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <BlogSidebar 
                popularPosts={popularPosts}
                tags={tags}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Arslan Kemal Gündüz
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Full-Stack Developer & Technology Enthusiast
              </p>
            </div>
            <div className="flex justify-center gap-6 mb-8">
              <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/blog"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Blog
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} Arslan Kemal Gündüz. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
