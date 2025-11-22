'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
  className?: string
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, onSearch])

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-card border border-red-500/20 px-4 py-2 pl-10 text-sm text-foreground placeholder-gray-500 focus:border-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

