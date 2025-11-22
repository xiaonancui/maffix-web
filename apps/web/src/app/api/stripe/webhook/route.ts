import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, constructWebhookEvent } from '@/lib/stripe'
import Stripe from 'stripe'

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = constructWebhookEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId
  const userId = session.metadata?.userId

  if (!orderId || !userId) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  const { db } = await import('@/lib/db')

  try {
    // Update order status to PAID
    const order = await db.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent as string,
      },
      include: {
        items: {
          include: {
            merchandise: true,
          },
        },
      },
    })

    // Create transaction record (using DIAMONDS as currency type since USD is not in enum)
    // Note: This is a merchandise purchase, not a diamond transaction
    // Consider adding a separate payment history table for real money transactions
    await db.transaction.create({
      data: {
        userId: userId,
        type: 'SPEND',
        amount: 0, // Not a diamond transaction
        currency: 'DIAMONDS',
        description: `Merchandise purchase - Order #${order.id.slice(0, 8)} ($${order.totalAmount.toFixed(2)} USD)`,
        reference: order.id,
        status: 'COMPLETED',
      },
    })

    // TODO: Send confirmation email
    // TODO: Update inventory

    console.log(`Order ${orderId} marked as PAID`)

  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`PaymentIntent ${paymentIntent.id} succeeded`)
  // Additional logic if needed
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`PaymentIntent ${paymentIntent.id} failed`)
  
  const { db } = await import('@/lib/db')

  // Find order by payment intent ID and mark as failed
  try {
    const order = await db.order.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    })

    if (order) {
      await db.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      })
      console.log(`Order ${order.id} marked as CANCELLED due to payment failure`)
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

