# RBAC Testing Documentation

## 📋 Overview

This document provides comprehensive testing procedures for the Role-Based Access Control (RBAC) implementation in the Maffix platform.

## 🔑 Test Accounts

### 1. Regular User Account
- **Email**: `user@maffix.com`
- **Password**: `password123`
- **Role**: `USER`
- **Expected Access**: User dashboard only, no admin features

### 2. Admin Account
- **Email**: `admin@maffix.com`
- **Password**: `password123`
- **Role**: `ADMIN`
- **Expected Access**: Full access to both user dashboard and admin panel

### 3. Artist Account
- **Email**: `artist@maffix.com`
- **Password**: `password123`
- **Role**: `ARTIST`
- **Expected Access**: User dashboard with potential artist-specific features

## 🎯 Test Scenarios

### Phase 1: Visual Differentiation Tests

#### Test 1.1: Admin Panel Header Color
**Test Steps:**
1. Log in as `admin@maffix.com`
2. Navigate to `/admin`
3. Observe the header color

**Expected Results:**
- ✅ Header has red gradient background (`#FF5656` → `#ff3333`)
- ✅ "ADMIN" badge is visible in the header
- ✅ Red shadow effect is present
- ✅ Navigation links have white hover effect

**Status:** ⏳ Pending

---

#### Test 1.2: User Dashboard Header Color
**Test Steps:**
1. Log in as `user@maffix.com`
2. Navigate to `/dashboard`
3. Observe the header color

**Expected Results:**
- ✅ Header has pure black background (`#000000`)
- ✅ No "ADMIN" badge visible
- ✅ No "Admin Panel" button visible
- ✅ Diamond balance is displayed with red numbers

**Status:** ⏳ Pending

---

#### Test 1.3: Admin User in Dashboard
**Test Steps:**
1. Log in as `admin@maffix.com`
2. Navigate to `/dashboard`
3. Observe the header

**Expected Results:**
- ✅ Header has pure black background
- ✅ "Admin" button is visible (red background with shield icon)
- ✅ Clicking "Admin" button navigates to `/admin`
- ✅ Diamond balance is displayed

**Status:** ⏳ Pending

---

### Phase 2: Role-Based UI Component Tests

#### Test 2.1: Missions Header - Regular User
**Test Steps:**
1. Log in as `user@maffix.com`
2. Navigate to `/dashboard/missions`
3. Observe the missions header

**Expected Results:**
- ✅ "Add Mission" button is NOT visible
- ✅ Mission list is visible
- ✅ User can view missions

**Status:** ⏳ Pending

---

#### Test 2.2: Missions Header - Admin User
**Test Steps:**
1. Log in as `admin@maffix.com`
2. Navigate to `/dashboard/missions`
3. Observe the missions header

**Expected Results:**
- ✅ "Add Mission" button IS visible
- ✅ Clicking button opens mission creation form
- ✅ Admin can create new missions

**Status:** ⏳ Pending

---

#### Test 2.3: Gacha Header - Regular User
**Test Steps:**
1. Log in as `user@maffix.com`
2. Navigate to `/dashboard/gacha`
3. Observe the gacha header

**Expected Results:**
- ✅ "Settings" button is NOT visible
- ✅ User can perform gacha draws
- ✅ User can view prizes

**Status:** ⏳ Pending

---

#### Test 2.4: Gacha Header - Admin User
**Test Steps:**
1. Log in as `admin@maffix.com`
2. Navigate to `/dashboard/gacha`
3. Observe the gacha header

**Expected Results:**
- ✅ "Settings" button IS visible
- ✅ Clicking button opens gacha settings
- ✅ Admin can configure gacha system

**Status:** ⏳ Pending

---

#### Test 2.5: Mobile Menu - Regular User
**Test Steps:**
1. Log in as `user@maffix.com`
2. Resize browser to mobile width (< 768px) or use mobile device
3. Open mobile menu

**Expected Results:**
- ✅ "Admin Panel" link is NOT visible
- ✅ Regular navigation items are visible
- ✅ User profile is accessible

**Status:** ⏳ Pending

---

#### Test 2.6: Mobile Menu - Admin User
**Test Steps:**
1. Log in as `admin@maffix.com`
2. Resize browser to mobile width (< 768px) or use mobile device
3. Open mobile menu

**Expected Results:**
- ✅ "Admin Panel" link IS visible (red background)
- ✅ Clicking link navigates to `/admin`
- ✅ All regular navigation items are also visible

**Status:** ⏳ Pending

---

### Phase 3: Authorization Tests

#### Test 3.1: Admin API - Unauthorized Access (No Session)
**Test Steps:**
1. Log out (clear session)
2. Use browser DevTools or Postman to call: `POST /api/admin/missions`
3. Observe the response

**Expected Results:**
- ✅ HTTP Status: 401 Unauthorized
- ✅ Response body:
  ```json
  {
    "error": "Unauthorized",
    "code": "NO_SESSION",
    "details": "Authentication required"
  }
  ```
