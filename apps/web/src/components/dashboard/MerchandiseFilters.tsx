'use client'

import { useState } from 'react'

export default function MerchandiseFilters({ categories }: { categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  return (
    <div className="mb-10 rounded-3xl bg-gradient-to-br from-surface-card/90 to-surface-raised/80 border border-white/10 p-8 shadow-xl backdrop-blur-xl">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Category Filter */}
        <div>
          <label className="mb-4 block font-display text-sm font-bold uppercase tracking-wider text-white">
            Category
          </label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = selectedCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group relative rounded-2xl border-2 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'border-[#FF1F7D]/60 bg-gradient-to-br from-[#FF1F7D]/20 to-[#8B5CF6]/10 text-white shadow-lg shadow-[#FF1F7D]/30 backdrop-blur-xl scale-105'
                      : 'border-white/10 bg-surface-card/50 text-white/60 backdrop-blur-xl hover:border-white/20 hover:bg-surface-card/80 hover:text-white/90 hover:scale-105'
                  }`}
                >
                  {/* Active glow */}
                  {isActive && (
                    <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF1F7D]/20 to-[#8B5CF6]/20 opacity-50 blur-xl" />
                  )}
                  <span className="relative">{category}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sort" className="mb-4 block font-display text-sm font-bold uppercase tracking-wider text-white">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-2xl border-2 border-white/20 bg-surface-card/80 px-6 py-3.5 font-display text-sm font-bold text-white backdrop-blur-xl transition-all duration-300 focus:border-[#FF1F7D]/60 focus:outline-none focus:ring-2 focus:ring-[#FF1F7D]/50 hover:border-white/30"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'All' || sortBy !== 'featured') && (
        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
          <span className="font-display text-sm font-bold uppercase tracking-wider text-white/70">Active Filters:</span>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'All' && (
              <span className="flex items-center gap-2 rounded-full border-2 border-[#00F5FF]/50 bg-[#00F5FF]/20 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-[#00F5FF] backdrop-blur-sm">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="ml-1 hover:text-[#00F5FF]/80 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== 'featured' && (
              <span className="flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price ↑' : sortBy === 'price-high' ? 'Price ↓' : 'Name A-Z'}
                <button
                  onClick={() => setSortBy('featured')}
                  className="ml-1 hover:text-white transition-colors"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All')
              setSortBy('featured')
            }}
            className="ml-auto font-display text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
