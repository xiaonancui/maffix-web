'use client'

import { useState } from 'react'
import FormField from './FormField'

export interface MerchandiseFormData {
  name: string
  description: string
  price: number
  category: 'CLOTHING' | 'ACCESSORIES' | 'MUSIC' | 'COLLECTIBLES' | 'OTHER'
  material: string
  features: string[]
  tags: string[]
  imageUrl: string
  inStock: boolean
  featured: boolean
  sortOrder: number
}

interface MerchandiseFormProps {
  initialData?: Partial<MerchandiseFormData>
  onSubmit: (data: MerchandiseFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function MerchandiseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Product',
}: MerchandiseFormProps) {
  const [formData, setFormData] = useState<MerchandiseFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'CLOTHING',
    material: initialData?.material || '',
    features: initialData?.features || [],
    tags: initialData?.tags || [],
    imageUrl: initialData?.imageUrl || '',
    inStock: initialData?.inStock ?? true,
    featured: initialData?.featured ?? false,
    sortOrder: initialData?.sortOrder || 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Temporary string inputs for arrays
  const [featuresInput, setFeaturesInput] = useState(
    initialData?.features?.join(', ') || ''
  )
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(', ') || ''
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)

      // Parse features and tags from comma-separated strings
      const features = featuresInput
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0)

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      await onSubmit({
        ...formData,
        features,
        tags,
      })
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
        <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">Basic Information</h2>

        <FormField
          label="Product Name"
          type="text"
          value={formData.name}
          onChange={(value) => {
            setFormData({ ...formData, name: value })
            setErrors({ ...errors, name: '' })
          }}
          error={errors.name}
          required
          placeholder="e.g., Limited Edition Tour T-Shirt"
        />

        <FormField
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(value) => {
            setFormData({ ...formData, description: value })
            setErrors({ ...errors, description: '' })
          }}
          error={errors.description}
          required
          placeholder="Detailed product description..."
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Price (USD)"
            type="number"
            value={formData.price}
            onChange={(value) => {
              setFormData({ ...formData, price: parseFloat(value) || 0 })
              setErrors({ ...errors, price: '' })
            }}
            error={errors.price}
            required
            min={0}
            step={0.01}
            placeholder="29.99"
          />

          <FormField
            label="Category"
            type="select"
            value={formData.category}
            onChange={(value) =>
              setFormData({
                ...formData,
                category: value as MerchandiseFormData['category'],
              })
            }
            required
            options={[
              { label: 'Clothing', value: 'CLOTHING' },
              { label: 'Accessories', value: 'ACCESSORIES' },
              { label: 'Music', value: 'MUSIC' },
              { label: 'Collectibles', value: 'COLLECTIBLES' },
              { label: 'Other', value: 'OTHER' },
            ]}
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
        <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">Product Details</h2>

        <FormField
          label="Material"
          type="text"
          value={formData.material}
          onChange={(value) => setFormData({ ...formData, material: value })}
          placeholder="e.g., 100% Cotton, Polyester Blend"
          helpText="Optional: Specify the material composition"
        />

        <FormField
          label="Features"
          type="text"
          value={featuresInput}
          onChange={setFeaturesInput}
          placeholder="e.g., Soft fabric, Machine washable, Breathable"
          helpText="Comma-separated list of product features"
        />

        <FormField
          label="Tags"
          type="text"
          value={tagsInput}
          onChange={setTagsInput}
          placeholder="e.g., bestseller, new, limited-edition"
          helpText="Comma-separated list of tags for search and filtering"
        />

        <FormField
          label="Image URL"
          type="text"
          value={formData.imageUrl}
          onChange={(value) => {
            setFormData({ ...formData, imageUrl: value })
            setErrors({ ...errors, imageUrl: '' })
          }}
          error={errors.imageUrl}
          required
          placeholder="https://example.com/image.jpg"
          helpText="Primary product image URL"
        />

        {formData.imageUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Image Preview
            </label>
            <img
              src={formData.imageUrl}
              alt="Product preview"
              className="w-48 h-48 object-cover rounded-lg border-2 border-white/10"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* Inventory & Display */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
        <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">Inventory & Display</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="In Stock"
            type="select"
            value={formData.inStock ? 'true' : 'false'}
            onChange={(value) =>
              setFormData({ ...formData, inStock: value === 'true' })
            }
            options={[
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
            helpText="Overall stock status"
          />

          <FormField
            label="Featured"
            type="select"
            value={formData.featured ? 'true' : 'false'}
            onChange={(value) =>
              setFormData({ ...formData, featured: value === 'true' })
            }
            options={[
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
            helpText="Show in featured section"
          />

          <FormField
            label="Sort Order"
            type="number"
            value={formData.sortOrder}
            onChange={(value) =>
              setFormData({ ...formData, sortOrder: parseInt(value) || 0 })
            }
            min={0}
            placeholder="0"
            helpText="Lower numbers appear first"
          />
        </div>
      </div>

      {/* Error Display */}
      {errors.submit && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="text-[#FF1F7D]">{submitting ? 'Saving...' : submitLabel}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

