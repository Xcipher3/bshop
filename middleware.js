// middleware.js
import { NextResponse } from 'next/server'

// Define which routes require authentication
const protectedRoutes = ['/admin', '/checkout', '/orders']
const authRoutes = ['/login', '/register']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token') // Adjust based on your auth implementation
  
  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  // If accessing auth routes while logged in, redirect to home
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/login',
    '/register'
  ]
}