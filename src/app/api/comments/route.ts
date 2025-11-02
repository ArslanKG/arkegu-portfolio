import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  validateCommentForm,
  sanitizeCommentContent,
  checkCommentRateLimit,
  getClientIP,
  checkSpamPatterns,
  getSecurityHeaders
} from '@/lib/security'
import type {
  CreateCommentRequest,
  CommentActionResponse,
  CommentApiError
} from '@/types/blog'
import { isCreateCommentRequest } from '@/types/blog'

// Type for comment with post relation
export interface CommentWithPost {
  id: string
  author: string
  email: string
  content: string
  approved: boolean
  createdAt: Date
  post: {
    id: string
    title: string
    slug: string
  }
}

export interface CommentsListResponse {
  comments: CommentWithPost[]
  stats: {
    total: number
    pending: number
    approved: number
  }
}

/**
 * POST /api/comments
 * Public endpoint for submitting blog comments
 * No authentication required, but includes rate limiting and validation
 */
export async function POST(request: NextRequest): Promise<NextResponse<CommentActionResponse | CommentApiError>> {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request)
    const rateLimitKey = `comment:${clientIP}`
    
    // Check rate limiting (3 comments per 5 minutes per IP)
    const rateLimit = checkCommentRateLimit(rateLimitKey)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate Limit Exceeded', message: 'Too many comments submitted. Please try again in a few minutes.' },
        { 
          status: 429,
          headers: {
            ...getSecurityHeaders(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
          }
        }
      )
    }

    // Parse and validate request body
    let body: CreateCommentRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON payload' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Type guard validation
    if (!isCreateCommentRequest(body)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Missing required fields: postId, author, email, content' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate form data
    const validation = validateCommentForm(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation Error', message: validation.errors.join(', ') },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Check if the blog post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: body.postId.trim() },
      select: { id: true, published: true }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Blog post not found' },
        { status: 404, headers: getSecurityHeaders() }
      )
    }

    if (!post.published) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Cannot comment on unpublished posts' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Sanitize input data
    const sanitizedAuthor = body.author.trim().substring(0, 50)
    const sanitizedEmail = body.email.trim().toLowerCase()
    const sanitizedContent = sanitizeCommentContent(body.content.trim())

    // Check for spam patterns
    if (checkSpamPatterns(sanitizedContent) || checkSpamPatterns(sanitizedAuthor)) {
      return NextResponse.json(
        { error: 'Content Rejected', message: 'Comment appears to be spam and was rejected' },
        { status: 422, headers: getSecurityHeaders() }
      )
    }

    // Create the comment (approved: false by default)
    const newComment = await prisma.comment.create({
      data: {
        postId: body.postId.trim(),
        author: sanitizedAuthor,
        email: sanitizedEmail,
        content: sanitizedContent,
        approved: false // Comments require manual approval
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Comment submitted successfully! It will be published after review.' 
      },
      { 
        status: 201,
        headers: {
          ...getSecurityHeaders(),
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
        }
      }
    )

  } catch (error) {
    console.error('Error creating comment:', error)
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid post ID' },
          { status: 400, headers: getSecurityHeaders() }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to submit comment' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}

/**
 * GET /api/comments
 * Admin-only endpoint for fetching all comments with post relations
 */
export async function GET(request: NextRequest): Promise<NextResponse<CommentsListResponse | CommentApiError>> {
  try {
    // Check authentication - admin only
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Parse URL parameters for pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const approved = searchParams.get('approved')
    const search = searchParams.get('search')

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {}
    
    if (approved !== null) {
      where.approved = approved === 'true'
    }
    
    if (search) {
      where.OR = [
        { author: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { post: { title: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Fetch comments with post relations
    const [comments, totalCount, pendingCount, approvedCount] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      // Get total count with same filters
      prisma.comment.count({ where }),
      // Get pending count
      prisma.comment.count({ where: { approved: false } }),
      // Get approved count
      prisma.comment.count({ where: { approved: true } })
    ])

    const response: CommentsListResponse = {
      comments: comments.map(comment => ({
        id: comment.id,
        author: comment.author,
        email: comment.email,
        content: comment.content,
        approved: comment.approved,
        createdAt: comment.createdAt,
        post: {
          id: comment.post.id,
          title: comment.post.title,
          slug: comment.post.slug
        }
      })),
      stats: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount
      }
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        ...getSecurityHeaders(),
        'X-Total-Count': totalCount.toString(),
        'X-Page': page.toString(),
        'X-Per-Page': limit.toString()
      }
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch comments' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}

/**
 * OPTIONS method for CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400' // 24 hours cache
    }
  })
}