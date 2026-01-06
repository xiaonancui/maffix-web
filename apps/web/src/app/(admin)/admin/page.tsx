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
          <span className="rounded-full bg-red-500/20 px-4 py-2 text-xs font-bold text-red-400 backdrop-blur-sm border border-red-500/30 dark:shadow-lg dark:shadow-red-500/20 flex items-center gap-2">
            <Shield className="h-3 w-3" />
            ADMIN MODE
          </span>
        }
      />

      {/* Statistics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-card p-6 dark:shadow-lg dark:shadow-red-500/20 border border-border hover:border-red-500/40 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 dark:shadow-lg dark:shadow-red-500/20 border border-border hover:border-red-500/40 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold text-foreground">
                {totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 dark:shadow-lg dark:shadow-red-500/20 border-2 border-red-500/50 hover:border-red-500/70 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-muted-foreground">
                Pending Verifications
              </p>
              <p className="text-2xl font-bold text-primary">
                {pendingVerifications}
              </p>
            </div>
          </div>
          <Link
            href="/admin/tasks"
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-red-400 transition-colors"
          >
            Review now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-lg bg-card p-6 dark:shadow-lg dark:shadow-red-500/20 border border-border hover:border-red-500/40 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-muted-foreground">Total Prizes</p>
              <p className="text-2xl font-bold text-foreground">
                {totalPrizes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/tasks"
            className="rounded-md border-2 border-primary bg-transparent p-4 text-center dark:shadow-lg dark:shadow-red-500/30 dark:hover:dark:shadow-red-500/50 transition-all hover:scale-105 dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:border-transparent"
          >
            <Clock className="h-8 w-8 text-primary mx-auto dark:text-primary-foreground" />
            <p className="mt-2 font-bold text-primary dark:text-primary-foreground">Verify Tasks</p>
          </Link>
          <Link
            href="/admin/users"
            className="rounded-md bg-card p-4 text-center border-2 border-border hover:border-red-500/50 hover:bg-secondary transition-all hover:scale-105"
          >
            <Users className="h-8 w-8 text-foreground mx-auto" />
            <p className="mt-2 font-bold text-foreground">Manage Users</p>
          </Link>
          <Link
            href="/admin/prizes"
            className="rounded-md border-2 border-primary bg-transparent p-4 text-center dark:shadow-lg dark:shadow-red-500/30 dark:hover:dark:shadow-red-500/50 transition-all hover:scale-105 dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:border-transparent"
          >
            <Gift className="h-8 w-8 text-primary mx-auto dark:text-primary-foreground" />
            <p className="mt-2 font-bold text-primary dark:text-primary-foreground">Manage Prizes</p>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md bg-card p-4 text-center border-2 border-border hover:border-red-500/50 hover:bg-secondary transition-all hover:scale-105"
          >
            <Users className="h-8 w-8 text-foreground mx-auto" />
            <p className="mt-2 font-bold text-foreground">User View</p>
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
          Recent Users
        </h2>
        <div className="overflow-hidden rounded-lg bg-card dark:shadow-lg dark:shadow-red-500/20 border border-border">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-red-900/20 border-b-2 border-red-500/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Diamonds
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-card">
              {recentUsers.map((user) => (
                <tr key={user.id} className="odd:bg-red-500/5 hover:bg-red-500/10 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-foreground">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold border dark:shadow-sm ${
                        user.role === 'ADMIN'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30 dark:shadow-red-500/20'
                          : user.role === 'ARTIST'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 dark:shadow-purple-500/20'
                          : 'bg-secondary text-muted-foreground border-border'
                      }`}
                    >
                      {user.role === 'ADMIN' && '● '}
                      {user.role === 'ARTIST' && '● '}
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    💎 {user.diamonds}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    ⭐ {user.points}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
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

