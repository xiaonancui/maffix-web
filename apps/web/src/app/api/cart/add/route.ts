import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for adding to cart
const addToCartSchema = z.object({
  merchandiseId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).max(99).default(1),
  size: z.string().optional(),
  color: z.string().optional(),
})

/**
 * POST /api/cart/add
 * Add item to shopping cart
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = addToCartSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { merchandiseId, variantId, quantity, size, color } = validationResult.data
    const normalizedVariantId = variantId ?? null

    // Check if test account
    const allowTestAccounts =
      process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

    const isTestAccount =
      allowTestAccounts &&
      (session.user.id?.includes('test-') ||
        session.user.id?.includes('demo-') ||
        session.user.id?.includes('admin-'))

    // For test accounts, return mock success response
    if (isTestAccount) {
      return NextResponse.json({
        success: true,
        message: 'Item added to cart (test mode)',
        cartItem: {
          id: `cart-item-${Date.now()}`,
          merchandiseId,
          variantId: normalizedVariantId,
          quantity,
          size,
          color,
        },
      })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if merchandise exists and is in stock
    const merchandise = await db.merchandise.findUnique({
      where: { id: merchandiseId },
      include: {
        variants: normalizedVariantId ? {
          where: { id: normalizedVariantId },
        } : undefined,
      },
    })

    if (!merchandise) {
      return NextResponse.json(
        { error: 'Merchandise not found' },
        { status: 404 }
      )
    }

    if (!merchandise.inStock) {
      return NextResponse.json(
        { error: 'Merchandise is out of stock' },
        { status: 400 }
      )
    }

    // If variant is specified, check if it exists and is in stock
    if (variantId) {
      const variant = merchandise.variants?.find((v) => v.id === normalizedVariantId)
      if (!variant) {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        )
      }
      if (!variant.inStock || variant.stockQuantity < quantity) {
        return NextResponse.json(
          { error: 'Variant is out of stock or insufficient quantity' },
          { status: 400 }
        )
      }
    }

    // Get or create cart
    let cart = await db.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    // Normalize size and color (null if not provided)
    const normalizedSize = size ?? null
    const normalizedColor = color ?? null

    // Check if item already exists in cart (matching variant, size, and color)
    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        merchandiseId,
        variantId: normalizedVariantId,
        size: normalizedSize,
        color: normalizedColor,
      },
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          merchandise: true,
          variant: true,
        },
      })
    } else {
      // Create new cart item with size and color
      cartItem = await db.cartItem.create({
        data: {
          cartId: cart.id,
          merchandiseId,
          quantity,
          size: normalizedSize,
          color: normalizedColor,
          ...(normalizedVariantId ? { variantId: normalizedVariantId } : {}),
        },
        include: {
          merchandise: true,
          variant: true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cartItem,
    })
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      {
        error: 'Failed to add to cart',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
