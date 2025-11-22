# Admin Panel Fixes - Task Plan

**Date:** 2025-11-21  
**Status:** ⏳ AWAITING CONFIRMATION  
**Total Tasks:** 7 tasks (1 parent + 7 subtasks)

---

## 📋 Task Overview

| # | Issue | Priority | Time | Status |
|---|-------|----------|------|--------|
| 7 | Fix Sidebar Store Route Links | 🔴 HIGH | 5 min | ⏳ Ready |
| 3 | Remove "Add Release" Button | 🔴 HIGH | 5 min | ⏳ Ready |
| 4 | Remove "Add Mission" Button | 🔴 HIGH | 5 min | ⏳ Ready |
| 1 | Fix Sidebar Logo Alignment | 🟡 MEDIUM | 5 min | ⏳ Ready |
| 2 | Remove "Maffix Admin" Text | 🟢 LOW | 2 min | ⏳ Ready |
| 6 | Verify Releases Page Buttons | 🟢 LOW | 3 min | ⏳ Ready |
| 5 | Fix User Actions Error | 🔴 HIGH | 30 min | ⚠️ Needs Testing |

**Total Estimated Time:** 55 minutes

---

## 🎯 Execution Plan

### **Phase 1: Quick Fixes (15 minutes)** - HIGH PRIORITY

#### **Task 7: Fix Sidebar Store Route Links** 🔴
**Priority:** HIGH  
**Time:** 5 minutes  
**Status:** Ready to execute

**Problem:**
- Sidebar links to `/admin/store/merchandise` → 404
- Sidebar links to `/admin/store/packs` → 404
- Actual pages exist at `/admin/merchandise` and `/admin/packs`

**Solution:**
Update `apps/web/src/components/admin/AdminSidebar.tsx` (lines 55-56):
```tsx
// CHANGE FROM:
{ name: 'Merchandise', href: '/admin/store/merchandise', icon: '👕' },
{ name: 'Premium Packs', href: '/admin/store/packs', icon: '📦' },

// CHANGE TO:
{ name: 'Merchandise', href: '/admin/merchandise', icon: '👕' },
{ name: 'Premium Packs', href: '/admin/packs', icon: '📦' },
```

**Files to Modify:**
- `apps/web/src/components/admin/AdminSidebar.tsx`

---

#### **Task 3: Remove "Add Release" Button** 🔴
**Priority:** HIGH  
**Time:** 5 minutes  
**Status:** Ready to execute

**Problem:**
- "Add Release" button still visible in user dashboard `/releases` page
- Button shows when user is admin
- Should only be in admin panel, not user-facing pages

**Solution:**
Remove from `apps/web/src/components/dashboard/ReleasesClient.tsx` (lines 135-145):
```tsx
// REMOVE THIS ENTIRE BLOCK:
{isAdmin && (
  <button
    onClick={() => setShowAddModal(true)}
    className="flex items-center gap-2 rounded-lg bg-[#FF5656] px-4 py-2 text-white hover:bg-[#ff3333] transition-colors"
  >
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    Add Release
  </button>
)}
```

**Files to Modify:**
- `apps/web/src/components/dashboard/ReleasesClient.tsx`

---

#### **Task 4: Remove "Add Mission" Button** 🔴
**Priority:** HIGH  
**Time:** 5 minutes  
**Status:** Ready to execute

**Problem:**
- "Add Mission" button still visible in user dashboard `/missions` page
- Button shows when user is admin
- Should only be in admin panel, not user-facing pages

**Solution:**
Remove from `apps/web/src/components/dashboard/MissionsHeader.tsx` (lines 48-58):
```tsx
// REMOVE THIS ENTIRE BLOCK:
{isAdmin && (
  <button
    onClick={() => setShowAddModal(true)}
    className="flex items-center gap-2 rounded-lg bg-[#FF5656] px-4 py-2 text-white hover:bg-[#ff3333] transition-colors"
  >
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    Add Mission
  </button>
)}
```

**Files to Modify:**
- `apps/web/src/components/dashboard/MissionsHeader.tsx`

---

### **Phase 2: UI Improvements (10 minutes)** - MEDIUM/LOW PRIORITY

#### **Task 1: Fix Sidebar Logo Alignment** 🟡
**Priority:** MEDIUM  
**Time:** 5 minutes  
**Status:** Ready to execute

**Problem:**
- Sidebar logo area not aligned with right side header
- Header height is 64px (`h-16`), sidebar header has variable height

**Solution:**
Update `apps/web/src/components/admin/AdminSidebar.tsx` (line 173):
```tsx
// CHANGE FROM:
<div className="flex items-center justify-between border-b border-red-500/20 p-4">

// CHANGE TO:
<div className="flex h-16 items-center justify-between border-b border-red-500/20 px-4">
```

