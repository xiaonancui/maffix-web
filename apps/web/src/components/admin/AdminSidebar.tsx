'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface NavItem {
  name: string
  href: string
  icon: string
  badge?: number
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: '📊',
  },
  {
    name: 'Task Verification',
    href: '/admin/tasks',
    icon: '✓',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: '👥',
  },
  {
    name: 'Missions',
    href: '/admin/missions',
    icon: '🎯',
    children: [
      { name: 'All Missions', href: '/admin/missions', icon: '📋' },
      { name: 'Create New', href: '/admin/missions/new', icon: '➕' },
    ],
  },
  {
    name: 'Releases',
    href: '/admin/releases',
    icon: '🎵',
  },
  {
    name: 'Gacha',
    href: '/admin/gacha',
    icon: '🎰',
  },
  {
    name: 'Store',
    href: '/admin/store',
    icon: '🛍️',
    children: [
      { name: 'Merchandise', href: '/admin/merchandise', icon: '👕' },
      { name: 'Premium Packs', href: '/admin/packs', icon: '📦' },
      { name: 'Store Settings', href: '/admin/store/settings', icon: '⚙️' },
    ],
  },
  {
    name: 'Prizes',
    href: '/admin/prizes',
    icon: '🎁',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
  },
]

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

export default function AdminSidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Auto-expand parent items based on current path
  useEffect(() => {
    const expanded: string[] = []
    navigationItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) => pathname === child.href)
        if (isChildActive) {
          expanded.push(item.name)
        }
      }
    })
    setExpandedItems(expanded)
  }, [pathname])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const NavItemComponent = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
    const active = isActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)

    return (
      <div>
        <Link
          href={item.href}
          onClick={(e) => {
            if (hasChildren && !isCollapsed) {
              e.preventDefault()
              toggleExpanded(item.name)
            }
            if (isMobileOpen) {
              onMobileClose()
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
            isChild ? 'pl-12' : ''
          } ${
            active
              ? 'bg-red-500/20 text-white border-l-4 border-red-500'
              : 'text-gray-300 hover:bg-red-500/10 hover:text-white border-l-4 border-transparent'
          }`}
          title={isCollapsed ? item.name : undefined}
        >
          <span className="text-xl flex-shrink-0">{item.icon}</span>
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
              )}
            </>
          )}
        </Link>
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="bg-black/20">
            {item.children!.map((child) => (
              <NavItemComponent key={child.href} item={child} isChild />
            ))}
          </div>
        )}
      </div>
    )
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-red-500/20 px-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <span className="text-lg font-bold text-white">Maffix</span>
          </div>
        ) : (
          <span className="text-xl">🛡️</span>
        )}
        <button
          onClick={onToggle}
          className="hidden lg:block rounded-md p-2 text-gray-400 hover:bg-red-500/10 hover:text-white transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((item) => (
          <NavItemComponent key={item.href} item={item} />
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="border-t border-red-500/20 p-4">
          <div className="text-xs text-gray-500">
            <p className="font-semibold text-gray-400">Maffix Admin v1.0</p>
            <p className="mt-1">© 2025 Maffix</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col lg:border-r lg:border-red-500/20 lg:bg-[#0a0a0a] lg:pt-16 transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-red-500/20 bg-[#0a0a0a] pt-16 transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onMobileClose}
          className="absolute right-4 top-4 rounded-md p-2 text-gray-400 hover:bg-red-500/10 hover:text-white"
          aria-label="Close sidebar"
        >
          ✕
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}

