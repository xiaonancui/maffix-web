# RBAC Quick Reference Guide

## 🚀 Quick Start

### Test Accounts
```
Regular User:  user@maffix.com    / password123
Admin User:    admin@maffix.com   / password123
Artist User:   artist@maffix.com  / password123
```

### URLs
```
User Dashboard:  http://localhost:3000/dashboard
Admin Panel:     http://localhost:3000/admin
Login:           http://localhost:3000/auth/signin
```

---

## 🎨 Visual Differences

| Interface | Header Color | Badge | Admin Button |
|-----------|--------------|-------|--------------|
| Admin Panel | Red Gradient (#FF5656 → #ff3333) | "ADMIN" | N/A |
| User Dashboard (Regular) | Black (#000000) | None | None |
| User Dashboard (Admin) | Black (#000000) | None | "Admin" (Red) |

---

## 🔐 Authorization Helpers

### Client-Side (React Components)
```typescript
import { useUserRole, useHasPermission } from '@/lib/rbac'

// Get user role
const role = useUserRole() // 'USER' | 'ADMIN' | 'ARTIST'

// Check permission
const canManageUsers = useHasPermission('manage_users')

// Simple admin check
const isAdmin = role === 'ADMIN'
```

### Server-Side (API Routes)
```typescript
import { requireAuth, requireAdmin, requireRole } from '@/lib/auth-helpers'

// Require authentication
const auth = await requireAuth()
if (auth instanceof NextResponse) return auth
const { session } = auth

// Require admin role
const auth = await requireAdmin()
if (auth instanceof NextResponse) return auth
const { session } = auth

// Require specific roles
const auth = await requireRole(['ADMIN', 'ARTIST'])
if (auth instanceof NextResponse) return auth
const { session } = auth
```

---

## 📁 Key Files

### Authorization
- `apps/web/src/lib/auth-helpers.ts` - Server-side auth helpers
- `apps/web/src/lib/rbac.ts` - Client-side RBAC utilities
- `apps/web/src/middleware.ts` - Route protection middleware

### Layouts
- `apps/web/src/app/(admin)/layout.tsx` - Admin panel layout (red header)
- `apps/web/src/app/(dashboard)/layout.tsx` - User dashboard layout (black header)

### Components
- `apps/web/src/components/dashboard/MissionsHeader.tsx` - Missions header with admin button
- `apps/web/src/components/dashboard/GachaHeader.tsx` - Gacha header with settings button
- `apps/web/src/components/dashboard/MobileMenu.tsx` - Mobile menu with admin link

### API Routes (All Protected)
- `apps/web/src/app/api/admin/missions/**` - Mission management (CRUD)
- `apps/web/src/app/api/admin/releases/**` - Release/Video management (CRUD)
- `apps/web/src/app/api/admin/gacha/**` - Gacha system management (stats, items)
- `apps/web/src/app/api/admin/merchandise/**` - Merchandise management (CRUD, variants)
- `apps/web/src/app/api/admin/packs/**` - Premium packs management (CRUD)
- `apps/web/src/app/api/admin/users/**` - User management (list, detail, update)
- `apps/web/src/app/api/admin/prizes/**` - Prize management (CRUD)
- `apps/web/src/app/api/admin/analytics/**` - Analytics data (overview, trends)
- `apps/web/src/app/api/admin/tasks/**` - Task verification

---

## 🧪 Testing

### Run Automated Tests
```bash
./scripts/test-rbac.sh
```

### Manual Testing Steps
1. **Test as Regular User:**
   - Login: `user@maffix.com` / `password123`
   - Verify: Black header, no admin features
   - Try: Navigate to `/admin` (should be blocked)

2. **Test as Admin:**
   - Login: `admin@maffix.com` / `password123`
   - Verify: Red header in admin panel, admin button in dashboard
   - Try: Access all admin features

3. **Test API Protection:**
   - Open DevTools → Network tab
   - Try calling admin APIs as regular user
   - Verify: 403 Forbidden responses

---

## 🔍 Troubleshooting

### Issue: Admin features not showing
**Solution:** Clear browser cache and cookies, then log in again

### Issue: API returns 401 even when logged in
**Solution:** Check session cookie is being sent with requests

### Issue: Middleware not blocking admin routes
**Solution:** Verify `apps/web/src/middleware.ts` is configured correctly

### Issue: Visual changes not appearing
**Solution:** Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

---

## 📊 Permission Matrix

| Permission | USER | ADMIN | ARTIST |
|------------|------|-------|--------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Missions | ✅ | ✅ | ✅ |
| Manage Missions | ❌ | ✅ | ❌ |
| Manage Releases | ❌ | ✅ | ❌ |
| View Gacha | ✅ | ✅ | ✅ |
| Manage Gacha | ❌ | ✅ | ❌ |
| View Store | ✅ | ✅ | ✅ |
| Manage Merchandise | ❌ | ✅ | ❌ |
| Manage Premium Packs | ❌ | ✅ | ❌ |
| View Admin Panel | ❌ | ✅ | ❌ |
| Manage Users | ❌ | ✅ | ❌ |
| Manage Prizes | ❌ | ✅ | ❌ |
| View Analytics | ❌ | ✅ | ❌ |
| Verify Tasks | ❌ | ✅ | ❌ |

---

## 🎯 Common Use Cases

### Hide Button for Regular Users
```typescript
import { useUserRole } from '@/lib/rbac'

export function MyComponent() {
  const role = useUserRole()
  const isAdmin = role === 'ADMIN'
  
  return (
    <div>
      {isAdmin && (
        <button>Admin Only Button</button>
      )}
    </div>
  )
}
```

### Protect API Route
```typescript
import { requireAdmin } from '@/lib/auth-helpers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Require admin authentication
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  
  // Admin-only logic here
  // ...
}
```

### Check Multiple Roles
```typescript
import { requireRole } from '@/lib/auth-helpers'

export async function GET(request: Request) {
  // Allow both ADMIN and ARTIST
  const auth = await requireRole(['ADMIN', 'ARTIST'])
  if (auth instanceof NextResponse) return auth
  
  const { session } = auth
  // Logic here
}
```

---

## 📚 Documentation

- **Full Specification:** `docs/rbac/RBAC_SPECIFICATION.md`
- **Task List:** `docs/rbac/RBAC_TASK_LIST.md`
- **Testing Guide:** `docs/rbac/RBAC_TESTING.md`
- **Test Results:** `docs/rbac/RBAC_TEST_RESULTS.md`
- **Visual Guide:** `docs/rbac/RBAC_VISUAL_GUIDE.md`
- **Presentation:** `docs/rbac/RBAC_PRESENTATION.md`

---

## ✅ Checklist for New Features

When adding new admin features:

- [ ] Use `useUserRole()` or `useHasPermission()` in components
- [ ] Use `requireAdmin()` or `requireRole()` in API routes
- [ ] Add visual indicators for admin-only features
- [ ] Test with both regular user and admin accounts
- [ ] Update permission matrix if needed
- [ ] Document in relevant files


