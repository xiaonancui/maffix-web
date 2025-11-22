'use client'

import { ReactNode } from 'react'

interface ConfirmDialogProps {
  isOpen?: boolean
  open?: boolean
  onClose?: () => void
  onCancel?: () => void
  onConfirm: () => void
  title: string
  message: string | ReactNode
  confirmText?: string
  confirmLabel?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  open,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmLabel,
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const isDialogOpen = isOpen ?? open ?? false
  const handleClose = onClose ?? onCancel
  const confirmCopy = confirmLabel ?? confirmText

  if (!isDialogOpen) return null

  const variantStyles = {
    danger: 'from-red-600 to-red-500',
    warning: 'from-yellow-600 to-yellow-500',
    info: 'from-blue-600 to-blue-500',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-card border-2 border-border dark:shadow-2xl p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>

        {/* Message */}
        <div className="mb-6 text-sm text-muted-foreground">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-foreground border border-border hover:bg-secondary/80 hover:border-border disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-md bg-gradient-to-r ${variantStyles[variant]} px-4 py-2 text-sm font-semibold text-foreground dark:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              confirmCopy
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
