'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const pages = []
  const maxVisiblePages = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      {/* Info */}
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <div className="text-sm text-gray-400">
          Showing{' '}
          <span className="font-semibold text-foreground">
            {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-foreground">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{' '}
          of <span className="font-semibold text-foreground">{totalItems}</span> results
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-md bg-card border border-border px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="rounded-md bg-card border border-border px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/40 transition-all"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-all ${
              page === currentPage
                ? 'bg-primary/20 border-2 border-primary text-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary/40'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="rounded-md bg-card border border-border px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/40 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 rounded-md bg-card border border-border px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

