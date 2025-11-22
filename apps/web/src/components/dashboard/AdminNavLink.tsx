'use client'

import Link from 'next/link'

export default function AdminNavLink() {
  return (
    <Link
      href="/admin"
      prefetch={true}
      className="hidden items-center gap-2 rounded-lg bg-background border-2 border-[#FF5656] px-3 py-1.5 text-sm font-semibold text-[#FF5656] hover:bg-[#FF5656]/10 sm:flex transition-colors dark:bg-[#FF5656] dark:text-foreground dark:border-transparent dark:hover:bg-[#ff3333]"
    >
      <span>Admin</span>
    </Link>
  )
}

