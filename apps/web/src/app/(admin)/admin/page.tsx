import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Users, ClipboardList, Clock, Gift, Shield, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Use mock data instead of database connection
  const totalUsers = 1247
  const totalTasks = 45
  const pendingVerifications = 12
  const totalPrizes = 156
  const totalGachaPulls = 3892
  const recentUsers = [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
      createdAt: new Date('2024-01-15'),
      diamonds: 500,
      points: 250,
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'USER',
      createdAt: new Date('2024-01-14'),
      diamonds: 750,
      points: 380,
    },
    {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'ARTIST',
      createdAt: new Date('2024-01-13'),
      diamonds: 1200,
      points: 600,
    },
    {
      id: 'user-4',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      role: 'USER',
      createdAt: new Date('2024-01-12'),
      diamonds: 300,
      points: 150,
    },
    {
      id: 'user-5',
      name: 'Tom Brown',
      email: 'tom@example.com',
      role: 'USER',
      createdAt: new Date('2024-01-11'),
      diamonds: 450,
      points: 220,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Admin Dashboard"
        description={`Welcome back, ${session.user.name}`}
        badge={
          <div className="flex items-center gap-2 rounded-2xl border-2 border-[#FFC700]/40 bg-gradient-to-r from-[#FFC700]/20 to-[#FFC700]/10 px-4 py-2 backdrop-blur-sm shadow-lg shadow-[#FFC700]/20">
            <Shield className="h-3.5 w-3.5 text-[#FFC700] animate-pulse" />
            <span className="font-display text-xs font-black uppercase tracking-wider text-[#FFC700]">
              ADMIN MODE
            </span>
          </div>
        }
      />

      {/* Statistics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users - Cyan */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#00F5FF]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#00F5FF]/60 hover:shadow-[0_0_40px_rgba(0,245,255,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#00F5FF]/20 p-3 ring-2 ring-[#00F5FF]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Users className="h-8 w-8 text-[#00F5FF]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Total Users</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Total Tasks - Purple */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#8B5CF6]/20 p-3 ring-2 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <ClipboardList className="h-8 w-8 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Total Tasks</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {totalTasks.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Verifications - Hot Pink (Prominent) */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FF1F7D]/50 bg-gradient-to-br from-[#FF1F7D]/10 to-surface-raised/90 p-6 shadow-xl shadow-[#FF1F7D]/20 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/70 hover:shadow-[0_0_40px_rgba(255,31,125,0.4)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FF1F7D]/30 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-2xl bg-[#FF1F7D]/20 p-3 ring-2 ring-[#FF1F7D]/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Clock className="h-8 w-8 text-[#FF1F7D]" />
              </div>
              <div>
                <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">
                  Pending
                </p>
                <p className="font-display text-3xl font-black tabular-nums text-[#FF1F7D]">
                  {pendingVerifications}
                </p>
              </div>
            </div>
            <Link
              href="/admin/tasks"
              className="group/link inline-flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wider text-[#FF1F7D] transition-all duration-300 hover:gap-2 hover:text-white"
            >
              Review now
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Total Prizes - Gold */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFC700]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FFC700]/60 hover:shadow-[0_0_40px_rgba(255,199,0,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFC700]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#FFC700]/20 p-3 ring-2 ring-[#FFC700]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Gift className="h-8 w-8 text-[#FFC700]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Total Prizes</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {totalPrizes.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-6 font-display text-2xl font-black uppercase tracking-wider text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Verify Tasks - Hot Pink */}
          <Link
            href="/admin/tasks"
            className="group relative overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-br from-[#FF1F7D]/20 to-[#FF1F7D]/10 p-6 text-center shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40"
          >
            <Clock className="mx-auto h-10 w-10 text-[#FF1F7D] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <p className="mt-3 font-display text-sm font-bold uppercase tracking-wider text-white">Verify Tasks</p>
          </Link>

          {/* Manage Users - Cyan */}
          <Link
            href="/admin/users"
            className="group relative overflow-hidden rounded-2xl border-2 border-[#00F5FF]/40 bg-gradient-to-br from-[#00F5FF]/20 to-[#00F5FF]/10 p-6 text-center shadow-lg shadow-[#00F5FF]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF]/60 hover:shadow-[#00F5FF]/40"
          >
            <Users className="mx-auto h-10 w-10 text-[#00F5FF] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <p className="mt-3 font-display text-sm font-bold uppercase tracking-wider text-white">Manage Users</p>
          </Link>

          {/* Manage Prizes - Gold */}
          <Link
            href="/admin/prizes"
            className="group relative overflow-hidden rounded-2xl border-2 border-[#FFC700]/40 bg-gradient-to-br from-[#FFC700]/20 to-[#FFC700]/10 p-6 text-center shadow-lg shadow-[#FFC700]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FFC700]/60 hover:shadow-[#FFC700]/40"
          >
            <Gift className="mx-auto h-10 w-10 text-[#FFC700] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <p className="mt-3 font-display text-sm font-bold uppercase tracking-wider text-white">Manage Prizes</p>
          </Link>

          {/* User View - Purple */}
          <Link
            href="/dashboard"
            className="group relative overflow-hidden rounded-2xl border-2 border-[#8B5CF6]/40 bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/10 p-6 text-center shadow-lg shadow-[#8B5CF6]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#8B5CF6]/60 hover:shadow-[#8B5CF6]/40"
          >
            <ArrowRight className="mx-auto h-10 w-10 text-[#8B5CF6] transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" />
            <p className="mt-3 font-display text-sm font-bold uppercase tracking-wider text-white">User View</p>
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="mb-6 font-display text-2xl font-black uppercase tracking-wider text-white">
          Recent Users
        </h2>
        <div className="overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl">
          <table className="min-w-full">
            <thead className="border-b-2 border-white/10 bg-gradient-to-r from-[#FF1F7D]/20 via-[#8B5CF6]/20 to-transparent backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-left font-display text-xs font-black uppercase tracking-wider text-white">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-display text-xs font-black uppercase tracking-wider text-white">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-display text-xs font-black uppercase tracking-wider text-white">
                  Role
                </th>
                <th className="px-6 py-4 text-left font-display text-xs font-black uppercase tracking-wider text-white">
                  Diamonds
                </th>
                <th className="px-6 py-4 text-left font-display text-xs font-black uppercase tracking-wider text-white">
                  Points
                </th>
                <th className="px-6 py-4 text-left font-display text-xs font-black uppercase tracking-wider text-white">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="transition-all duration-300 hover:bg-white/5 hover:shadow-[inset_4px_0_0_0_rgba(255,31,125,0.5)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-white">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white/60">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider shadow-lg ${
                        user.role === 'ADMIN'
                          ? 'border-[#FF1F7D]/40 bg-[#FF1F7D]/20 text-[#FF1F7D] shadow-[#FF1F7D]/20'
                          : user.role === 'ARTIST'
                          ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/20 text-[#8B5CF6] shadow-[#8B5CF6]/20'
                          : 'border-white/20 bg-white/10 text-white/60 shadow-white/10'
                      }`}
                    >
                      {user.role === 'ADMIN' && <span className="h-1.5 w-1.5 rounded-full bg-[#FF1F7D] animate-pulse" />}
                      {user.role === 'ARTIST' && <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold tabular-nums text-[#00F5FF]">
                    💎 {user.diamonds.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold tabular-nums text-[#FFC700]">
                    ⭐ {user.points.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white/60">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

