'use client'

import { useState } from 'react'

export default function MerchandiseFilters({ categories }: { categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Filter */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-gray-700">
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
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sort" className="mb-3 block text-sm font-semibold text-gray-700">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="mt-4 flex items-center gap-2 border-t pt-4">
          <span className="text-sm font-medium text-gray-600">Active Filters:</span>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'All' && (
              <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== 'featured' && (
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price ↑' : sortBy === 'price-high' ? 'Price ↓' : 'Name A-Z'}
                <button
                  onClick={() => setSortBy('featured')}
                  className="ml-1 hover:text-gray-900"
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
            className="ml-auto text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
