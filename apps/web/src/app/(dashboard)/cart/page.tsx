'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import CartItemCard from '@/components/dashboard/CartItemCard'
import CheckoutButton from '@/components/dashboard/CheckoutButton'

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      setIsLoading(false)
    }
  }, [status, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#FF5656] border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    )
  }

  // Mock cart data for demo
  const cartItems: any[] = [
    {
      id: 'cart-item-1',
      merchandiseId: 'merch-1',
      variantId: 'v3',
      quantity: 2,
      merchandise: {
        id: 'merch-1',
        name: 'Classic Logo Hoodie',
        price: 65.0,
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80',
      },
      variant: {
        id: 'v3',
        size: 'L',
        color: 'Black',
        priceModifier: 0,
      },
    },
    {
      id: 'cart-item-2',
      merchandiseId: 'merch-2',
      variantId: 'v8',
      quantity: 1,
      merchandise: {
        id: 'merch-2',
        name: 'Signature Snapback Cap',
        price: 35.0,
        imageUrl: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400&q=80',
      },
      variant: {
        id: 'v8',
        size: 'One Size',
        color: 'Black',
        priceModifier: 0,
      },
    },
    {
      id: 'cart-item-3',
      merchandiseId: 'merch-3',
      variantId: null,
      quantity: 1,
      merchandise: {
        id: 'merch-3',
        name: 'Tour 2024 T-Shirt',
        price: 35.0,
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80',
      },
      variant: null,
    },
  ]

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const basePrice = item.merchandise.price
    const variantPrice = item.variant?.priceModifier || 0
    return sum + (basePrice + variantPrice) * item.quantity
  }, 0)

  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="mt-2 text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-card border border-border p-6 shadow-lg">
              <h2 className="mb-4 font-display text-xl font-bold text-foreground">Order Summary</h2>

              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="mt-6">
                <CheckoutButton
                  total={total}
                  onCreateOrder={async () => {
                    // Create order with shipping info
                    const response = await fetch('/api/orders/create', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        shippingName: session?.user?.name || 'Guest',
                        shippingEmail: session?.user?.email || 'guest@example.com',
                        shippingAddress: '123 Main St',
                        shippingCity: 'New York',
                        shippingState: 'NY',
                        shippingZip: '10001',
                        shippingCountry: 'US',
                      }),
                    })

                    if (!response.ok) {
                      throw new Error('Failed to create order')
                    }

                    const data = await response.json()
                    return data.order.id
                  }}
                />
              </div>

              <Link
                href="/store"
                className="mt-3 block w-full rounded-md border border-gray-600 bg-secondary px-6 py-3 text-center font-semibold text-muted-foreground hover:bg-gray-700 hover:text-foreground transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
