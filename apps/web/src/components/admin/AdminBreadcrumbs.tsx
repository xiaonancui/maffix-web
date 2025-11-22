'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Breadcrumb {
  name: string
  href: string
}

const routeNameMap: Record<string, string> = {
  admin: 'Dashboard',
  tasks: 'Task Verification',
  users: 'Users',
  missions: 'Missions',
  releases: 'Releases',
  gacha: 'Gacha',
  store: 'Store',
  merchandise: 'Merchandise',
  packs: 'Premium Packs',
  prizes: 'Prizes',
  settings: 'Settings',
  new: 'Create New',
  edit: 'Edit',
}

export default function AdminBreadcrumbs() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): Breadcrumb[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: Breadcrumb[] = []

    // Always start with Home
    breadcrumbs.push({ name: 'Home', href: '/admin' })

    // Build breadcrumbs from path segments
    let currentPath = ''
    for (let i = 0; i < paths.length; i++) {
      const segment = paths[i]
      currentPath += `/${segment}`

      // Skip 'admin' as it's already represented by 'Home'
      if (segment === 'admin') continue

      // Get display name from map or capitalize segment
      const name = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

      breadcrumbs.push({
        name,
        href: currentPath,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs on the main dashboard
  if (pathname === '/admin') {
    return null
  }

  return (
    <nav className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 border-b border-red-500/10">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={breadcrumb.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-gray-600">/</span>}
            {isLast ? (
              <span className="font-semibold text-white">{breadcrumb.name}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="hover:text-white transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

