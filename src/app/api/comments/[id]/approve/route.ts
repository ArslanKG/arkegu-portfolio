import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateCommentId, getSecurityHeaders } from '@/lib/security'
import type { CommentActionResponse, CommentApiError } from '@/types/blog'

/**
 * POST /api/comments/[id]/approve
 * Admin-only endpoint for approving comments
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<CommentActionResponse | CommentApiError>> {
  try {
    // Check authentication - admin only
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Validate comment ID format
    const commentId = params.id
    if (!validateCommentId(commentId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid comment ID format' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Check if comment exists and get current status
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { 
        id: true, 
        author: true, 
        approved: true,
        postId: true,
        post: {
          select: { title: true }
        }
      }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Comment not found' },
        { status: 404, headers: getSecurityHeaders() }
      )
    }

    // Check if comment is already approved
    if (existingComment.approved) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Comment is already approved' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Update comment to approved status
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { approved: true },
      select: { 
        id: true, 
        author: true, 
        approved: true,
        createdAt: true,
        post: {
          select: { title: true }
        }
      }
    })

    console.log(`Comment approved by admin ${session.user.username}:`, {
      commentId,
      author: updatedComment.author,
      postTitle: updatedComment.post.title,
      adminUser: session.user.username,
      approvedAt: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: true, 
        message: `Comment by ${updatedComment.author} has been approved successfully` 
      },
      { status: 200, headers: getSecurityHeaders() }
    )

  } catch (error) {
    console.error('Error approving comment:', error)
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Not Found', message: 'Comment not found' },
          { status: 404, headers: getSecurityHeaders() }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to approve comment' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}