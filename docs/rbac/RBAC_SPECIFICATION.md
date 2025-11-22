# Role-Based Access Control (RBAC) Specification

## Executive Summary

This document outlines the implementation plan for enhancing the existing role-based access control system in the Maffix platform. The goal is to create distinct user experiences for regular users and administrators, with visual differentiation and appropriate feature access based on user roles.

## Current State Analysis

### Existing Authentication & Authorization

**Authentication System:**
- NextAuth.js with JWT strategy
- Multiple providers: Credentials, TikTok OAuth
- Session management with JWT tokens
- User roles stored in JWT and session

**User Roles (Existing):**
- `USER` - Regular users (default)
- `ADMIN` - Administrators
- `ARTIST` - Artist accounts (defined but not fully implemented)

**Current Authorization:**
- Middleware protection for `/admin/*` routes (requires ADMIN role)
- API route protection with session checks
- Admin layout enforces ADMIN role check
- Dashboard layout accessible to all authenticated users

### Existing Admin Features

**Admin Panel (`/admin/*`):**
1. **Dashboard** (`/admin/page.tsx`)
   - System statistics (users, tasks, prizes, gacha pulls)
   - Recent users list
   - Quick action links

2. **Task Verification** (`/admin/tasks/page.tsx`)
   - View pending task submissions
   - Approve/reject user task completions
   - Manual verification interface

3. **User Management** (`/admin/users/*`)
   - View all users
   - Manage user accounts

4. **Prize Management** (`/admin/prizes/*`)
   - Manage gacha prizes
   - Configure prize rarities and availability

**Admin API Endpoints:**
- `/api/admin/missions/*` - Mission CRUD operations
- `/api/admin/merchandise/*` - Merchandise management
- `/api/admin/packs/*` - Premium pack management
- `/api/admin/tasks/[userTaskId]/verify` - Task verification

### User-Facing Features

**Regular User Pages (`/dashboard/*`):**
1. **Dashboard** - Personal stats, mission progress, gacha history
2. **Missions** - Browse and complete TikTok missions
3. **Gacha** - Draw prizes using diamonds
4. **Store** - Purchase merchandise (unlocked after first 10x draw)
5. **Profile** - User profile and TikTok linking
6. **Prizes** - View won prizes
7. **Transactions** - Transaction history
8. **Cart/Checkout** - Shopping cart and checkout
9. **Orders** - Order history

**User API Endpoints:**
- `/api/missions/*` - Mission browsing and submission
- `/api/gacha/*` - Gacha pulls
- `/api/cart/*` - Shopping cart
- `/api/orders/*` - Order management
- `/api/profile/*` - Profile updates

### Current UI/UX

**Admin Panel Header:**
- Background: `bg-gray-900` (dark gray)
- Border: `border-gray-800`
- Logo: "🛡️ Maffix Admin"
- Navigation: Dashboard, Task Verification, Users, Prizes
- Link to user dashboard

**User Dashboard Header:**
- Background: `bg-gray-900` (dark gray)
- Border: `border-gray-800`
- Logo: "Maffix"
- Navigation: Dashboard, Releases, Missions, Gacha, Store (conditional)
- Diamond balance display
- Profile icon

## Requirements Analysis

### 1. User Account Creation ✅
**Status:** Already implemented
- Registration endpoint exists (`/api/auth/register`)
- Default role is `USER`
- Seed scripts create test users with different roles

### 2. Role-Based Access Control ✅
**Status:** Partially implemented, needs enhancement
- Middleware protects admin routes
- API endpoints check for ADMIN role
- Need to add more granular permissions

### 3. Visual Differentiation by Role ❌
**Status:** Not implemented
- **Requirement:** Admin header should be bright/highlighted color
- **Requirement:** Regular user header should be black
- **Current:** Both use `bg-gray-900`

### 4. Dynamic UI Based on Role ⚠️
**Status:** Partially implemented
- Admin-specific buttons exist in some components (MissionsHeader, GachaHeader)
- Need consistent role-based UI across all pages
- Need to hide admin features from regular users

### 5. Backend Interface for Regular Users ❌
**Status:** Not implemented
- **Requirement:** Regular users should have access to a backend interface
- **Requirement:** Interface should show only user-appropriate features
- **Current:** Only admin panel exists, regular users only see frontend dashboard

## Proposed Architecture

### Role-Based UI Rendering Strategy

**Approach:** Unified Backend Interface with Role-Based Views

Instead of creating separate interfaces, we'll enhance the existing dashboard to serve as a "backend" for all authenticated users, with role-based feature visibility:

1. **Admin Users** - Full access to:
   - Admin panel (`/admin/*`) with bright header (e.g., `bg-gradient-to-r from-[#FF5656] to-[#ff3333]`)
   - All user features
   - System management tools
   - User management
   - Content moderation

2. **Regular Users** - Access to:
   - User dashboard (`/dashboard/*`) with black header (`bg-black`)
   - Personal data management
   - Mission participation
   - Gacha system
   - Store (after 10x draw)
   - Profile management
   - No admin features visible

