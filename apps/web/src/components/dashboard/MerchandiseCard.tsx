'use client'

import { useState } from 'react'
import Link from 'next/link'

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
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
                  className={`h-8 w-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-blue-600' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() === 'black' ? '#000000' : color.toLowerCase(),
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {item.sizes.length > 0 && item.sizes[0] !== 'One Size' && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-gray-700">Size:</p>
            <div className="flex flex-wrap gap-2">
              {item.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded border px-3 py-1 text-sm font-medium ${
                    selectedSize === size
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
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
            disabled={!item.inStock}
            className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
              item.inStock
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-400'
            }`}
          >
            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        {/* Details Panel */}
        {showDetails && (
          <div className="mt-4 space-y-3 border-t pt-4">
            {item.material && (
              <div>
                <p className="text-xs font-semibold text-gray-700">Material:</p>
                <p className="text-xs text-gray-600">{item.material}</p>
              </div>
            )}
            {item.features && item.features.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700">Features:</p>
                <ul className="ml-4 list-disc text-xs text-gray-600">
                  {item.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
