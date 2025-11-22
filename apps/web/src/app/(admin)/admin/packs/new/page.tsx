'use client'

import { useRouter } from 'next/navigation'
import { PremiumPackForm, PremiumPackFormData } from '@/components/admin/PremiumPackForm'

export default function NewPremiumPackPage() {
  const router = useRouter()

  const handleSubmit = async (data: PremiumPackFormData) => {
    const response = await fetch('/api/admin/packs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to create premium pack')
    }

    router.push('/admin/packs')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Add Premium Pack</h1>
        <p className="text-muted-foreground mt-1">Create a new premium pack bundle</p>
      </div>

      {/* Form */}
      <PremiumPackForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/packs')}
        submitLabel="Create Pack"
      />
    </div>
  )
}

