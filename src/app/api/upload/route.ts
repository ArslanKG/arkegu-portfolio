import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { put } from '@vercel/blob'

// Types for the API response
interface UploadResponse {
  url: string
}

interface ApiError {
  error: string
  message: string
}

/**
 * POST /api/upload
 * Uploads image files to Vercel Blob storage for authenticated admin users
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse | ApiError>> {
  try {
    // Check authentication - admin only
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if Vercel Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured')
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Storage service not configured' },
        { status: 500 }
      )
    }

    // Parse FormData
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error('Error parsing FormData:', error)
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid FormData' },
        { status: 400 }
      )
    }

    // Get the file from FormData
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type - allowed MIME types
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Bad Request', 
          message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed' 
        },
        { status: 400 }
      )
    }

    // Validate file size - max 5MB
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Request Entity Too Large', message: 'File size exceeds 5MB limit' },
        { status: 413 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') // Sanitize filename
    const fileExtension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    
    // Validate file extension matches MIME type
    const mimeToExtension: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/jpg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/gif': ['gif'],
      'image/webp': ['webp']
    }
    
    const validExtensions = mimeToExtension[file.type] || []
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { 
          error: 'Bad Request', 
          message: 'File extension does not match file type' 
        },
        { status: 400 }
      )
    }

    const uniqueFilename = `${timestamp}-${randomString}-${originalName}`

    // Upload to Vercel Blob
    try {
      const blob = await put(uniqueFilename, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      })

      // Log successful upload for monitoring
      console.log(`File uploaded successfully: ${uniqueFilename}, URL: ${blob.url}`)

      return NextResponse.json({ url: blob.url }, { status: 200 })

    } catch (uploadError) {
      console.error('Vercel Blob upload error:', uploadError)
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'File upload failed' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Unexpected error in upload endpoint:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/upload
 * Returns information about the upload endpoint
 */
export async function GET(): Promise<NextResponse<{ message: string; allowedTypes: string[]; maxSize: string }>> {
  return NextResponse.json({
    message: 'Image upload endpoint',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: '5MB'
  })
}