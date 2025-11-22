'use client'

import { useState } from 'react'

export default function MerchandiseFilters({ categories }: { categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  return (
    <div className="mb-8 rounded-lg bg-secondary border border-border p-6 shadow hover:border-primary transition-colors">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Filter */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-foreground">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'border-primary bg-transparent text-primary dark:bg-primary dark:text-primary-foreground'
                    : 'border-border bg-transparent text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sort" className="mb-3 block text-sm font-semibold text-foreground">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-secondary px-4 py-2 text-sm font-medium text-foreground focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
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
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'All' && (
              <span className="flex items-center gap-1 rounded-full bg-blue-900/20 border border-blue-600 px-3 py-1 text-xs font-medium text-blue-400">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="ml-1 hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== 'featured' && (
              <span className="flex items-center gap-1 rounded-full bg-secondary border border-gray-600 px-3 py-1 text-xs font-medium text-muted-foreground">
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price ↑' : sortBy === 'price-high' ? 'Price ↓' : 'Name A-Z'}
                <button
                  onClick={() => setSortBy('featured')}
                  className="ml-1 hover:text-foreground"
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
            className="ml-auto text-xs font-medium text-muted-foreground hover:text-muted-foreground"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
