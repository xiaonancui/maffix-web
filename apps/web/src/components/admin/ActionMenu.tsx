'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

export interface ActionMenuItem {
  label: string
  icon?: string | ReactNode
  onClick: () => void
  variant?: 'default' | 'danger' | 'success'
  disabled?: boolean
}

interface ActionMenuProps {
  items?: ActionMenuItem[]
  actions?: ActionMenuItem[]
  trigger?: ReactNode
}

export default function ActionMenu({ items, actions, trigger }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuItems = items ?? actions ?? []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const variantStyles = {
    default: 'text-gray-300 hover:bg-red-500/10 hover:text-foreground',
    danger: 'text-red-400 hover:bg-red-500/20 hover:text-red-300',
    success: 'text-green-400 hover:bg-green-500/20 hover:text-green-300',
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-2 text-gray-400 hover:bg-red-500/10 hover:text-foreground transition-colors"
        aria-label="Open menu"
      >
        {trigger || (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-card border border-red-500/20 dark:shadow-xl shadow-red-500/20 overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick()
                  setIsOpen(false)
                }
              }}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : variantStyles[item.variant || 'default']
              }`}
            >
              {item.icon && (
                typeof item.icon === 'string' ? (
                  <span className="text-lg">{item.icon}</span>
                ) : (
                  <span>{item.icon}</span>
                )
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
