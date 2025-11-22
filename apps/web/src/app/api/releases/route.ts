import { NextResponse } from 'next/server'

/**
 * GET /api/releases
 * Public endpoint to list active releases
 */
export async function GET(request: Request) {
  try {
    // Check if we're in build time - return early if so
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const artist = searchParams.get('artist')
    const genre = searchParams.get('genre')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Build where clause - only show active releases
    const where: any = { isActive: true }
    if (artist) {
      where.artist = { contains: artist, mode: 'insensitive' }
    }
    if (genre) {
      where.genre = genre
    }
    if (featured !== null && featured !== undefined) {
      where.featured = featured === 'true'
    }

    // Get total count
    const total = await db.release.count({ where })

    // Get paginated releases
    const releases = await db.release.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { releaseDate: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      releases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching releases:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch releases',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

