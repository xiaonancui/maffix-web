'use client'

import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
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
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Add Premium Pack"
        description="Create a new premium pack bundle"
      />

      {/* Form */}
      <PremiumPackForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/packs')}
        submitLabel="Create Pack"
      />
    </div>
  )
}

