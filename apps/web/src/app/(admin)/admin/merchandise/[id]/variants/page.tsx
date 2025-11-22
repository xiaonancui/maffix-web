'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import FormField from '@/components/admin/FormField'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ActionMenu from '@/components/admin/ActionMenu'

interface Merchandise {
  id: string
  name: string
  price: number
  imageUrl: string
}

interface Variant {
  id: string
  size: string | null
  color: string | null
  sku: string
  priceModifier: number
  stockQuantity: number
  inStock: boolean
  createdAt: string
}

export default function MerchandiseVariantsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [merchandise, setMerchandise] = useState<Merchandise | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [variantToDelete, setVariantToDelete] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    size: '',
    color: '',
    sku: '',
    priceModifier: 0,
    stockQuantity: 0,
    inStock: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchMerchandise()
    fetchVariants()
  }, [params.id])

  const fetchMerchandise = async () => {
    try {
      const response = await fetch(`/api/admin/merchandise/${params.id}`)
      const data = await response.json()

      if (data.success && data.merchandise) {
        setMerchandise(data.merchandise)
      }
    } catch (error) {
      console.error('Failed to fetch merchandise:', error)
    }
  }

  const fetchVariants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/merchandise/${params.id}/variants`)
      const data = await response.json()

      if (data.success) {
        setVariants(data.variants || [])
      }
    } catch (error) {
      console.error('Failed to fetch variants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVariant = () => {
    setShowAddForm(true)
    setEditingVariant(null)
    setFormData({
      size: '',
      color: '',
      sku: '',
      priceModifier: 0,
      stockQuantity: 0,
      inStock: true,
    })
    setErrors({})
  }

  const handleEditVariant = (variant: Variant) => {
    setShowAddForm(true)
    setEditingVariant(variant)
    setFormData({
      size: variant.size || '',
      color: variant.color || '',
      sku: variant.sku,
      priceModifier: variant.priceModifier,
      stockQuantity: variant.stockQuantity,
      inStock: variant.inStock,
    })
    setErrors({})
  }

  const handleSubmitVariant = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }

    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)

      const url = editingVariant
        ? `/api/admin/merchandise/${params.id}/variants/${editingVariant.id}`
        : `/api/admin/merchandise/${params.id}/variants`

      const method = editingVariant ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size: formData.size || null,
          color: formData.color || null,
          sku: formData.sku,
          priceModifier: formData.priceModifier,
          stockQuantity: formData.stockQuantity,
          inStock: formData.inStock,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        fetchVariants()
        setShowAddForm(false)
        setEditingVariant(null)
      } else {
        setErrors({ submit: data.error || 'Failed to save variant' })
      }
    } catch (error) {
      console.error('Failed to save variant:', error)
      setErrors({ submit: 'An unexpected error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteVariant = async () => {
    if (!variantToDelete) return

    try {
      const response = await fetch(
        `/api/admin/merchandise/${params.id}/variants/${variantToDelete}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        fetchVariants()
        setDeleteDialogOpen(false)
        setVariantToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete variant:', error)
    }
  }

  const columns = [
    {
      key: 'sku',
      label: 'SKU',
      render: (variant: Variant) => (
        <span className="font-mono text-foreground">{variant.sku}</span>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      render: (variant: Variant) => (
        <span className="text-muted-foreground">{variant.size || '-'}</span>
      ),
    },
    {
      key: 'color',
      label: 'Color',
      render: (variant: Variant) => (
        <span className="text-muted-foreground">{variant.color || '-'}</span>
      ),
    },
    {
      key: 'priceModifier',
      label: 'Price Modifier',
      render: (variant: Variant) => {
        const modifier = variant.priceModifier
        const totalPrice = merchandise ? merchandise.price + modifier : modifier
        return (
          <div>
            <div className="text-foreground font-medium">${totalPrice.toFixed(2)}</div>
            {modifier !== 0 && (
              <div className={`text-sm ${modifier > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {modifier > 0 ? '+' : ''}${modifier.toFixed(2)}
              </div>
            )}
          </div>
        )
      },
    },
    {
      key: 'stockQuantity',
      label: 'Stock',
      render: (variant: Variant) => (
        <span
          className={`font-medium ${
            variant.stockQuantity > 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {variant.stockQuantity} units
        </span>
      ),
    },
    {
      key: 'inStock',
      label: 'Status',
      render: (variant: Variant) => (
        <StatusBadge variant={variant.inStock ? 'success' : 'error'}>
          {variant.inStock ? 'In Stock' : 'Out of Stock'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (variant: Variant) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              onClick: () => handleEditVariant(variant),
            },
            {
              label: 'Delete',
              onClick: () => {
                setVariantToDelete(variant.id)
                setDeleteDialogOpen(true)
              },
              variant: 'danger',
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/merchandise')}
            className="text-muted-foreground hover:text-foreground mb-2 flex items-center gap-2"
          >
            ← Back to Merchandise
          </button>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Manage Variants
          </h1>
          {merchandise && (
            <p className="text-muted-foreground mt-1">
              {merchandise.name} - Base Price: ${merchandise.price.toFixed(2)}
            </p>
          )}
        </div>
        <button
          onClick={handleAddVariant}
          className="px-4 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
        >
          + Add Variant
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-lg font-bold text-foreground mb-4">
            {editingVariant ? 'Edit Variant' : 'Add New Variant'}
          </h2>
          <form onSubmit={handleSubmitVariant} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Size"
                type="text"
                value={formData.size}
                onChange={(value) => setFormData({ ...formData, size: value })}
                placeholder="e.g., S, M, L, XL"
              />

              <FormField
                label="Color"
                type="text"
                value={formData.color}
                onChange={(value) => setFormData({ ...formData, color: value })}
                placeholder="e.g., Black, White, Red"
              />

              <FormField
                label="SKU"
                type="text"
                value={formData.sku}
                onChange={(value) => {
                  setFormData({ ...formData, sku: value })
                  setErrors({ ...errors, sku: '' })
                }}
                error={errors.sku}
                required
                placeholder="e.g., TSHIRT-BLK-M"
              />

              <FormField
                label="Price Modifier (USD)"
                type="number"
                value={formData.priceModifier}
                onChange={(value) =>
                  setFormData({ ...formData, priceModifier: parseFloat(value) || 0 })
                }
                step={0.01}
                placeholder="0.00"
                helpText="Additional price for this variant"
              />

              <FormField
                label="Stock Quantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(value) => {
                  setFormData({ ...formData, stockQuantity: parseInt(value) || 0 })
                  setErrors({ ...errors, stockQuantity: '' })
                }}
                error={errors.stockQuantity}
                required
                min={0}
                placeholder="0"
              />

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
              />
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
              >
                {submitting ? 'Saving...' : editingVariant ? 'Save Changes' : 'Add Variant'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingVariant(null)
                }}
                disabled={submitting}
                className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-gray-700 transition-colors border border-red-500/30"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Variants Table */}
      <div className="bg-card border border-border rounded-lg dark:shadow-lg dark:shadow-red-500/10">
        <DataTable
          columns={columns}
          data={variants}
          keyExtractor={(variant) => variant.id}
          loading={loading}
          pagination={{
            page: 1,
            limit: variants.length,
            total: variants.length,
            totalPages: 1,
          }}
          onPageChange={() => {}}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setVariantToDelete(null)
        }}
        onConfirm={handleDeleteVariant}
        title="Delete Variant"
        message="Are you sure you want to delete this variant? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

