// Database BlogPost type matching Prisma schema
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  coverImage: string | null
  published: boolean
  isFeatured: boolean
  publishedAt: Date | null
  tags: string[]
  readTime: number | null
  createdAt: Date
  updatedAt: Date
  comments?: Comment[]
}

// Comment type matching Prisma schema
export interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  approved: boolean
  createdAt: Date
}

// BlogPost with comment count for API responses
export interface BlogPostWithCount extends BlogPost {
  commentCount: number
}

// Create BlogPost request body
export interface CreateBlogPostRequest {
  title: string
  excerpt?: string
  content: string
  coverImage?: string
  published?: boolean
  isFeatured?: boolean
  publishedAt?: string | null // ISO string format for API
  tags?: string[]
}

// Update BlogPost request body
export interface UpdateBlogPostRequest {
  title?: string
  excerpt?: string
  content?: string
  coverImage?: string
  published?: boolean
  isFeatured?: boolean
  publishedAt?: string | null // ISO string format for API
  tags?: string[]
}

// API Response types
export interface BlogPostsResponse {
  posts: BlogPostWithCount[]
}

export interface BlogPostResponse {
  post: BlogPost
}

export interface ApiError {
  error: string
  message?: string
}

// Legacy types for backward compatibility
export interface BlogMetadata {
  totalPosts: number
  categories: string[]
  tags: string[]
}

// Blog card component için props interface
export interface BlogCardProps {
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

// Blog kategorisi için interface
export interface BlogCategory {
  name: string
  slug: string
  description: string
  postCount: number
}

// Blog tag için interface
export interface BlogTag {
  name: string
  slug: string
  postCount: number
}

// Utility type for frontend display
export interface BlogPostDisplay {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string | null
  published: boolean
  isFeatured: boolean
  publishedAt: string | null // ISO string format
  tags: string[]
  readTime: number
  createdAt: string // ISO string format
  updatedAt: string // ISO string format
  commentCount: number
}

// Type guards
export function isBlogPost(obj: any): obj is BlogPost {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.published === 'boolean' &&
    typeof obj.isFeatured === 'boolean' &&
    Array.isArray(obj.tags) &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  );
}

export function isCreateBlogPostRequest(obj: any): obj is CreateBlogPostRequest {
  return (
    obj &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string'
  );
}

// Comment-specific types for API operations
export interface CreateCommentRequest {
  postId: string
  author: string
  email: string
  content: string
}

export interface CommentResponse {
  comment: Comment
}

export interface CommentsResponse {
  comments: Comment[]
  count: number
}

export interface CommentActionResponse {
  success: boolean
  message: string
}

export interface CommentApiError {
  error: string
  message?: string
}

// Type guard for comment creation
export function isCreateCommentRequest(obj: any): obj is CreateCommentRequest {
  return (
    obj &&
    typeof obj.postId === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.content === 'string'
  );
}

// Type guard for comments
export function isComment(obj: any): obj is Comment {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.postId === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.approved === 'boolean' &&
    obj.createdAt instanceof Date
  );
}

// Display-friendly comment interface
export interface CommentDisplay {
  id: string
  postId: string
  author: string
  email: string
  content: string
  approved: boolean
  createdAt: string // ISO string format
}

// Transform Comment to CommentDisplay
export function toCommentDisplay(comment: Comment): CommentDisplay {
  return {
    id: comment.id,
    postId: comment.postId,
    author: comment.author,
    email: comment.email,
    content: comment.content,
    approved: comment.approved,
    createdAt: comment.createdAt.toISOString()
  };
}