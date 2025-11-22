import { NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'

/**
 * Standard API error response format
 */
export interface ApiError {
  error: string
  code?: string
  details?: any
  message?: string
}

/**
 * Standard API success response format
 */
export interface ApiSuccess<T = any> {
  success: true
  data?: T
  message?: string
  [key: string]: any
}

/**
 * HTTP Status Codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

/**
 * Create a standardized error response
 */
export function errorResponse(
  error: string,
  status: number = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: any
): NextResponse<ApiError> {
  const response: ApiError = {
    error,
    details,
  }

  // Log errors for debugging (except 4xx client errors)
  if (status >= 500) {
    console.error(`❌ API Error (${status}):`, error, details)
  }

  return NextResponse.json(response, { status })
}

/**
 * Create a standardized success response
 */
export function successResponse<T = any>(
  data?: T,
  status: number = HttpStatus.OK,
  message?: string
): NextResponse<ApiSuccess<T>> {
  const response: ApiSuccess<T> = {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
  }

  return NextResponse.json(response, { status })
}

/**
 * Validate request body with Zod schema
 * Returns parsed data or error response
 */
export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ data: T } | NextResponse<ApiError>> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return errorResponse(
        'Validation failed',
        HttpStatus.BAD_REQUEST,
        result.error.errors
      )
    }

    return { data: result.data }
  } catch (error) {
    return errorResponse(
      'Invalid JSON in request body',
      HttpStatus.BAD_REQUEST
    )
  }
}

/**
 * Handle database errors with appropriate responses
 */
export function handleDatabaseError(error: any): NextResponse<ApiError> {
  console.error('Database error:', error)

  // Prisma unique constraint violation
  if (error.code === 'P2002') {
    return errorResponse(
      'Resource already exists',
      HttpStatus.CONFLICT,
      { field: error.meta?.target }
    )
  }

  // Prisma record not found
  if (error.code === 'P2025') {
    return errorResponse(
      'Resource not found',
      HttpStatus.NOT_FOUND
    )
  }

  // Prisma foreign key constraint violation
  if (error.code === 'P2003') {
    return errorResponse(
      'Invalid reference',
      HttpStatus.BAD_REQUEST,
      { field: error.meta?.field_name }
    )
  }

  // Generic database error
  return errorResponse(
    'Database operation failed',
    HttpStatus.INTERNAL_SERVER_ERROR,
    process.env.NODE_ENV === 'development' ? error.message : undefined
  )
}

/**
 * Log admin action for security audit
 */
export function logAdminAction(
  action: string,
  userId: string,
  userEmail: string | null | undefined,
  details?: any
) {
  console.log(
    `🛡️ ADMIN ACTION: ${action} | User: ${userEmail || 'Unknown'} (${userId})`,
    details ? `| Details: ${JSON.stringify(details)}` : ''
  )
}

/**
 * Check if we're in build time (for Next.js static generation)
 * Returns error response if in build time
 */
export function checkBuildTime(): NextResponse<ApiError> | null {
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    return errorResponse(
      'Service temporarily unavailable',
      HttpStatus.SERVICE_UNAVAILABLE
    )
  }
  return null
}

