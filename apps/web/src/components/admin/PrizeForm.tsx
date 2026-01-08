'use client'

import { useState, useEffect } from 'react'
import FormField from './FormField'

interface PrizeFormProps {
  initialData?: {
    name: string
    description: string
    rarity: string
    type: string
    image: string | null
    value: number
    stock: number | null
    isActive: boolean
  }
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function PrizeForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Prize',
}: PrizeFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    rarity: initialData?.rarity || 'COMMON',
    type: initialData?.type || 'PHYSICAL',
    image: initialData?.image || '',
    value: initialData?.value || 0,
    stock: initialData?.stock === null ? '' : (initialData?.stock?.toString() || ''),
    isActive: initialData?.isActive ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.value < 0) {
      newErrors.value = 'Value cannot be negative'
    }

    if (formData.stock !== '' && parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative'
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Image must be a valid URL'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)

      const submitData = {
        name: formData.name,
        description: formData.description,
        rarity: formData.rarity,
        type: formData.type,
        image: formData.image || null,
        value: formData.value,
        stock: formData.stock === '' ? null : parseInt(formData.stock),
        isActive: formData.isActive,
      }

      await onSubmit(submitData)
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-card border border-red-500/20 rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10 space-y-6">
        <h2 className="text-lg font-bold text-foreground">Basic Information</h2>

        <FormField
          label="Prize Name"
          type="text"
          value={formData.name}
          onChange={(value) => {
            setFormData({ ...formData, name: value })
            setErrors({ ...errors, name: '' })
          }}
          error={errors.name}
          required
          placeholder="e.g., VIP Concert Backstage Pass"
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
          placeholder="Describe the prize..."
          rows={4}
        />

        <FormField
          label="Image URL"
          type="text"
          value={formData.image}
          onChange={(value) => {
            setFormData({ ...formData, image: value })
            setErrors({ ...errors, image: '' })
          }}
          error={errors.image}
          placeholder="https://example.com/image.jpg"
          helpText="Optional: URL to prize image"
        />

        {formData.image && isValidUrl(formData.image) && (
          <div className="mt-2">
            <div className="text-sm text-gray-400 mb-2">Image Preview:</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.image}
              alt="Prize preview"
              className="w-32 h-32 rounded-lg object-cover border border-red-500/20"
            />
          </div>
        )}
      </div>

      {/* Prize Details */}
      <div className="bg-card border border-red-500/20 rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10 space-y-6">
        <h2 className="text-lg font-bold text-foreground">Prize Details</h2>

        <FormField
          label="Rarity"
          type="select"
          value={formData.rarity}
          onChange={(value) => setFormData({ ...formData, rarity: value })}
          required
          options={[
            { label: 'Common (60%)', value: 'COMMON' },
            { label: 'Rare (25%)', value: 'RARE' },
            { label: 'Epic (10%)', value: 'EPIC' },
            { label: 'SSR (4%)', value: 'SSR' },
            { label: 'Legendary (1%)', value: 'LEGENDARY' },
          ]}
          helpText="Rarity affects drop rate in gacha"
        />

        <FormField
          label="Type"
          type="select"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
          required
          options={[
            { label: 'Physical - Physical merchandise', value: 'PHYSICAL' },
            { label: 'Digital - Digital content', value: 'DIGITAL' },
            { label: 'Experience - Meet & greet, concert tickets', value: 'EXPERIENCE' },
            { label: 'Discount - Discount codes', value: 'DISCOUNT' },
            { label: 'Exclusive - Exclusive content access', value: 'EXCLUSIVE' },
          ]}
        />

        <FormField
          label="Diamond Value"
          type="number"
          value={formData.value}
          onChange={(value) => {
            setFormData({ ...formData, value: parseInt(value) || 0 })
            setErrors({ ...errors, value: '' })
          }}
          error={errors.value}
          required
          min={0}
          placeholder="0"
          helpText="Value in diamonds (for display purposes)"
        />

        <FormField
          label="Stock"
          type="number"
          value={formData.stock}
          onChange={(value) => {
            setFormData({ ...formData, stock: value })
            setErrors({ ...errors, stock: '' })
          }}
          error={errors.stock}
          min={0}
          placeholder="Leave empty for unlimited"
          helpText="Leave empty for unlimited stock"
        />

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 rounded border-red-500/30 bg-[#0a0a0a] text-red-500 focus:ring-red-500/50"
            />
            <span className="text-sm text-gray-300">Active</span>
          </label>
          <p className="text-xs text-gray-500">
            Inactive prizes won&apos;t appear in gacha or premium packs
          </p>
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
          className="px-6 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-2 bg-gray-800 text-foreground rounded-lg hover:bg-gray-700 transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

