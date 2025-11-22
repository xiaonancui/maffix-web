# Admin API Standards & Best Practices

## Overview

This document defines the standards for all admin API endpoints in the Maffix platform.

## Authorization

### Required Pattern

All admin API endpoints **MUST** use the `requireAdmin()` helper:

```typescript
import { requireAdmin } from '@/lib/auth-helpers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // REQUIRED: Check admin authentication first
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  
  const { session } = auth
  // session.user.id, session.user.email, session.user.role available
  
  // Your logic here...
}
```

### Security Logging

Log all admin actions for security audit:

```typescript
import { logAdminAction } from '@/lib/api-helpers'

logAdminAction(
  'CREATE_MISSION',
  session.user.id,
  session.user.email,
  { missionId: mission.id, title: mission.title }
)
```

## Request Validation

### Use Zod Schemas

All request bodies **MUST** be validated with Zod:

```typescript
import { z } from 'zod'
import { validateRequest } from '@/lib/api-helpers'

const createSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  isActive: z.boolean().optional(),
})

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  
  // Validate request body
  const validation = await validateRequest(request, createSchema)
  if (validation instanceof NextResponse) return validation
  
  const { data } = validation
  // data is now type-safe and validated
}
```

## Error Handling

### Standard Error Format

Use the `errorResponse()` helper for consistent error responses:

```typescript
import { errorResponse, HttpStatus } from '@/lib/api-helpers'

// Not found
return errorResponse('Mission not found', HttpStatus.NOT_FOUND)

// Validation error
return errorResponse('Validation failed', HttpStatus.BAD_REQUEST, zodError.errors)

// Server error
return errorResponse('Failed to create mission', HttpStatus.INTERNAL_SERVER_ERROR)
```

### Database Errors

Use `handleDatabaseError()` for Prisma errors:

```typescript
import { handleDatabaseError } from '@/lib/api-helpers'

try {
  const mission = await db.task.create({ data })
} catch (error) {
  return handleDatabaseError(error)
}
```

## Success Responses

### Standard Success Format

Use the `successResponse()` helper:

```typescript
import { successResponse, HttpStatus } from '@/lib/api-helpers'

// GET request
return successResponse({ mission }, HttpStatus.OK)

// POST request (created)
return successResponse({ mission }, HttpStatus.CREATED, 'Mission created successfully')

// DELETE request (no content)
return successResponse(undefined, HttpStatus.NO_CONTENT)
```

### Legacy Format (Acceptable)

The existing format is also acceptable:

```typescript
return NextResponse.json({
  success: true,
  mission,
})
```

## HTTP Status Codes

Use appropriate status codes:

- `200 OK` - Successful GET, PATCH
- `201 CREATED` - Successful POST (resource created)
- `204 NO_CONTENT` - Successful DELETE
- `400 BAD_REQUEST` - Validation error, malformed request
- `401 UNAUTHORIZED` - Not authenticated
- `403 FORBIDDEN` - Not authorized (not admin)
- `404 NOT_FOUND` - Resource not found
- `409 CONFLICT` - Duplicate resource
- `422 UNPROCESSABLE_ENTITY` - Business logic error
- `500 INTERNAL_SERVER_ERROR` - Server error
- `503 SERVICE_UNAVAILABLE` - Build time, maintenance

## Build Time Check

For routes that access the database, check for build time:

```typescript
import { checkBuildTime } from '@/lib/api-helpers'

export async function GET(request: Request) {
  const buildCheck = checkBuildTime()
  if (buildCheck) return buildCheck
  
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  
  // Your logic here...
}
```

## Complete Example

```typescript
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { 
  validateRequest, 
  successResponse, 
  errorResponse, 
  handleDatabaseError,
  logAdminAction,
  HttpStatus 
} from '@/lib/api-helpers'
import { z } from 'zod'

const createMissionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  points: z.number().int().min(0),
  isActive: z.boolean().optional(),
})

export async function POST(request: Request) {
  try {
    // 1. Check admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth
    
    // 2. Validate request body
    const validation = await validateRequest(request, createMissionSchema)
    if (validation instanceof NextResponse) return validation
    
    const { data } = validation
    
    // 3. Database operation
    const { db } = await import('@/lib/db')
    const mission = await db.task.create({ data })
    
    // 4. Log admin action
    logAdminAction('CREATE_MISSION', auth.session.user.id, auth.session.user.email, {
      missionId: mission.id,
      title: mission.title,
    })
    
    // 5. Return success response
    return successResponse({ mission }, HttpStatus.CREATED)
    
  } catch (error) {
    return handleDatabaseError(error)
  }
}
```

## Checklist for Each Endpoint

- ✅ Uses `requireAdmin()` at the start
- ✅ Validates input with Zod schema
- ✅ Returns consistent error format
- ✅ Uses appropriate HTTP status codes
- ✅ Logs admin actions (create, update, delete)
- ✅ Handles database errors gracefully
- ✅ Returns success response with data
- ✅ Has try-catch for error handling
- ✅ Uses TypeScript types
- ✅ Includes JSDoc comments

