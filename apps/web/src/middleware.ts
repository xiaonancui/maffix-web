import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const pathname = req.nextUrl.pathname
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')

    // Log for debugging redirect loops
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Middleware:', {
        pathname,
        isAuth,
        role: token?.role,
      })
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      console.log('✅ Authenticated user accessing auth page, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check admin access
    if (pathname.startsWith('/admin')) {
      if (!isAuth) {
        console.log('⚠️ Unauthenticated user accessing admin, redirecting to login')
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (token?.role !== 'ADMIN') {
        console.log('⚠️ Non-admin user accessing admin, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Allow access to auth pages without token
        if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
          return true
        }

        // Allow access to API routes (they handle their own auth)
        if (pathname.startsWith('/api/')) {
          return true
        }

        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/tasks/:path*',
    '/gacha/:path*',
    '/prizes/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
}

