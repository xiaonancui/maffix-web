/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * This module provides utilities for checking user roles and permissions
 * across both client and server components.
 */

import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'

// Role types
export type Role = 'USER' | 'ADMIN' | 'ARTIST'

// Permission types
export type Permission =
  | 'view_own_data'
  | 'complete_missions'
  | 'gacha_pull'
  | 'purchase_items'
  | 'manage_profile'
  | 'view_admin_panel'
  | 'manage_users'
  | 'verify_tasks'
  | 'manage_prizes'
  | 'manage_merchandise'
  | 'manage_missions'
  | 'view_analytics'
  | '*' // All permissions

// Permission matrix: defines what each role can do
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  USER: [
    'view_own_data',
    'complete_missions',
    'gacha_pull',
    'purchase_items',
    'manage_profile',
  ],
  ARTIST: [
    'view_own_data',
    'complete_missions',
    'gacha_pull',
    'purchase_items',
    'manage_profile',
  ],
  ADMIN: ['*'], // Admins have all permissions
}

/**
 * Client-side hook to get the current user's role
 * Use this in client components
 * 
 * @returns The user's role or 'USER' as default
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const role = useUserRole()
 *   
 *   if (role === 'ADMIN') {
 *     return <AdminButton />
 *   }
 *   return <UserButton />
 * }
 * ```
 */
export function useUserRole(): Role {
  const { data: session } = useSession()
  return (session?.user?.role as Role) || 'USER'
}

/**
 * Client-side hook to check if user has a specific permission
 * Use this in client components
 * 
 * @param permission - The permission to check
 * @returns true if user has the permission, false otherwise
 * 
 * @example
 * ```tsx
 * function AdminButton() {
 *   const canManageUsers = useHasPermission('manage_users')
 *   
 *   if (!canManageUsers) return null
 *   
 *   return <button>Manage Users</button>
 * }
 * ```
 */
export function useHasPermission(permission: Permission): boolean {
  const role = useUserRole()
  return hasPermission(role, permission)
}

/**
 * Server-side helper to get user role from session
 * Use this in server components and API routes
 * 
 * @param session - The NextAuth session object
 * @returns The user's role or 'USER' as default
 * 
 * @example
 * ```tsx
 * async function ServerComponent() {
 *   const session = await getServerSession(authOptions)
 *   const role = getUserRole(session)
 *   
 *   if (role === 'ADMIN') {
 *     return <AdminDashboard />
 *   }
 *   return <UserDashboard />
 * }
 * ```
 */
export function getUserRole(session: Session | null): Role {
  return (session?.user?.role as Role) || 'USER'
}

/**
 * Check if a role has a specific permission
 * Works in both client and server contexts
 * 
 * @param role - The user's role
 * @param permission - The permission to check
 * @returns true if the role has the permission, false otherwise
 * 
 * @example
 * ```tsx
 * const canVerifyTasks = hasPermission('ADMIN', 'verify_tasks') // true
 * const canManageUsers = hasPermission('USER', 'manage_users') // false
 * ```
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || []
  
  // Check for wildcard permission (admin has all)
  if (permissions.includes('*')) {
    return true
  }
  
  return permissions.includes(permission)
}

/**
 * Check if user is an admin
 * Convenience function for common check
 *
 * @param session - The NextAuth session object
 * @returns true if user is an admin, false otherwise
 *
 * @example
 * ```tsx
 * const session = await getServerSession(authOptions)
 * if (isAdmin(session)) {
 *   // Show admin features
 * }
 * ```
 */
export function isAdmin(session: Session | null): boolean {
  return getUserRole(session) === 'ADMIN'
}

/**
 * Check if user has admin access
 * Convenience function that accepts role string
 *
 * @param role - The user's role string
 * @returns true if user has admin access, false otherwise
 *
 * @example
 * ```tsx
 * const hasAccess = hasAdminAccess(session.user.role || 'USER')
 * ```
 */
export function hasAdminAccess(role: Role): boolean {
  return role === 'ADMIN'
}

