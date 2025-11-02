import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateCommentId, getSecurityHeaders } from '@/lib/security'
import type { CommentActionResponse, CommentApiError } from '@/types/blog'

/**
 * DELETE /api/comments/[id]
 * Admin-only endpoint for deleting comments
 */
export async function DELETE(
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

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { 
        id: true, 
        author: true, 
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

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId }
    })

    console.log(`Comment deleted by admin ${session.user.username}:`, {
      commentId,
      author: existingComment.author,
      postTitle: existingComment.post.title,
      adminUser: session.user.username
    })

    return NextResponse.json(
      { 
        success: true, 
        message: `Comment by ${existingComment.author} has been deleted successfully` 
      },
      { status: 200, headers: getSecurityHeaders() }
    )

  } catch (error) {
    console.error('Error deleting comment:', error)
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Not Found', message: 'Comment not found or already deleted' },
          { status: 404, headers: getSecurityHeaders() }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to delete comment' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}