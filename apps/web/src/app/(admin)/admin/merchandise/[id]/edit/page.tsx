'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MerchandiseForm, MerchandiseFormData } from '@/components/admin/MerchandiseForm'

interface Merchandise {
  id: string
  name: string
  description: string
  price: number
  category: string
  material: string | null
  features: string[]
  tags: string[]
  imageUrl: string
  inStock: boolean
  featured: boolean
  sortOrder: number
}

export default function EditMerchandisePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [merchandise, setMerchandise] = useState<Merchandise | null>(null)

  useEffect(() => {
    fetchMerchandise()
  }, [params.id])

  const fetchMerchandise = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/merchandise/${params.id}`)
      const data = await response.json()

      if (data.success && data.merchandise) {
        setMerchandise(data.merchandise)
      } else {
        console.error('Failed to fetch merchandise:', data.error)
        router.push('/admin/merchandise')
      }
    } catch (error) {
      console.error('Failed to fetch merchandise:', error)
      router.push('/admin/merchandise')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: MerchandiseFormData) => {
    const response = await fetch(`/api/admin/merchandise/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update merchandise')
    }

    router.push('/admin/merchandise')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading merchandise...</div>
      </div>
    )
  }

  if (!merchandise) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground mt-1">Update merchandise product details</p>
      </div>

      {/* Form */}
      <MerchandiseForm
        initialData={{
          name: merchandise.name,
          description: merchandise.description,
          price: merchandise.price,
          category: merchandise.category as MerchandiseFormData['category'],
          material: merchandise.material || '',
          features: merchandise.features,
          tags: merchandise.tags,
          imageUrl: merchandise.imageUrl,
          inStock: merchandise.inStock,
          featured: merchandise.featured,
          sortOrder: merchandise.sortOrder,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/merchandise')}
        submitLabel="Save Changes"
      />
    </div>
  )
}