### Visual Differentiation Implementation

**Admin Panel Header:**
```tsx
// Current: bg-gray-900
// Proposed: bg-gradient-to-r from-[#FF5656] to-[#ff3333] or bg-[#FF5656]
<nav className="bg-gradient-to-r from-[#FF5656] to-[#ff3333] border-b border-[#ff3333] shadow-lg">
```

**User Dashboard Header:**
```tsx
// Current: bg-gray-900
// Proposed: bg-black
<nav className="bg-black border-b border-gray-800 shadow-lg">
```

### Permission Matrix

| Feature | USER | ADMIN | ARTIST |
|---------|------|-------|--------|
| **Dashboard Access** | ✅ | ✅ | ✅ |
| **View Own Profile** | ✅ | ✅ | ✅ |
| **Edit Own Profile** | ✅ | ✅ | ✅ |
| **Complete Missions** | ✅ | ✅ | ✅ |
| **Gacha Pulls** | ✅ | ✅ | ✅ |
| **Store Access** | ✅ (after 10x) | ✅ | ✅ |
| **View Own Transactions** | ✅ | ✅ | ✅ |
| **View Own Orders** | ✅ | ✅ | ✅ |
| **Admin Panel Access** | ❌ | ✅ | ❌ |
| **View All Users** | ❌ | ✅ | ❌ |
| **Manage Users** | ❌ | ✅ | ❌ |
| **Create/Edit Missions** | ❌ | ✅ | ❌ |
| **Verify Tasks** | ❌ | ✅ | ❌ |
| **Manage Prizes** | ❌ | ✅ | ❌ |
| **Manage Merchandise** | ❌ | ✅ | ❌ |
| **View System Stats** | ❌ | ✅ | ❌ |
| **Manage Premium Packs** | ❌ | ✅ | ❌ |

### Database Schema Changes

**No schema changes required** - The existing `User.role` enum already supports USER, ADMIN, and ARTIST roles.

### API Endpoint Protection

All admin API endpoints already implement role checking:
```typescript
const session = await getServerSession(authOptions)
if (!session || session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Enhancement needed:** Add consistent error messages and logging for unauthorized access attempts.

### Security Considerations

1. **Server-Side Validation:** All role checks must happen server-side
2. **JWT Token Security:** Role stored in JWT, validated on each request
3. **Middleware Protection:** Continue using Next.js middleware for route protection
4. **API Authorization:** Every admin API endpoint must verify role
5. **Client-Side Hiding:** UI elements hidden based on role (defense in depth)
6. **Audit Logging:** Log admin actions for security monitoring (future enhancement)

## Implementation Plan

### Phase 1: Visual Differentiation (Priority: HIGH)
**Goal:** Implement distinct header colors for admin vs. regular users

**Changes:**
1. Update admin layout header to use bright color
2. Update user dashboard header to use black background
3. Ensure consistent styling across all pages

### Phase 2: Role-Based UI Components (Priority: HIGH)
**Goal:** Hide admin-specific features from regular users

**Changes:**
1. Create reusable role-checking hooks/utilities
2. Update components to conditionally render admin features
3. Remove admin buttons from user-facing pages for non-admins

### Phase 3: Enhanced Authorization (Priority: MEDIUM)
**Goal:** Strengthen API endpoint protection

**Changes:**
1. Add consistent authorization middleware
2. Improve error messages
3. Add rate limiting for admin endpoints

### Phase 4: Testing & Documentation (Priority: MEDIUM)
**Goal:** Ensure system works correctly

**Changes:**
1. Test with different user roles
2. Verify all protected routes
3. Document role-based features

## Testing Strategy

### Test Accounts
- `user@maffix.com` / `password123` - Regular user
- `admin@maffix.com` / `password123` - Admin user
- `artist@maffix.com` / `password123` - Artist user

### Test Scenarios
1. **Regular User Login:**
   - Should see black header
   - Should NOT see admin panel link
   - Should NOT access `/admin/*` routes
   - Should NOT see "Add Mission" buttons

2. **Admin User Login:**
   - Should see bright/highlighted header in admin panel
   - Should see black header in user dashboard
   - Should access both `/admin/*` and `/dashboard/*` routes
   - Should see admin-specific buttons and features

3. **API Authorization:**
   - Regular users should get 401/403 on admin API calls
   - Admins should successfully access admin APIs

4. **Navigation:**
   - Regular users redirected from `/admin` to `/dashboard`
   - Admins can navigate between admin panel and user dashboard

## Success Criteria

✅ Admin panel header uses bright/highlighted color (e.g., red gradient)
✅ User dashboard header uses black background
✅ Regular users cannot access admin panel
✅ Regular users cannot see admin-specific UI elements
✅ Admin users can access both admin panel and user dashboard
✅ All API endpoints properly enforce role-based authorization
✅ Visual distinction is immediately clear when viewing the interface
✅ No breaking changes to existing functionality
✅ Backward compatible with existing user accounts


