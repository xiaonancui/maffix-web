# Role-Based Access Control - Implementation Task List

## Overview
This task list breaks down the RBAC implementation into actionable items, organized by priority and component.

---

## Phase 1: Visual Differentiation (HIGH PRIORITY)

### Task 1.1: Update Admin Panel Header Color
**Component:** `apps/web/src/app/(admin)/layout.tsx`
**Description:** Change admin panel header from gray to bright/highlighted color
**Changes:**
- Update `<nav>` background from `bg-gray-900` to `bg-gradient-to-r from-[#FF5656] to-[#ff3333]`
- Update border color from `border-gray-800` to `border-[#ff3333]`
- Ensure text contrast is maintained
- Test on different screen sizes

**Acceptance Criteria:**
- Admin panel header is visually distinct with bright red gradient
- Text is readable with good contrast
- Responsive design maintained

**Estimated Complexity:** Low
**Dependencies:** None

---

### Task 1.2: Update User Dashboard Header Color
**Component:** `apps/web/src/app/(dashboard)/layout.tsx`
**Description:** Change user dashboard header from gray to black
**Changes:**
- Update `<nav>` background from `bg-gray-900` to `bg-black`
- Maintain existing border color `border-gray-800`
- Ensure all navigation elements remain visible
- Test diamond balance display visibility

**Acceptance Criteria:**
- User dashboard header uses pure black background
- All UI elements remain visible and accessible
- Navigation links are clearly visible

**Estimated Complexity:** Low
**Dependencies:** None

---

### Task 1.3: Add Visual Role Indicator
**Component:** Both layouts
**Description:** Add subtle role indicator in header for clarity
**Changes:**
- Add role badge/indicator in admin panel (e.g., "ADMIN" badge)
- Ensure regular users don't see admin indicators
- Style consistently with overall design

**Acceptance Criteria:**
- Admin users see clear role indicator
- Regular users don't see admin-specific indicators
- Design is consistent and professional

**Estimated Complexity:** Low
**Dependencies:** Task 1.1, Task 1.2

---

## Phase 2: Role-Based UI Components (HIGH PRIORITY)

### Task 2.1: Create Role-Checking Utilities
**Component:** `apps/web/src/lib/rbac.ts` (new file)
**Description:** Create reusable utilities for role checking
**Changes:**
- Create `useUserRole()` hook for client components
- Create `getUserRole()` helper for server components
- Create `hasPermission()` function for granular checks
- Add TypeScript types for permissions

**Example:**
```typescript
// Client-side hook
export function useUserRole() {
  const { data: session } = useSession()
  return session?.user?.role || 'USER'
}

// Server-side helper
export async function getUserRole(session: Session | null) {
  return session?.user?.role || 'USER'
}

// Permission check
export function hasPermission(role: string, permission: string) {
  const permissions = {
    ADMIN: ['*'], // All permissions
    USER: ['view_own_data', 'complete_missions', 'gacha_pull'],
    ARTIST: ['view_own_data', 'complete_missions', 'gacha_pull'],
  }
  return permissions[role]?.includes(permission) || permissions[role]?.includes('*')
}
```

**Acceptance Criteria:**
- Utilities work in both client and server components
- Type-safe implementation
- Well-documented with JSDoc comments

**Estimated Complexity:** Medium
**Dependencies:** None

---

### Task 2.2: Update MissionsHeader Component
**Component:** `apps/web/src/components/dashboard/MissionsHeader.tsx`
**Description:** Ensure "Add Mission" button only shows for admins
**Changes:**
- Already implemented, verify it works correctly
- Ensure button is completely hidden (not just disabled) for non-admins
- Test with both USER and ADMIN roles

**Acceptance Criteria:**
- "Add Mission" button visible only to admins
- No console errors or warnings
- Button functions correctly for admins

**Estimated Complexity:** Low
**Dependencies:** Task 2.1

---

### Task 2.3: Update GachaHeader Component
**Component:** `apps/web/src/components/dashboard/GachaHeader.tsx`
**Description:** Ensure gacha settings button only shows for admins
**Changes:**
- Already implemented, verify it works correctly
- Ensure button is completely hidden for non-admins
- Test with both USER and ADMIN roles

**Acceptance Criteria:**
- Settings button visible only to admins
- No console errors or warnings
- Settings modal functions correctly for admins

