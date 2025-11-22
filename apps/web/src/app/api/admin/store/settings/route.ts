import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock store settings (in production, this would be stored in database)
let storeSettings = {
  paymentMethods: {
    klarna: true,
    stripe: true,
    paypal: false,
  },
  klarnaApiKey: process.env.KLARNA_API_KEY || '',
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  shippingEnabled: true,
  freeShippingThreshold: 100,
  defaultShippingRate: 9.99,
  internationalShipping: true,
  internationalShippingRate: 29.99,
  taxEnabled: true,
  taxRate: 8.5,
  taxIncludedInPrice: false,
  currency: 'USD',
  currencySymbol: '$',
  orderPrefix: 'MFX',
  autoConfirmOrders: false,
  lowStockThreshold: 10,
  storeEnabled: true,
  maintenanceMode: false,
  maintenanceMessage: 'Store is currently under maintenance. Please check back later.',
}

// GET /api/admin/store/settings - Get store settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      settings: storeSettings,
    })
  } catch (error) {
    console.error('Error fetching store settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/store/settings - Update store settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.currency || !body.currencySymbol || !body.orderPrefix) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update settings (in production, save to database)
    storeSettings = {
      ...storeSettings,
      ...body,
    }

    return NextResponse.json({
      success: true,
      message: 'Store settings updated successfully',
      settings: storeSettings,
    })
  } catch (error) {
    console.error('Error updating store settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update store settings' },
      { status: 500 }
    )
  }
}

