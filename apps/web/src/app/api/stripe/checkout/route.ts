import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, poundsToPence } from '@/lib/stripe'
import { z } from 'zod'

// Validation schema
const checkoutSchema = z.object({
  orderId: z.string().uuid(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

/**
 * POST /api/stripe/checkout
 * Create a Stripe Checkout session for merchandise order
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = checkoutSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { orderId, successUrl, cancelUrl } = validationResult.data

    // Check if this is a test account - use mock data
    const allowTestAccounts =
      process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

    const isTestAccount =
      allowTestAccounts &&
      (session.user.id?.includes('test-') ||
        session.user.id?.includes('demo-') ||
        session.user.id?.includes('admin-'))

    if (isTestAccount) {
      // Return mock checkout session for test accounts
      return NextResponse.json({
        success: true,
        sessionId: `cs_test_${Date.now()}`,
        url: `https://checkout.stripe.com/test/${Date.now()}`,
        message: 'Test mode: Mock Stripe checkout session created',
      })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Fetch order details
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            merchandise: true,
            variant: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify order belongs to user
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if order is already paid
    if (order.status === 'PAID' || order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
    }

    // Create line items for Stripe
    const lineItems = order.items.map((item) => {
      const price = item.merchandise.price + (item.variant?.priceModifier || 0)
      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.merchandise.name,
            description: item.variant
              ? `Size: ${item.variant.size}, Color: ${item.variant.color}`
              : undefined,
            images: item.merchandise.imageUrl ? [item.merchandise.imageUrl] : [],
          },
          unit_amount: poundsToPence(price),
        },
        quantity: item.quantity,
      }
    })

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/orders?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: session.user.email || undefined,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    })

    // Update order with Stripe session ID
    await db.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: checkoutSession.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