**Estimated Complexity:** Low
**Dependencies:** Task 2.1

---

### Task 2.4: Remove Admin Links from User Navigation
**Component:** `apps/web/src/app/(dashboard)/layout.tsx`
**Description:** Ensure regular users don't see admin panel links
**Changes:**
- Check if "Back to User Dashboard" link in admin panel is appropriate
- Ensure no admin links appear in user dashboard navigation
- Add conditional "Admin Panel" link for admin users in user dashboard

**Acceptance Criteria:**
- Regular users see no admin-related links
- Admin users see link to admin panel from user dashboard
- Navigation is intuitive for both roles

**Estimated Complexity:** Low
**Dependencies:** Task 2.1

---

### Task 2.5: Add Admin Panel Link to User Dashboard (for Admins)
**Component:** `apps/web/src/app/(dashboard)/layout.tsx`
**Description:** Add conditional link to admin panel for admin users
**Changes:**
- Add admin panel link in user dashboard header (only visible to admins)
- Style consistently with existing navigation
- Position appropriately (e.g., next to profile icon)

**Acceptance Criteria:**
- Admin users see "Admin Panel" link in user dashboard
- Regular users don't see this link
- Link navigates to `/admin`

**Estimated Complexity:** Low
**Dependencies:** Task 2.1

---

## Phase 3: Enhanced Authorization (MEDIUM PRIORITY)

### Task 3.1: Create Authorization Middleware Helper
**Component:** `apps/web/src/lib/auth-helpers.ts` (new file)
**Description:** Create reusable authorization helpers for API routes
**Changes:**
- Create `requireAuth()` helper
- Create `requireAdmin()` helper
- Create `requireRole()` helper with role parameter
- Add consistent error responses

**Acceptance Criteria:**
- Helpers work consistently across all API routes
- Clear error messages
- Type-safe implementation

**Estimated Complexity:** Medium
**Dependencies:** None

---

### Task 3.2: Audit and Update Admin API Endpoints
**Component:** All files in `apps/web/src/app/api/admin/*`
**Description:** Ensure all admin endpoints use consistent authorization
**Changes:**
- Review all admin API endpoints
- Replace inline auth checks with helper functions
- Add consistent error handling
- Add request logging for admin actions

**Acceptance Criteria:**
- All admin endpoints use consistent authorization
- Unauthorized access returns appropriate error codes
- Admin actions are logged

**Estimated Complexity:** Medium
**Dependencies:** Task 3.1

---

## Phase 4: Testing & Verification (MEDIUM PRIORITY)

### Task 4.1: Manual Testing with Different Roles
**Description:** Comprehensive manual testing with all user roles

**Test Cases:**
1. Regular User - Black header, no admin access
2. Admin User - Red header in admin panel, black in dashboard, full access
3. Artist User - Same as regular user

**Acceptance Criteria:**
- All test cases pass
- No console errors
- Smooth user experience

**Estimated Complexity:** Medium
**Dependencies:** All previous tasks

---

### Task 4.2: Create Test Documentation
**Component:** `RBAC_TESTING.md` (new file)
**Description:** Document testing procedures and results

**Acceptance Criteria:**
- Clear testing documentation
- Easy for QA to follow
- Includes visual examples

**Estimated Complexity:** Low
**Dependencies:** Task 4.1

---

## Summary

### Task Count by Phase
- **Phase 1 (Visual):** 3 tasks
- **Phase 2 (UI Components):** 5 tasks
- **Phase 3 (Authorization):** 2 tasks
- **Phase 4 (Testing):** 2 tasks

**Total:** 12 required tasks

### Estimated Timeline
- **Phase 1:** 2-4 hours
- **Phase 2:** 4-6 hours
- **Phase 3:** 3-5 hours
- **Phase 4:** 2-3 hours

**Total Estimated Time:** 11-18 hours

### Priority Order
1. Task 1.1, 1.2 (Visual differentiation) - CRITICAL
2. Task 2.1 (Role utilities) - HIGH
3. Task 2.2, 2.3, 2.4, 2.5 (UI components) - HIGH
4. Task 3.1, 3.2 (Authorization) - MEDIUM
5. Task 4.1, 4.2 (Testing) - MEDIUM


