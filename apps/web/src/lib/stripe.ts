import Stripe from 'stripe'

// Initialize Stripe with secret key (server-side only)
// Throw error if key is not provided in production
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY environment variable is required in production')
}

// Use empty string for build time only - will fail at runtime if not configured
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    })
  : null as unknown as Stripe // Type assertion for build time

// Stripe publishable key for client-side (safe to expose)
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''

// Helper function to format amount for Stripe (convert dollars to cents)
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

// Helper function to format amount from Stripe (convert cents to dollars)
export function centsToDollars(cents: number): number {
  return cents / 100
}

// Stripe webhook signature verification
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

