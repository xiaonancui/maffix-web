'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileMenu({ diamondBalance }: { diamondBalance: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="sm:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
      >
        <span className="sr-only">Open menu</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          )}
        </svg>
      </button>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-gray-200 bg-white shadow-lg">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {/* Diamond Balance */}
            <Link
              href="/transactions"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <span>💎</span>
              <span>{diamondBalance} Diamonds</span>
            </Link>

            {/* Navigation Links */}
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/missions"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Missions
            </Link>
            <Link
              href="/gacha"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Gacha
            </Link>
            <Link
              href="/store/packs"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Premium Packs
            </Link>
            <Link
              href="/prizes"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Prizes
            </Link>
            <Link
              href="/profile"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
