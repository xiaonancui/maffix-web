'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import FormField from '@/components/admin/FormField'
import Image from 'next/image'

interface FeaturedProduct {
  enabled: boolean
  imageUrl: string
  name: string
  description: string
  price: number
  currency: string
  badge: string
  badgeSecondary: string
  linkUrl: string
  ctaText: string
}

export default function FeaturedProductPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<FeaturedProduct>({
    enabled: true,
    imageUrl: '',
    name: '',
    description: '',
    price: 0,
    currency: 'GBP',
    badge: '',
    badgeSecondary: '',
    linkUrl: '/store',
    ctaText: 'Shop Now',
  })

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/store/featured-product')
      const data = await response.json()

      if (data.success && data.featuredProduct) {
        setProduct(data.featuredProduct)
      }
    } catch (error) {
      console.error('Failed to fetch featured product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/store/featured-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      const data = await response.json()

      if (data.success) {
        alert('Featured product saved successfully!')
      } else {
        alert('Failed to save: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to save featured product:', error)
      alert('Failed to save featured product')
    } finally {
      setSaving(false)
    }
  }

  const updateProduct = (key: keyof FeaturedProduct, value: any) => {
    setProduct((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-white/60">Loading featured product...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="space-y-6">
        <AdminPageHeader
          title="Featured Product"
          description="Manage the featured product displayed on the dashboard"
          action={{
            label: saving ? 'Saving...' : 'Save Changes',
            onClick: handleSave,
            disabled: saving,
          }}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Enable Toggle */}
            <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
              <h2 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">
                Display Settings
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-white">Show Featured Product</label>
                  <p className="text-sm text-white/60">Display the featured product card on the dashboard</p>
                </div>
                <input
                  type="checkbox"
                  checked={product.enabled}
                  onChange={(e) => updateProduct('enabled', e.target.checked)}
                  className="h-5 w-5 rounded border-[#10B981]/30 bg-surface-base text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
              <h2 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">
                Product Information
              </h2>
              <div className="space-y-4">
                <FormField
                  label="Product Name"
                  value={product.name}
                  onChange={(value) => updateProduct('name', value)}
                  placeholder="e.g., Limited Edition Tour T-Shirt"
                  required
                />
                <FormField
                  label="Description"
                  value={product.description}
                  onChange={(value) => updateProduct('description', value)}
                  type="textarea"
                  rows={3}
                  placeholder="e.g., Exclusive design. Limited quantities. Don't miss out."
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Price"
                    value={product.price.toString()}
                    onChange={(value) => updateProduct('price', parseFloat(value) || 0)}
                    type="number"
                    step={0.01}
                    min={0}
                  />
                  <FormField
                    label="Currency"
                    value={product.currency}
                    onChange={(value) => updateProduct('currency', value)}
                    type="select"
                    options={[
                      { label: 'GBP (£)', value: 'GBP' },
                      { label: 'USD ($)', value: 'USD' },
                      { label: 'EUR (€)', value: 'EUR' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Image & Link */}
            <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
              <h2 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">
                Image & Link
              </h2>
              <div className="space-y-4">
                <FormField
                  label="Image URL"
                  value={product.imageUrl}
                  onChange={(value) => updateProduct('imageUrl', value)}
                  placeholder="https://example.com/image.jpg"
                  helpText="Use a high-quality image (recommended: 800x600px)"
                  required
                />
                <FormField
                  label="Link URL"
                  value={product.linkUrl}
                  onChange={(value) => updateProduct('linkUrl', value)}
                  placeholder="/store or /store/product-id"
                  helpText="Where should clicking the card take the user?"
                />
                <FormField
                  label="Button Text"
                  value={product.ctaText}
                  onChange={(value) => updateProduct('ctaText', value)}
                  placeholder="Shop Now"
                />
              </div>
            </div>

            {/* Badges */}
            <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
              <h2 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">
                Badges
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Primary Badge"
                  value={product.badge}
                  onChange={(value) => updateProduct('badge', value)}
                  placeholder="e.g., New Arrival"
                  helpText="Appears on top-left (cyan badge)"
                />
                <FormField
                  label="Secondary Badge"
                  value={product.badgeSecondary}
                  onChange={(value) => updateProduct('badgeSecondary', value)}
                  placeholder="e.g., Limited"
                  helpText="Appears on top-right (gold badge)"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
              <h2 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">
                Preview
              </h2>

              {/* Preview Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-[#FF1F7D]/20 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl">
                {/* Product Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name || 'Featured Product'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-surface-raised">
                      <span className="text-white/40">No image</span>
                    </div>
                  )}

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Primary Badge */}
                  {product.badge && (
                    <div className="absolute left-4 top-4">
                      <div className="flex items-center gap-2 rounded-full border border-[#00F5FF]/50 bg-[#00F5FF]/20 px-4 py-2 backdrop-blur-md">
                        <span className="font-display text-xs font-black uppercase tracking-widest text-white">
                          {product.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Secondary Badge */}
                  {product.badgeSecondary && (
                    <div className="absolute right-4 top-4">
                      <div className="rounded-full border border-[#FFC700]/40 bg-gradient-to-r from-[#FFC700]/20 to-[#FF1F7D]/20 px-3 py-1.5 backdrop-blur-md">
                        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#FFC700]">
                          {product.badgeSecondary}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="relative space-y-4 p-6">
                  <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[#FF1F7D]">
                    Featured Drop
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-black leading-tight text-white">
                      {product.name || 'Product Name'}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {product.description || 'Product description goes here...'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-black tabular-nums text-[#FFC700]">
                        {product.currency === 'GBP' ? '£' : product.currency === 'EUR' ? '€' : '$'}
                        {Math.floor(product.price)}
                      </span>
                      <span className="font-display text-lg font-bold text-[#FFC700]/60">
                        .{((product.price % 1) * 100).toFixed(0).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#FFC700] px-6 py-2.5 font-display text-sm font-bold text-white shadow-lg shadow-[#FF1F7D]/40">
                      {product.ctaText || 'Shop Now'}
                    </div>
                  </div>
                </div>
              </div>

              {!product.enabled && (
                <div className="mt-4 rounded-xl border border-[#FFC700]/30 bg-[#FFC700]/10 p-4 text-center">
                  <p className="text-sm font-medium text-[#FFC700]">
                    This featured product is currently hidden from users
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="text-[#FF1F7D]">{saving ? 'Saving...' : 'Save Featured Product'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
