import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Featured product settings (in production, this would be stored in database)
let featuredProduct = {
  enabled: true,
  imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  name: 'Limited Edition Tour T-Shirt',
  description: 'Exclusive design. Limited quantities. Don\'t miss out.',
  price: 29.99,
  currency: 'GBP',
  badge: 'New Arrival',
  badgeSecondary: 'Limited',
  linkUrl: '/store',
  ctaText: 'Shop Now',
}

// GET /api/admin/store/featured-product - Get featured product settings
export async function GET(request: NextRequest) {
  try {
    // For public access (PromoCard), don't require auth
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === 'ADMIN'

    return NextResponse.json({
      success: true,
      featuredProduct,
      isAdmin,
    })
  } catch (error) {
    console.error('Error fetching featured product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured product' },
      { status: 500 }
    )
  }
}

// POST /api/admin/store/featured-product - Update featured product settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Name and image URL are required' },
        { status: 400 }
      )
    }

    // Update settings (in production, save to database)
    featuredProduct = {
      enabled: body.enabled ?? true,
      imageUrl: body.imageUrl,
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price) || 0,
      currency: body.currency || 'GBP',
      badge: body.badge || '',
      badgeSecondary: body.badgeSecondary || '',
      linkUrl: body.linkUrl || '/store',
      ctaText: body.ctaText || 'Shop Now',
    }

    return NextResponse.json({
      success: true,
      message: 'Featured product updated successfully',
      featuredProduct,
    })
  } catch (error) {
    console.error('Error updating featured product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update featured product' },
      { status: 500 }
    )
  }
}
