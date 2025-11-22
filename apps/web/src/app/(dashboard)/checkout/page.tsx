'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const orderId = searchParams.get('orderId')
  const total = searchParams.get('total')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      setIsLoading(false)
    }
  }, [status, router])

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to success page
    router.push(`/orders?success=true&orderId=${orderId}`)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#FF5656] border-t-transparent mx-auto"></div>
          <p className="text-gray-400">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="mt-2 text-gray-400">Complete your purchase</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="rounded-lg bg-gray-900 border border-gray-800 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Shipping Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue={session?.user?.name?.split(' ')[0] || ''}
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue={session?.user?.name?.split(' ')[1] || ''}
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={session?.user?.email || ''}
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="New York"
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    placeholder="10001"
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg bg-gray-900 border border-gray-800 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    id="card"
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[#FF5656] focus:ring-[#FF5656] border-gray-600 bg-gray-800"
                  />
                  <label htmlFor="card" className="text-white">
                    💳 Credit/Debit Card
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    id="paypal"
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[#FF5656] focus:ring-[#FF5656] border-gray-600 bg-gray-800"
                  />
                  <label htmlFor="paypal" className="text-white">
                    🅿️ PayPal
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    id="apple"
                    type="radio"
                    value="apple"
                    checked={paymentMethod === 'apple'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[#FF5656] focus:ring-[#FF5656] border-gray-600 bg-gray-800"
                  />
                  <label htmlFor="apple" className="text-white">
                    🍎 Apple Pay
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-gray-900 border border-gray-800 p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Order Summary</h2>
              
              <div className="space-y-3 border-b border-gray-700 pb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>${total}</span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full rounded-md px-6 py-3 font-semibold text-white transition-colors ${
                    isProcessing
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#FF5656] hover:bg-[#ff3333]'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    `Complete Payment - $${total}`
                  )}
                </button>

                <Link
                  href="/cart"
                  className="block w-full rounded-md border border-gray-600 bg-gray-800 px-6 py-3 text-center font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Back to Cart
                </Link>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  🔒 This is a demo checkout. No real payment will be processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
