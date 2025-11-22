'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { NavIcon } from '@/components/icons/Icon'

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
    icon: 'chart-bar',
  },
  {
    name: 'Task Verification',
    href: '/admin/tasks',
    icon: 'check-circle',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: 'users',
  },
  {
    name: 'Missions',
    href: '/admin/missions',
    icon: 'bullseye',
    children: [
      { name: 'All Missions', href: '/admin/missions', icon: 'list' },
      { name: 'Create New', href: '/admin/missions/new', icon: 'plus' },
    ],
  },
  {
    name: 'Releases',
    href: '/admin/releases',
    icon: 'music',
  },
  {
    name: 'Gacha',
    href: '/admin/gacha',
    icon: 'dice',
  },
  {
    name: 'Store',
    href: '/admin/store',
    icon: 'store',
    children: [
      { name: 'Merchandise', href: '/admin/merchandise', icon: 'tshirt' },
      { name: 'Premium Packs', href: '/admin/packs', icon: 'box' },
      { name: 'Store Settings', href: '/admin/store/settings', icon: 'cog' },
    ],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: 'cog',
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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
    const isHovered = hoveredItem === item.name

    return (
      <div
        className="relative"
        onMouseEnter={() => {
          if (hasChildren && isCollapsed) {
            setHoveredItem(item.name)
          }
        }}
        onMouseLeave={() => {
          if (hasChildren && isCollapsed) {
            setHoveredItem(null)
          }
        }}
      >
        <Link
          href={item.href}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault()
              if (isCollapsed) {
                // Toggle hover menu in collapsed state
                setHoveredItem(isHovered ? null : item.name)
              } else {
                // Toggle expanded state in normal state
                toggleExpanded(item.name)
              }
            }
            if (isMobileOpen) {
              onMobileClose()
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
            isChild ? 'pl-12' : ''
          } ${
            active
              ? 'bg-primary/20 text-foreground border-l-4 border-primary'
              : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground border-l-4 border-transparent'
          }`}
          title={isCollapsed ? item.name : undefined}
        >
          <span className="flex-shrink-0">
            <NavIcon name={item.icon} label={item.name} />
          </span>
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <span className="text-muted-foreground">
                  <NavIcon name={isExpanded ? 'angle-down' : 'angle-right'} />
                </span>
              )}
            </>
          )}
        </Link>

        {/* Inline submenu for expanded sidebar */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="bg-secondary/50">
            {item.children!.map((child) => (
              <NavItemComponent key={child.href} item={child} isChild />
            ))}
          </div>
        )}

        {/* Floating submenu for collapsed sidebar */}
        {hasChildren && isHovered && isCollapsed && (
          <div
            className="absolute left-full top-0 ml-2 min-w-[200px] rounded-lg bg-card dark:shadow-2xl border border-border py-2 z-50"
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Parent item title */}
            <div className="px-4 py-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-border">
              {item.name}
            </div>
            {/* Child items */}
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => {
                  setHoveredItem(null)
                  if (isMobileOpen) {
                    onMobileClose()
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
                  isActive(child.href)
                    ? 'bg-primary/20 text-foreground'
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                <span className="flex-shrink-0">
                  <NavIcon name={child.icon} label={child.name} />
                </span>
                <span>{child.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((item) => (
          <NavItemComponent key={item.href} item={item} />
        ))}
      </nav>

      {/* Sign Out Button */}
      <div className="px-4 py-3">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className={`flex items-center w-full text-sm font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive/90 transition-all rounded-lg border border-border hover:border-destructive/40 ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          }`}
          title="Sign Out"
        >
          <span className="flex-shrink-0">
            <NavIcon name="sign-out-alt" label="Sign Out" />
          </span>
          {!isCollapsed && <span className="flex-1 text-left">Sign Out</span>}
        </button>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-border p-4">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold">Maffix Admin v1.0</p>
              <p className="mt-1">© 2025 Maffix</p>
            </div>
            <button
              onClick={onToggle}
              className="hidden lg:block rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Collapse sidebar"
            >
              <NavIcon name="angle-left" label="Collapse" />
            </button>
          </div>
        ) : (
          <button
            onClick={onToggle}
            className="hidden lg:block w-full rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Expand sidebar"
          >
            <NavIcon name="angle-right" label="Expand" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:fixed lg:top-16 lg:bottom-0 lg:z-50 lg:flex lg:flex-col lg:border-r lg:border-border lg:bg-background transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-56'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-50 flex w-56 flex-col border-r border-border bg-background transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onMobileClose}
          className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Close sidebar"
        >
          <NavIcon name="times" label="Close" />
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}

