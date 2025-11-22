'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="hidden sm:flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20 hover:border-red-500/40"
      title="Sign Out"
    >
      <span>🚪</span>
      <span>Sign Out</span>
    </button>
  )
}

