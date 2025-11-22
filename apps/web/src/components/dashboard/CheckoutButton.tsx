'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_PUBLISHABLE_KEY } from '@/lib/stripe'

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

interface CheckoutButtonProps {
  orderId?: string
  total: number
  onCreateOrder?: () => Promise<string> // Function to create order and return orderId
}

export default function CheckoutButton({ orderId, total, onCreateOrder }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStripeCheckout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // If no orderId provided, create one first
      let finalOrderId = orderId
      if (!finalOrderId && onCreateOrder) {
        finalOrderId = await onCreateOrder()
      }

      if (!finalOrderId) {
        throw new Error('Order ID is required')
      }

      // For demo purposes, redirect to our sample checkout page
      const checkoutUrl = `/checkout?orderId=${finalOrderId}&total=${total.toFixed(2)}`
      window.location.href = checkoutUrl

    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Failed to initiate checkout')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-600 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        onClick={handleStripeCheckout}
        disabled={isLoading}
        className={`w-full rounded-md px-6 py-3 font-semibold text-white transition-colors ${
          isLoading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-[#FF5656] hover:bg-[#ff3333]'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Proceed to Checkout (${total.toFixed(2)})
          </span>
        )}
      </button>

      <p className="text-xs text-center text-gray-400">
        Demo checkout - No real payment required
      </p>
    </div>
  )
}

