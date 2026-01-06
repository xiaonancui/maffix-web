import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const pathname = req.nextUrl.pathname

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Middleware:', {
        pathname,
        isAuth,
        role: token?.role,
      })
    }

    // Check admin access
    if (pathname.startsWith('/admin')) {
      if (!isAuth) {
        // Redirect to homepage (gate) for authentication
        return NextResponse.redirect(new URL('/', req.url))
      }
      if (token?.role !== 'ADMIN') {
        // Non-admin users go to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Protected routes - redirect unauthenticated users to homepage (gate)
    if (!isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

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
    '/aura-zone/:path*',
    '/missions/:path*',
    '/store/:path*',
    '/orders/:path*',
    '/purchases/:path*',
    '/transactions/:path*',
  ],
}
