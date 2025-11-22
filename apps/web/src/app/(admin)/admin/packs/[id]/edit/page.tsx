'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PremiumPackForm, PremiumPackFormData } from '@/components/admin/PremiumPackForm'

interface PremiumPack {
  id: string
  name: string
  description: string
  price: number
  currency: string
  guaranteedPrizeId: string | null
  bonusTickets: number
  bonusDiamonds: number
  imageUrl: string | null
  featured: boolean
  sortOrder: number
  isActive: boolean
}

export default function EditPremiumPackPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [pack, setPack] = useState<PremiumPack | null>(null)

  useEffect(() => {
    fetchPack()
  }, [params.id])

  const fetchPack = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/packs/${params.id}`)
      const data = await response.json()

      if (data.success && data.pack) {
        setPack(data.pack)
      } else {
        console.error('Failed to fetch pack:', data.error)
        router.push('/admin/packs')
      }
    } catch (error) {
      console.error('Failed to fetch pack:', error)
      router.push('/admin/packs')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: PremiumPackFormData) => {
    const response = await fetch(`/api/admin/packs/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update premium pack')
    }

    router.push('/admin/packs')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading premium pack...</div>
      </div>
    )
  }

  if (!pack) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Premium Pack</h1>
        <p className="text-muted-foreground mt-1">Update premium pack details</p>
      </div>

      {/* Form */}
      <PremiumPackForm
        initialData={{
          name: pack.name,
          description: pack.description,
          price: pack.price,
          currency: pack.currency,
          guaranteedPrizeId: pack.guaranteedPrizeId,
          bonusTickets: pack.bonusTickets,
          bonusDiamonds: pack.bonusDiamonds,
          imageUrl: pack.imageUrl,
          featured: pack.featured,
          sortOrder: pack.sortOrder,
          isActive: pack.isActive,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/packs')}
        submitLabel="Save Changes"
      />
    </div>
  )
}

