'use client'

import { useState, useEffect, ReactNode } from 'react'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminBreadcrumbs from './AdminBreadcrumbs'
import AdminFooter from './AdminFooter'

interface AdminLayoutClientProps {
  children: ReactNode
  userName: string
}

export default function AdminLayoutClient({ children, userName }: AdminLayoutClientProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarCollapsed')
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true')
    }
  }, [])

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev
      localStorage.setItem('adminSidebarCollapsed', String(newState))
      return newState
    })
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <AdminHeader userName={userName} onMobileMenuToggle={toggleMobileMenu} />

      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />

      {/* Main Content Area */}
      <div
        className={`pt-16 transition-all duration-300 flex-1 flex flex-col ${
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56'
        }`}
      >
        {/* Breadcrumbs */}
        <AdminBreadcrumbs />

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  )
}

