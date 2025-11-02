import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  generateSlug, 
  calculateReadTime, 
  normalizeTags, 
  validatePublishDate,
  generateExcerpt,
  validateSlugFormat
} from '@/lib/blog-utils'
import type { 
  CreateBlogPostRequest, 
  BlogPostsResponse, 
  BlogPostResponse, 
  ApiError 
} from '@/types/blog'

/**
 * GET /api/posts
 * Returns all blog posts with comment counts for authenticated admin
 */
export async function GET(request: NextRequest): Promise<NextResponse<BlogPostsResponse | ApiError>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch all posts with comment counts
    const posts = await prisma.blogPost.findMany({
      include: {
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Transform posts to include comment count
    const postsWithCount = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      published: post.published,
      isFeatured: post.isFeatured,
      publishedAt: post.publishedAt,
      tags: post.tags,
      readTime: post.readTime,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      commentCount: post._count.comments
    }))

    return NextResponse.json({ posts: postsWithCount })

  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/posts
 * Creates a new blog post for authenticated admin
 */
export async function POST(request: NextRequest): Promise<NextResponse<BlogPostResponse | ApiError>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    let body: CreateBlogPostRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    let slug = generateSlug(body.title.trim())
    if (!validateSlugFormat(slug)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid title format for slug generation' },
        { status: 400 }
      )
    }

    // Check slug uniqueness and modify if needed
    let uniqueSlug = slug
    let counter = 1
    while (true) {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: uniqueSlug }
      })
      if (!existingPost) break
      
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    // Process optional fields
    const excerpt = body.excerpt?.trim() || generateExcerpt(body.content.trim())
    const tags = normalizeTags(body.tags || [])
    const readTime = calculateReadTime(body.content.trim())
    
    // Validate and process publishedAt
    let publishedAt: Date | null = null
    if (body.publishedAt) {
      try {
        publishedAt = validatePublishDate(body.publishedAt)
      } catch (error) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid publishedAt date format' },
          { status: 400 }
        )
      }
    }

    // Set published status based on publishedAt
    let published = body.published ?? false
    if (publishedAt && publishedAt <= new Date()) {
      published = true // Auto-publish if publishedAt is in the past
    }

    // Create the blog post
    const newPost = await prisma.blogPost.create({
      data: {
        slug: uniqueSlug,
        title: body.title.trim(),
        excerpt,
        content: body.content.trim(),
        coverImage: body.coverImage?.trim() || null,
        published,
        isFeatured: body.isFeatured ?? false,
        publishedAt,
        tags,
        readTime
      }
    })

    return NextResponse.json({ post: newPost }, { status: 201 })

  } catch (error) {
    console.error('Error creating post:', error)
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Conflict', message: 'A post with this slug already exists' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create post' },
      { status: 500 }
    )
  }
}