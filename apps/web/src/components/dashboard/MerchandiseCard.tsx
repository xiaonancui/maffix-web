'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MerchandiseItem {
  id: string
  name: string
  description: string
  price: number
  currency: string
  category: string
  sizes: string[]
  colors: string[]
  imageUrl: string
  inStock: boolean
  featured: boolean
  tags: string[]
  material?: string
  features?: string[]
}

export default function MerchandiseCard({ item }: { item: MerchandiseItem }) {
  const [selectedSize, setSelectedSize] = useState(item.sizes[0])
  const [selectedColor, setSelectedColor] = useState(item.colors[0])
  const [showToast, setShowToast] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    setIsAdding(true)

    // Show success toast (demo mode - using mock data)
    setShowToast(true)

    // Redirect to cart page after 1 second
    setTimeout(() => {
      setShowToast(false)
      setIsAdding(false)
      router.push('/cart')
    }, 1000)
  }

  return (
    <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
            ⭐ Featured
          </span>
        )}
        {!item.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-600">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Tags */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">{item.category}</span>
          {item.tags.includes('bestseller') && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
              Bestseller
            </span>
          )}
          {item.tags.includes('new') && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
              New
            </span>
          )}
        </div>

        {/* Name & Price */}
        <h3 className="mb-1 text-lg font-bold text-gray-900">{item.name}</h3>
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <p className="mb-4 text-2xl font-bold text-gray-900">
          ${item.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">{item.currency}</span>
        </p>

        {/* Color Selection */}
        {item.colors.length > 0 && (
          <div className="mb-3">
            <p className="mb-2 text-xs font-medium text-gray-700">Color: {selectedColor}</p>
            <div className="flex gap-2">
              {item.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`relative h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-blue-600 ring-2 ring-blue-200 ring-offset-2 scale-110'
                      : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() === 'black' ? '#000000' : color.toLowerCase(),
                  }}
                  title={color}
                >
                  {selectedColor === color && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                      {color.toLowerCase() === 'white' || color.toLowerCase() === 'gray' ? '✓' : '✓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {item.sizes.length > 0 && item.sizes[0] !== 'One Size' && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-gray-700">Size: {selectedSize}</p>
            <div className="flex flex-wrap gap-2">
              {item.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                    selectedSize === size
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md scale-105'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:scale-105'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={!item.inStock || isAdding}
            className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
              item.inStock && !isAdding
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-400'
            }`}
          >
            {!item.inStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
          </button>

          <Link
            href={`/store/${item.id}`}
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Details
          </Link>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50 animate-fade-in rounded-lg bg-blue-600 px-6 py-3 text-white shadow-lg">
            <p className="font-semibold">🛒 Payment integration coming soon!</p>
            <p className="text-sm opacity-90">支付功能开发中，敬请期待</p>
          </div>
        )}
      </div>
    </div>
  )
}
