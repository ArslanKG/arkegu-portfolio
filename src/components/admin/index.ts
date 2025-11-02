// Admin Helper Components
export { default as DeletePostButton } from './DeletePostButton'
export { default as ApproveCommentButton } from './ApproveCommentButton'
export { default as DeleteCommentButton } from './DeleteCommentButton'
export { default as PostEditor } from './PostEditor'

// Re-export component types for convenience
export type DeletePostButtonProps = {
  postId: string
  postTitle: string
  onDelete?: () => void
}

export type ApproveCommentButtonProps = {
  commentId: string
  onApprove?: () => void
}

export type DeleteCommentButtonProps = {
  commentId: string
  onDelete?: () => void
}