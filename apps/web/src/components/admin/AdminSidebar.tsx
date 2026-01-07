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
      { name: 'Verification', href: '/admin/tasks', icon: 'check-circle' },
    ],
  },
  {
    name: 'Releases',
    href: '/admin/releases',
    icon: 'music',
  },
  {
    name: 'Aura Zone',
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
    // For exact match on child items (like /admin/missions vs /admin/missions/new)
    if (href === '/admin/missions' || href === '/admin/tasks' || href === '/admin/releases') {
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
          className={`group/nav relative flex items-center gap-3 px-4 py-3 font-medium transition-all duration-300 ${
            isChild ? 'pl-12' : ''
          } ${
            active
              ? 'border-l-4 border-[#FF1F7D] bg-[#FF1F7D]/10 text-white shadow-[inset_4px_0_12px_rgba(255,31,125,0.3)]'
              : 'border-l-4 border-transparent text-white/60 hover:border-[#8B5CF6]/50 hover:bg-white/5 hover:text-white hover:translate-x-1'
          }`}
          title={isCollapsed ? item.name : undefined}
        >
          {/* Active glow indicator */}
          {active && (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-[#FF1F7D] to-transparent blur-sm" />
          )}

          <span className={`flex-shrink-0 transition-all duration-300 ${
            active ? 'text-[#FF1F7D] scale-110' : 'group-hover/nav:text-[#8B5CF6] group-hover/nav:scale-110'
          }`}>
            <NavIcon name={item.icon} label={item.name} />
          </span>
          {!isCollapsed && (
            <>
              <span className="flex-1 font-display text-sm font-bold tracking-wide">{item.name}</span>
              {item.badge && (
                <span className="rounded-full border border-[#FFC700]/40 bg-[#FFC700]/20 px-2 py-0.5 font-display text-xs font-black text-[#FFC700]">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-0' : ''} ${
                  active ? 'text-[#FF1F7D]' : 'text-white/40'
                }`}>
                  <NavIcon name={isExpanded ? 'angle-down' : 'angle-right'} />
                </span>
              )}
            </>
          )}
        </Link>

        {/* Inline submenu for expanded sidebar */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="border-l-2 border-[#8B5CF6]/20 bg-surface-raised/50">
            {item.children!.map((child) => (
              <NavItemComponent key={child.href} item={child} isChild />
            ))}
          </div>
        )}

        {/* Floating submenu for collapsed sidebar */}
        {hasChildren && isHovered && isCollapsed && (
          <div
            className="absolute left-full top-0 ml-2 min-w-[200px] rounded-2xl border-2 border-white/10 bg-gradient-to-br from-surface-card/95 to-surface-raised/95 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl z-50"
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Parent item title */}
            <div className="border-b-2 border-white/10 px-4 py-2 font-display text-xs font-black uppercase tracking-wider text-[#8B5CF6]">
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
                className={`group/submenu flex items-center gap-3 px-4 py-3 font-display text-sm font-bold transition-all duration-300 ${
                  isActive(child.href)
                    ? 'bg-[#8B5CF6]/20 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
              >
                <span className={`flex-shrink-0 transition-all duration-300 ${
                  isActive(child.href) ? 'text-[#8B5CF6]' : 'group-hover/submenu:text-[#8B5CF6] group-hover/submenu:scale-110'
                }`}>
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
          className={`group relative flex w-full items-center overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/10 to-transparent font-display text-sm font-bold uppercase tracking-wider text-[#FF1F7D] shadow-lg shadow-[#FF1F7D]/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/30 ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          }`}
          title="Sign Out"
        >
          <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <NavIcon name="sign-out-alt" label="Sign Out" />
          </span>
          {!isCollapsed && <span className="relative flex-1 text-left">Sign Out</span>}
        </button>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t-2 border-white/10 p-4">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/50">
              <p className="font-display font-bold text-white/70">Maffix Admin v2.0</p>
              <p className="mt-1 font-medium">© 2026 Maffix</p>
            </div>
            <button
              onClick={onToggle}
              className="group hidden rounded-xl p-2 text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-110 lg:block"
              aria-label="Collapse sidebar"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                <NavIcon name="angle-left" label="Collapse" />
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={onToggle}
            className="group hidden w-full rounded-xl p-2 text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-110 lg:block"
            aria-label="Expand sidebar"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <NavIcon name="angle-right" label="Expand" />
            </span>
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:fixed lg:top-16 lg:bottom-0 lg:z-50 lg:flex lg:flex-col lg:border-r-2 lg:border-white/10 lg:bg-gradient-to-b lg:from-surface-card/95 lg:to-surface-raised/95 lg:shadow-xl lg:shadow-black/20 lg:backdrop-blur-xl transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-56'
        }`}
      >
        {/* Ambient side glow */}
        <div className="pointer-events-none absolute inset-y-0 -right-20 w-40 bg-gradient-to-l from-transparent via-[#8B5CF6]/10 to-transparent blur-3xl" />
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-50 flex w-56 flex-col border-r-2 border-white/10 bg-gradient-to-b from-surface-card/95 to-surface-raised/95 shadow-xl shadow-black/20 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onMobileClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-110"
          aria-label="Close sidebar"
        >
          <NavIcon name="times" label="Close" />
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}

