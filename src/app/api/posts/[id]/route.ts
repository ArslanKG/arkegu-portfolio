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
  UpdateBlogPostRequest, 
  BlogPostResponse, 
  ApiError 
} from '@/types/blog'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/posts/[id]
 * Returns a specific blog post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<BlogPostResponse | ApiError>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Valid post ID is required' },
        { status: 400 }
      )
    }

    // Find the post by ID
    const post = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })

  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/posts/[id]
 * Updates an existing blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<BlogPostResponse | ApiError>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Valid post ID is required' },
        { status: 400 }
      )
    }

    // Parse request body
    let body: UpdateBlogPostRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Post not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    // Handle title and slug updates
    if (body.title?.trim()) {
      const newTitle = body.title.trim()
      updateData.title = newTitle

      // Generate new slug if title changed
      if (newTitle !== existingPost.title) {
        let newSlug = generateSlug(newTitle)
        
        if (!validateSlugFormat(newSlug)) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Invalid title format for slug generation' },
            { status: 400 }
          )
        }

        // Check slug uniqueness (excluding current post)
        let uniqueSlug = newSlug
        let counter = 1
        while (true) {
          const conflictingPost = await prisma.blogPost.findUnique({
            where: { slug: uniqueSlug }
          })
          if (!conflictingPost || conflictingPost.id === id) break
          
          uniqueSlug = `${newSlug}-${counter}`
          counter++
        }

        updateData.slug = uniqueSlug
      }
    }

    // Handle content updates
    if (body.content?.trim()) {
      const newContent = body.content.trim()
      updateData.content = newContent
      updateData.readTime = calculateReadTime(newContent)

      // Update excerpt if content changed and no explicit excerpt provided
      if (!body.excerpt && newContent !== existingPost.content) {
        updateData.excerpt = generateExcerpt(newContent)
      }
    }

    // Handle explicit excerpt update
    if (body.excerpt !== undefined) {
      updateData.excerpt = body.excerpt?.trim() || null
    }

    // Handle cover image update
    if (body.coverImage !== undefined) {
      updateData.coverImage = body.coverImage?.trim() || null
    }

    // Handle tags update
    if (body.tags !== undefined) {
      updateData.tags = normalizeTags(body.tags)
    }

    // Handle published status update
    if (body.published !== undefined) {
      updateData.published = body.published
    }

    // Handle featured status update
    if (body.isFeatured !== undefined) {
      updateData.isFeatured = body.isFeatured
    }

    // Handle publishedAt update
    if (body.publishedAt !== undefined) {
      try {
        updateData.publishedAt = validatePublishDate(body.publishedAt)
        
        // Auto-publish if publishedAt is set to past date and not explicitly unpublished
        if (updateData.publishedAt && 
            updateData.publishedAt <= new Date() && 
            body.published !== false) {
          updateData.published = true
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid publishedAt date format' },
          { status: 400 }
        )
      }
    }

    // Ensure we have something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'No valid fields provided for update' },
        { status: 400 }
      )
    }

    // Perform the update
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ post: updatedPost })

  } catch (error) {
    console.error('Error updating post:', error)
    
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
      { error: 'Internal Server Error', message: 'Failed to update post' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/[id]
 * Deletes a blog post and cascades to comments
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ message: string } | ApiError>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Valid post ID is required' },
        { status: 400 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Post not found' },
        { status: 404 }
      )
    }

    // Delete the post (comments will be deleted due to CASCADE constraint)
    await prisma.blogPost.delete({
      where: { id }
    })

    const commentCount = existingPost._count.comments
    const message = commentCount > 0 
      ? `Post "${existingPost.title}" and ${commentCount} associated comment${commentCount > 1 ? 's' : ''} deleted successfully`
      : `Post "${existingPost.title}" deleted successfully`

    return NextResponse.json({ message })

  } catch (error) {
    console.error('Error deleting post:', error)
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Not Found', message: 'Post not found or already deleted' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to delete post' },
      { status: 500 }
    )
  }
}