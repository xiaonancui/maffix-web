import Stripe from 'stripe'

// Initialize Stripe with secret key (server-side only)
// Use a placeholder key during build if not provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})

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

