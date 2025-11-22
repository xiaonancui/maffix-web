'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FilterOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-card border border-red-500/20 px-4 py-2 text-sm text-foreground hover:border-red-500/40 transition-all"
      >
        <span className="text-gray-400">{label}:</span>
        <span className="font-semibold">{selectedOption?.label || 'All'}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-lg bg-card border border-red-500/20 dark:shadow-xl shadow-red-500/20 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                value === option.value
                  ? 'bg-red-500/20 text-foreground font-semibold'
                  : 'text-gray-300 hover:bg-red-500/10 hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