- ✅ Console log: "⚠️ Unauthorized admin API access attempt - no session"

**Status:** ⏳ Pending

---

#### Test 3.2: Admin API - Forbidden Access (Regular User)
**Test Steps:**
1. Log in as `user@maffix.com`
2. Use browser DevTools to call: `POST /api/admin/missions`
3. Observe the response

**Expected Results:**
- ✅ HTTP Status: 403 Forbidden
- ✅ Response body:
  ```json
  {
    "error": "Forbidden",
    "code": "INSUFFICIENT_PERMISSIONS",
    "details": "Admin access required"
  }
  ```
- ✅ Console log: "⚠️ Forbidden admin API access attempt - user user@maffix.com (role: USER)"

**Status:** ⏳ Pending

---

#### Test 3.3: Admin API - Authorized Access (Admin User)
**Test Steps:**
1. Log in as `admin@maffix.com`
2. Use browser DevTools to call: `GET /api/admin/missions`
3. Observe the response

**Expected Results:**
- ✅ HTTP Status: 200 OK
- ✅ Response contains missions data
- ✅ No error messages in console

**Status:** ⏳ Pending

---

#### Test 3.4: All Admin Endpoints - Authorization Check
**Test Steps:**
Test each endpoint with regular user account:

**Missions API:**
- `POST /api/admin/missions` - Create mission
- `GET /api/admin/missions` - List missions
- `GET /api/admin/missions/[id]` - Get mission
- `PATCH /api/admin/missions/[id]` - Update mission
- `DELETE /api/admin/missions/[id]` - Delete mission
- `GET /api/admin/missions/[id]/submissions` - Get submissions

**Merchandise API:**
- `POST /api/admin/merchandise` - Create merchandise
- `GET /api/admin/merchandise` - List merchandise
- `GET /api/admin/merchandise/[id]` - Get merchandise
- `PATCH /api/admin/merchandise/[id]` - Update merchandise
- `DELETE /api/admin/merchandise/[id]` - Delete merchandise
- `POST /api/admin/merchandise/[id]/variants` - Create variant
- `GET /api/admin/merchandise/[id]/variants` - List variants
- `DELETE /api/admin/merchandise/[id]/variants/[variantId]` - Delete variant

**Premium Packs API:**
- `POST /api/admin/packs` - Create pack
- `GET /api/admin/packs` - List packs
- `GET /api/admin/packs/[id]` - Get pack
- `PATCH /api/admin/packs/[id]` - Update pack
- `DELETE /api/admin/packs/[id]` - Delete pack

**Tasks API:**
- `POST /api/admin/tasks/[userTaskId]/verify` - Verify task

**Expected Results:**
- ✅ All endpoints return 403 Forbidden for regular users
- ✅ All endpoints return 200/201 for admin users
- ✅ Consistent error format across all endpoints

**Status:** ⏳ Pending

---

### Phase 4: Route Protection Tests

#### Test 4.1: Admin Panel Route - Regular User
**Test Steps:**
1. Log in as `user@maffix.com`
2. Navigate to `/admin` directly in browser
3. Observe the behavior

**Expected Results:**
- ✅ User is redirected to `/dashboard` or login page
- ✅ Middleware blocks access
- ✅ Console log shows middleware protection

**Status:** ⏳ Pending

---

#### Test 4.2: Admin Panel Route - Admin User
**Test Steps:**
1. Log in as `admin@maffix.com`
2. Navigate to `/admin` directly in browser
3. Observe the behavior

**Expected Results:**
- ✅ Admin panel loads successfully
- ✅ Red gradient header is visible
- ✅ All admin features are accessible

**Status:** ⏳ Pending

---

## 🔍 Manual Testing Checklist

### Visual Verification
- [ ] Admin panel has red gradient header
- [ ] User dashboard has black header
- [ ] Admin badge visible in admin panel
- [ ] Admin button visible for admins in user dashboard
- [ ] No admin indicators visible to regular users

### Functional Verification
- [ ] Regular users cannot see admin-only buttons
- [ ] Admins can see all admin features
- [ ] Mobile menu shows/hides admin link correctly
- [ ] All admin API endpoints are protected
- [ ] Middleware blocks unauthorized route access

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 📊 Test Results Summary

### Test Execution Date
**Date:** [To be filled during testing]

### Test Results
- **Total Tests:** 18
- **Passed:** [To be filled]
- **Failed:** [To be filled]
- **Blocked:** [To be filled]

### Issues Found
[To be documented during testing]

### Screenshots
[To be added during testing]

## ✅ Sign-Off

### Tested By
**Name:** [To be filled]
**Date:** [To be filled]
**Signature:** [To be filled]

### Approved By
**Name:** [To be filled]
**Date:** [To be filled]
**Signature:** [To be filled]

---

## 📝 Notes

- All test accounts use password: `password123`
- Test in incognito/private mode to avoid session conflicts
- Clear browser cache between role switches
- Use browser DevTools Network tab to verify API responses
- Check browser console for security logs


