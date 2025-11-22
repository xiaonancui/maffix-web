'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MissionSubmitButton({ missionId }: { missionId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/missions/${missionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to submit mission')
        return
      }

      alert('Mission submitted successfully! Verification in progress...')
      router.refresh()
    } catch (error) {
      console.error('Mission submission error:', error)
      alert('An error occurred while submitting the mission')
    } finally {
      setIsSubmitting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Submit this mission for verification?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-md border-2 border-green-600 bg-background px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-600/10 disabled:opacity-50 dark:bg-green-600 dark:text-primary-foreground dark:hover:bg-green-700"
          >
            {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isSubmitting}
            className="flex-1 rounded-md border-2 border-gray-600 bg-background px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-600/10 disabled:opacity-50 dark:bg-gray-600 dark:text-primary-foreground dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full rounded-md border-2 border-primary bg-background px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
    >
      Submit for Verification
    </button>
  )
}
