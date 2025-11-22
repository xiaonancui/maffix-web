'use client'

import { useState } from 'react'

export default function MerchandiseFilters({ categories }: { categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  return (
    <div className="mb-8 rounded-lg bg-gray-900 border border-gray-800 p-6 shadow hover:border-[#FF5656] transition-colors">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Filter */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-white">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'border-[#FF5656] bg-[#FF5656] text-white'
                    : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sort" className="mb-3 block text-sm font-semibold text-white">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-white focus:border-[#FF5656] focus:outline-none focus:ring-2 focus:ring-[#FF5656]/50"
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
        <div className="mt-4 flex items-center gap-2 border-t border-gray-700 pt-4">
          <span className="text-sm font-medium text-gray-400">Active Filters:</span>
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
              <span className="flex items-center gap-1 rounded-full bg-gray-800 border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300">
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price ↑' : sortBy === 'price-high' ? 'Price ↓' : 'Name A-Z'}
                <button
                  onClick={() => setSortBy('featured')}
                  className="ml-1 hover:text-gray-200"
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
            className="ml-auto text-xs font-medium text-gray-400 hover:text-gray-300"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
