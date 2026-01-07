'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function AdminNavLink() {
  return (
    <Link
      href="/admin"
      prefetch={true}
      className="group hidden items-center gap-2 rounded-2xl border border-[#FF1F7D]/30 bg-gradient-to-br from-[#FF1F7D]/10 to-[#B200FF]/5 px-4 py-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:bg-[#FF1F7D]/20 hover:shadow-lg hover:shadow-[#FF1F7D]/30 sm:flex"
    >
      <div className="rounded-lg bg-[#FF1F7D]/20 p-1.5 ring-1 ring-[#FF1F7D]/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF1F7D]/30">
        <Shield className="h-3.5 w-3.5 text-[#FF1F7D]" />
      </div>
      <span className="font-display text-sm font-bold text-white">Admin</span>
    </Link>
  )
}
