'use client'

import { useState } from 'react'
import Image from 'next/image'

type ProductImage = {
  id?: string
  url: string
  altText?: string
  isPrimary?: boolean
  sortOrder?: number
}

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-lg">
        <Image
          src={images[selectedImage]?.url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'}
          alt={images[selectedImage]?.altText || 'Product image'}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === index
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-border hover:border-border'
              }`}
            >
              <Image
                src={image.url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200'}
                alt={image.altText || `Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
