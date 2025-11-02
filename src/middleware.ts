import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth?: any }) => {
  const { pathname } = req.nextUrl
  
  // Check if the user is trying to access admin dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    // If not authenticated, redirect to login
    if (!req.auth) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // If authenticated, allow access
    return NextResponse.next()
  }
  
  // For non-protected routes, allow access
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Protect admin dashboard routes
    "/admin/dashboard/:path*"
  ]
}