**Files to Modify:**
- `apps/web/src/components/admin/AdminSidebar.tsx`

---

#### **Task 2: Remove "Maffix Admin" Text** 🟢
**Priority:** LOW  
**Time:** 2 minutes  
**Status:** Ready to execute

**Problem:**
- "Maffix Admin" text visible in header when sidebar collapsed
- User wants only emoji, no text

**Solution:**
Update `apps/web/src/components/admin/AdminHeader.tsx` (lines 40-47):
```tsx
// CHANGE FROM:
<Link href="/admin" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
  <span>🛡️</span>
  <span className="hidden sm:inline">Maffix Admin</span>
</Link>

// CHANGE TO:
<Link href="/admin" className="flex items-center text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
  <span>🛡️</span>
</Link>
```

**Files to Modify:**
- `apps/web/src/components/admin/AdminHeader.tsx`

---

#### **Task 6: Verify Releases Page Buttons** 🟢
**Priority:** LOW  
**Time:** 3 minutes  
**Status:** Verification only

**Problem:**
- User reports missing management buttons in `/admin/releases`
- Investigation shows all buttons exist

**Current State:**
- ✅ "Create Release" button exists in AdminPageHeader
- ✅ "Edit" button exists in ActionMenu
- ✅ "Delete" button exists in ActionMenu
- ✅ BulkActions component imported

**Solution:**
Verify with user that all buttons are visible and working. No code changes needed.

**Files to Check:**
- `apps/web/src/app/(admin)/admin/releases/page.tsx`

---

### **Phase 3: Investigation & Fix (30 minutes)** - HIGH PRIORITY

#### **Task 5: Fix User Actions Error** 🔴
**Priority:** HIGH  
**Time:** 30 minutes  
**Status:** Needs testing and investigation

**Problem:**
- User reports error when clicking Actions button in `/admin/users`
- User detail page exists at `/admin/users/[id]/page.tsx`
- Need to reproduce and fix the error

**Investigation Steps:**
1. Test clicking Actions button in users list
2. Check if error occurs during navigation or data loading
3. Verify API endpoint `/api/admin/users/[id]` exists and works
4. Check error handling in user detail page
5. Fix any issues found

**Possible Issues:**
- API endpoint may not exist or have errors
- Data fetching may fail
- Missing error handling
- Incorrect route in Actions button

**Files to Check:**
- `apps/web/src/app/(admin)/admin/users/page.tsx` (Actions button)
- `apps/web/src/app/(admin)/admin/users/[id]/page.tsx` (detail page)
- `apps/web/src/app/api/admin/users/[id]/route.ts` (API endpoint - may need to create)

---

## 📁 Files Summary

### **Files to Modify (4 files):**
1. `apps/web/src/components/admin/AdminSidebar.tsx` (Tasks 1, 7)
2. `apps/web/src/components/admin/AdminHeader.tsx` (Task 2)
3. `apps/web/src/components/dashboard/ReleasesClient.tsx` (Task 3)
4. `apps/web/src/components/dashboard/MissionsHeader.tsx` (Task 4)

### **Files to Verify (3 files):**
5. `apps/web/src/app/(admin)/admin/releases/page.tsx` (Task 6)
6. `apps/web/src/app/(admin)/admin/users/page.tsx` (Task 5)
7. `apps/web/src/app/(admin)/admin/users/[id]/page.tsx` (Task 5)

### **Files May Need to Create (1 file):**
8. `apps/web/src/app/api/admin/users/[id]/route.ts` (Task 5 - if doesn't exist)

---

## ✅ Success Criteria

### **After Completion:**
- ✅ Sidebar Store links work (no 404 errors)
- ✅ No admin buttons in user dashboard pages
- ✅ Sidebar logo aligned with header
- ✅ No "Maffix Admin" text in header
- ✅ User Actions button works without errors
- ✅ All releases page buttons verified

---

## ⚠️ Important Notes

1. **Tasks 3 & 4:** These buttons were supposed to be removed in previous Task 1 but were missed
2. **Task 5:** Requires manual testing to reproduce the error
3. **Task 6:** Likely a false issue - buttons already exist
4. **Task 7:** Simple route mismatch - quick fix

---

## 🚀 Ready to Execute

**All tasks analyzed and ready for execution.**  
**Awaiting your confirmation to proceed.**

**Recommended Order:**
1. Phase 1 (Tasks 7, 3, 4) - Fix critical issues first
2. Phase 2 (Tasks 1, 2, 6) - UI improvements
3. Phase 3 (Task 5) - Investigation and fix

**Total Time:** ~55 minutes

