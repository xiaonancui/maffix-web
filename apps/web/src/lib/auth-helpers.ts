/**
 * Authorization Helper Functions for API Routes
 * 
 * This module provides reusable authorization helpers for protecting API routes
 * with consistent error handling and logging.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Session } from 'next-auth'

// Role types
export type Role = 'USER' | 'ADMIN' | 'ARTIST'

/**
 * Authorization error response
 */
export interface AuthError {
  error: string
  code?: string
  details?: string
}

/**
 * Authorization result
 */
export interface AuthResult {
  authorized: boolean
  session: Session | null
  error?: NextResponse<AuthError>
}

/**
 * Require authentication for API route
 * Returns session if authenticated, or error response if not
 * 
 * @returns Promise<{ session: Session } | NextResponse>
 * 
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const auth = await requireAuth()
 *   if (auth instanceof NextResponse) return auth
 *   
 *   const { session } = auth
 *   // Use session.user.id, session.user.role, etc.
 * }
 * ```
 */
export async function requireAuth(): Promise<
  { session: Session } | NextResponse<AuthError>
> {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.warn('⚠️ Unauthorized API access attempt - no session')
    return NextResponse.json(
      {
        error: 'Unauthorized',
        code: 'NO_SESSION',
        details: 'Authentication required',
      },
      { status: 401 }
    )
  }

  return { session }
}

/**
 * Require admin role for API route
 * Returns session if user is admin, or error response if not
 * 
 * @returns Promise<{ session: Session } | NextResponse>
 * 
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   const auth = await requireAdmin()
 *   if (auth instanceof NextResponse) return auth
 *   
 *   const { session } = auth
 *   // User is confirmed to be an admin
 * }
 * ```
 */
export async function requireAdmin(): Promise<
  { session: Session } | NextResponse<AuthError>
> {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.warn('⚠️ Unauthorized admin API access attempt - no session')
    return NextResponse.json(
      {
        error: 'Unauthorized',
        code: 'NO_SESSION',
        details: 'Authentication required',
      },
      { status: 401 }
    )
  }

  if (session.user.role !== 'ADMIN') {
    console.warn(
      `⚠️ Forbidden admin API access attempt - user ${session.user.email} (role: ${session.user.role})`
    )
    return NextResponse.json(
      {
        error: 'Forbidden',
        code: 'INSUFFICIENT_PERMISSIONS',
        details: 'Admin access required',
      },
      { status: 403 }
    )
  }

  return { session }
}

/**
 * Require specific role(s) for API route
 * Returns session if user has one of the required roles, or error response if not
 * 
 * @param allowedRoles - Array of allowed roles
 * @returns Promise<{ session: Session } | NextResponse>
 * 
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const auth = await requireRole(['ADMIN', 'ARTIST'])
 *   if (auth instanceof NextResponse) return auth
 *   
 *   const { session } = auth
 *   // User is either ADMIN or ARTIST
 * }
 * ```
 */
export async function requireRole(
  allowedRoles: Role[]
): Promise<{ session: Session } | NextResponse<AuthError>> {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.warn('⚠️ Unauthorized API access attempt - no session')
    return NextResponse.json(
      {
        error: 'Unauthorized',
        code: 'NO_SESSION',
        details: 'Authentication required',
      },
      { status: 401 }
    )
  }

  const userRole = session.user.role as Role

  if (!allowedRoles.includes(userRole)) {
    console.warn(
      `⚠️ Forbidden API access attempt - user ${session.user.email} (role: ${userRole}) attempted to access route requiring roles: ${allowedRoles.join(', ')}`
    )
    return NextResponse.json(
      {
        error: 'Forbidden',
        code: 'INSUFFICIENT_PERMISSIONS',
        details: `Access requires one of the following roles: ${allowedRoles.join(', ')}`,
      },
      { status: 403 }
    )
  }

  return { session }
}

