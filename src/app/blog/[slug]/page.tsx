import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiClock, FiTag, FiShare2, FiTwitter, FiLinkedin, FiFacebook, FiLink, FiGithub, FiMail } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { prisma } from "@/lib/prisma";
import { BlogPost, Comment } from "@/types/blog";
import CommentForm from "@/components/blog/CommentForm";
import CommentList from "@/components/blog/CommentList";
import SocialShare from "@/components/blog/SocialShare";
import StructuredData from "@/components/StructuredData";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

// Database function to fetch post with approved comments
async function getBlogPost(slug: string): Promise<(BlogPost & { comments: Comment[] }) | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { 
        slug,
        published: true,
        publishedAt: { lte: new Date() }
      },
      include: {
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    return post;
  } catch (error) {
    console.error("Database error fetching blog post:", error);
    return null;
  }
}

// Generate static params for all published posts
export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { 
        published: true,
        publishedAt: { lte: new Date() }
      },
      select: { slug: true }
    });
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: "Yazı Bulunamadı | Arslan Kemal Gündüz",
      description: "Aradığınız blog yazısı bulunamadı.",
    };
  }

  const publishedDate = post.publishedAt?.toISOString().split('T')[0];
  
  return {
    title: `${post.title} | Arslan Kemal Gündüz`,
    description: post.excerpt || `${post.title} - Arslan Kemal Gündüz'ün blog yazısı`,
    keywords: [...post.tags, "blog", "yazılım geliştirme", "teknoloji"].join(", "),
    authors: [{ name: "Arslan Kemal Gündüz" }],
    openGraph: {
      title: post.title,
      description: post.excerpt || `${post.title} - Arslan Kemal Gündüz'ün blog yazısı`,
      url: `https://arkegu.com.tr/blog/${post.slug}`,
      type: "article",
      publishedTime: publishedDate,
      modifiedTime: post.updatedAt.toISOString().split('T')[0],
      authors: ["Arslan Kemal Gündüz"],
      tags: post.tags,
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: '/images/arkegu-logo.png',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `${post.title} - Arslan Kemal Gündüz'ün blog yazısı`,
      images: post.coverImage ? [post.coverImage] : ['/images/arkegu-logo.png'],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}


// Author Bio Component
const AuthorBio = () => (
  <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center text-white text-2xl font-bold">
          AK
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Arslan Kemal Gündüz
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Full-stack geliştirici ve teknoloji tutkunu. Modern web teknolojileri, 
          yazılım mimarisi ve kullanıcı deneyimi üzerine yazıyor.
        </p>
        <div className="flex gap-4">
          <Link 
            href="https://github.com/arslankg" 
            target="_blank"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <FiGithub className="w-6 h-6" />
          </Link>
          <Link 
            href="https://linkedin.com/in/arslankg" 
            target="_blank"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <FiLinkedin className="w-6 h-6" />
          </Link>
          <Link 
            href="mailto:contact@arslankg.dev"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <FiMail className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // Format date to Turkish locale
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const publishedDate = post.publishedAt || post.createdAt;
  const readTimeText = post.readTime ? `${post.readTime} dakika okuma` : "5 dakika okuma";
  const currentUrl = `https://arkegu.com.tr/blog/${post.slug}`;

  return (
    <>
      <StructuredData 
        type="article" 
        data={{
          headline: post.title,
          description: post.excerpt || post.title,
          image: post.coverImage || 'https://arkegu.com.tr/images/arkegu-logo.png',
          datePublished: publishedDate.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: 'Arslan Kemal Gündüz',
          url: currentUrl,
        }} 
      />
      <div className="min-h-screen bg-gray-50 dark:bg-background-dark transition-colors duration-300">
      {/* Hero Section with Background */}
      <div className="relative h-96 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYgR5xqcOlc32P5mVmT0zVG5twUgEKlU3WdJTWOtS40Yij-2hQn-v6nZsg_1L3-nCUhtf0s6z6hzn8yTUyY-4MkxawoVP-Ol9UT3wqfcHI0KZvQIBEtFd1zS7ZJP-BRIOeJ_wS8OL0XNNQMeRgPiFQhOO6C92DIeSpggp668IyD8y2UlSPTcjn7loW4f73jNlCavl7I6sIHVVFbJveklHwq3UeNz7ewrB_4eu6FXejfyR6JqR6NI9oSmeQhLRzDAOCLKbXrEHYEZUa")' }}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Navigation */}
        <nav className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <Link 
                href="/blog"
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group backdrop-blur-sm bg-white/10 rounded-lg px-3 py-2"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Blog</span>
              </Link>
              <div className="w-px h-6 bg-white/30" />
              <Link 
                href="/"
                className="text-sm font-medium text-white/90 hover:text-white transition-colors backdrop-blur-sm bg-white/10 rounded-lg px-3 py-2"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content - Intentionally left blank as content is moved to the card below */}
      </div>

      {/* Floating Content Card */}
      <div className="relative -mt-32 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[rgb(17,22,33,0.8)] backdrop-blur-md rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-700/50 p-6 sm:p-8 mb-8">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter text-gray-900 dark:text-gray-100">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>{formatDate(publishedDate)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  <span>{readTimeText}</span>
                </div>
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {post.tags.map((tag) => (
                  <a key={tag} href="#" className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-500/10 hover:bg-primary-500/20 rounded-full">
                    {tag}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white dark:bg-background-dark rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 lg:p-12">
              {post.excerpt && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-l-4 border-blue-500">
                  <p className="text-lg text-gray-700 dark:text-gray-300 font-medium italic leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              )}
              <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700/50">
                <SocialShare post={post} url={currentUrl} />
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    img: ({ node, ...props }) => {
                      if (!props.src) return null
                      return (
                        <Image
                          {...props}
                          src={props.src}
                          width={700}
                          height={400}
                          className="rounded-lg"
                          alt={props.alt || ''}
                        />
                      )
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
              <AuthorBio />
            </div>
            <section className="px-8 lg:px-12 pb-8 lg:pb-12">
              <div className="pt-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Yorumlar ({post.comments.length})
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Görüşlerinizi paylaşın ve tartışmaya katılın.
                  </p>
                </div>
                <div className="mb-8">
                  <CommentForm postId={post.id} />
                </div>
                <CommentList comments={post.comments} />
              </div>
            </section>
          </article>
        </div>
      </div>

      {/* Back to Blog Section */}
      <section className="max-w-4xl mx-auto px-6 mt-12 mb-16">
        <div className="text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 dark:text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-800"
          >
            <FiArrowLeft className="w-5 h-5" />
            Tüm Yazılara Dön
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-6">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/blog"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
              >
                Blog
              </Link>
              <Link 
                href="/#contact"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
              >
                İletişim
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} Arslan Kemal Gündüz. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
