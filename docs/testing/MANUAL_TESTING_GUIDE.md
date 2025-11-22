# Manual Testing Guide - Issue 3 Features

**Date:** 2025-11-21  
**Tester:** _______________  
**Environment:** http://localhost:3000

---

## 🔐 Test Accounts

```
Admin:  admin@maffix.com  / password123
User:   user@maffix.com   / password123
```

**Important:** Test with both accounts to verify role-based access control!

---

## 📋 Testing Checklist

### Pre-Testing Setup
- [ ] Dev server is running on http://localhost:3000
- [ ] Database is seeded with test data
- [ ] Browser DevTools is open (Network tab)
- [ ] Logged in as admin user

---

## 1️⃣ Mission Management

**URL:** http://localhost:3000/admin/missions

### List Page Tests
- [ ] Page loads without errors
- [ ] Mission list displays correctly
- [ ] Statistics cards show data (Total, Active, Completed, Completion Rate)
- [ ] Search bar works (try searching by title)
- [ ] Type filter works (TIKTOK, SOCIAL, ENGAGEMENT, PURCHASE)
- [ ] Difficulty filter works (EASY, MEDIUM, HARD)
- [ ] Status filter works (Active/Inactive)
- [ ] Pagination works (if >20 missions)
- [ ] Action menu appears on each row
- [ ] "Edit" button works
- [ ] "Delete" button shows confirmation dialog

### Create Mission Tests
- [ ] Click "+ Add Mission" button
- [ ] Form loads at `/admin/missions/new`
- [ ] All fields are present (title, description, type, etc.)
- [ ] Validation works (try submitting empty form)
- [ ] TikTok fields appear when type = TIKTOK
- [ ] Image URL preview works
- [ ] Date pickers work
- [ ] Create mission successfully
- [ ] Redirects to mission list after creation
- [ ] New mission appears in list

### Edit Mission Tests
- [ ] Click "Edit" on any mission
- [ ] Form loads at `/admin/missions/[id]/edit`
- [ ] Form pre-populates with existing data
- [ ] Update title and save
- [ ] Verify changes persist
- [ ] Check Network tab for API calls

### Delete Mission Tests
- [ ] Click "Delete" on any mission
- [ ] Confirmation dialog appears
- [ ] Cancel works (mission not deleted)
- [ ] Confirm works (mission deleted)
- [ ] Mission removed from list

**Notes:**
```
[Write any issues or observations here]
```

---

## 2️⃣ Release Management

**URL:** http://localhost:3000/admin/releases

### List Page Tests
- [ ] Page loads without errors
- [ ] Release list displays correctly
- [ ] Search works (by title or artist)
- [ ] Type filter works (SINGLE, ALBUM, EP, VIDEO)
- [ ] Pagination works
- [ ] Cover images display correctly
- [ ] Action menu works

### Create Release Tests
- [ ] Click "+ Add Release" button
- [ ] Form loads correctly
- [ ] All fields present (title, artist, type, releaseDate, coverImage, spotifyUrl, etc.)
- [ ] Image URL preview works
- [ ] Validation works
- [ ] Create release successfully
- [ ] New release appears in list

### Edit Release Tests
- [ ] Click "Edit" on any release
- [ ] Form pre-populates correctly
- [ ] Update fields and save
- [ ] Verify changes persist

### Delete Release Tests
- [ ] Delete release successfully
- [ ] Confirmation dialog works

**Notes:**
```
[Write any issues or observations here]
```

---

## 3️⃣ Gacha Management

**URL:** http://localhost:3000/admin/gacha

### Statistics Dashboard Tests
- [ ] Page loads without errors
- [ ] All stat cards display data:
  - [ ] Total Pulls
  - [ ] Total Revenue
  - [ ] SSR Rate
  - [ ] Guaranteed SSRs
  - [ ] Recent Pulls (24h)
  - [ ] Active Items
  - [ ] Unique Users
- [ ] Prize distribution chart displays
- [ ] Recent pulls list shows data
- [ ] Top prizes list shows data

### Gacha Items List Tests
- [ ] Gacha items list displays below stats
- [ ] Each item shows prize details
- [ ] Rarity badges display correctly
- [ ] Probability displays correctly
- [ ] Status badges work (Active/Inactive)
- [ ] Rarity filter works
- [ ] Status filter works
- [ ] Action menu works

### Create Gacha Item Tests
- [ ] Click "+ Add Gacha Item" button
- [ ] Form loads at `/admin/gacha/items/new`
- [ ] Prize dropdown loads all prizes
- [ ] Prize preview displays when selected
- [ ] Probability field works (0-1 range)
- [ ] Validation works
- [ ] Create item successfully
- [ ] New item appears in list

### Edit Gacha Item Tests
- [ ] Click "Edit Probability" on any item
- [ ] Form loads with current data
- [ ] Update probability and save
- [ ] Verify changes persist

### Toggle Status Tests
- [ ] Click "Activate" or "Deactivate" in action menu
- [ ] Status changes immediately
- [ ] Badge updates

### Delete Gacha Item Tests
- [ ] Click "Delete" in action menu
- [ ] Confirmation dialog appears
- [ ] Delete works correctly
- [ ] Item removed from list

**Notes:**
```
[Write any issues or observations here]
```

---

## 4️⃣ Merchandise Management

**URL:** http://localhost:3000/admin/merchandise

### List Page Tests
- [ ] Page loads without errors
- [ ] Product list displays with images
- [ ] Search works
- [ ] Category filter works (APPAREL, ACCESSORIES, COLLECTIBLES, DIGITAL, OTHER)
- [ ] Stock status filter works
- [ ] Featured filter works
- [ ] Stock counts display correctly
- [ ] Order counts display correctly
- [ ] Featured badge displays
- [ ] Status badges work
- [ ] Action menu works

### Create Product Tests
- [ ] Click "+ Add Product" button
- [ ] Form loads at `/admin/merchandise/new`
- [ ] All fields present
- [ ] Image URL preview works
- [ ] Category dropdown works
- [ ] Validation works
- [ ] Create product successfully
- [ ] New product appears in list

### Edit Product Tests
- [ ] Click "Edit" on any product
- [ ] Form pre-populates correctly
- [ ] Update fields and save
- [ ] Verify changes persist

### Manage Variants Tests
- [ ] Click "Manage Variants" on any product
- [ ] Variants page loads at `/admin/merchandise/[id]/variants`
- [ ] Existing variants display
- [ ] Click "+ Add Variant"
- [ ] Fill variant form (size, color, SKU, stock, price modifier)
- [ ] Create variant successfully
- [ ] New variant appears in list
- [ ] Edit existing variant
- [ ] Delete variant
- [ ] Verify stock calculations update

### Quick Actions Tests
- [ ] Toggle featured status (action menu)
- [ ] Toggle stock status (action menu)
- [ ] Delete product (with confirmation)

**Notes:**
```
[Write any issues or observations here]
```

---

## 5️⃣ Premium Packs Management

**URL:** http://localhost:3000/admin/packs

### List Page Tests
- [ ] Page loads without errors
- [ ] Pack list displays correctly
- [ ] Search works
- [ ] Active filter works
- [ ] Purchase counts display
- [ ] Price displays correctly
- [ ] Diamonds and tickets display
- [ ] Status badges work
- [ ] Action menu works

### Create Pack Tests
- [ ] Click "+ Add Premium Pack" button
- [ ] Form loads at `/admin/packs/new`
- [ ] All fields present
- [ ] Guaranteed prizes multi-select works
- [ ] Validation works
- [ ] Create pack successfully
- [ ] New pack appears in list

### Edit Pack Tests
- [ ] Click "Edit" on any pack
- [ ] Form pre-populates correctly
- [ ] Update fields and save
- [ ] Modify guaranteed prizes
- [ ] Verify changes persist

### Toggle Active Tests
- [ ] Toggle active status via action menu
- [ ] Status changes immediately

### Delete Pack Tests
- [ ] Delete pack successfully
- [ ] Confirmation works

**Notes:**
```
[Write any issues or observations here]
```

---

## 6️⃣ User Management

**URL:** http://localhost:3000/admin/users

### List Page Tests
- [ ] Page loads without errors
- [ ] User list displays correctly
- [ ] Statistics cards show data (Total, Active, TikTok Linked, Admins)
- [ ] Search works (name, email, TikTok username)
- [ ] Role filter works (USER, ADMIN, ARTIST)
- [ ] Activity counts display correctly
- [ ] Pagination works
- [ ] Action menu works

### User Detail Tests
- [ ] Click "View Details" on any user
- [ ] Detail page loads at `/admin/users/[id]`
- [ ] Profile section displays correctly
- [ ] Statistics cards show data
- [ ] Recent completed tasks section displays
- [ ] Recent prizes section displays
- [ ] Recent gacha pulls section displays
- [ ] Recent purchases section displays
- [ ] Recent transactions section displays
- [ ] Recent orders section displays

### Edit User Tests
- [ ] Click "Edit User" button
- [ ] Form loads at `/admin/users/[id]/edit`
- [ ] Form pre-populates correctly
- [ ] Update name and save
- [ ] Change role (warning appears)
- [ ] Adjust diamonds balance
- [ ] Adjust points
- [ ] Adjust level
- [ ] Verify changes persist

**Notes:**
```
[Write any issues or observations here]
```

---

## 7️⃣ Prize Management

**URL:** http://localhost:3000/admin/prizes

### List Page Tests
- [ ] Page loads without errors
- [ ] Prize list displays with images
- [ ] Search works
- [ ] Rarity filter works (COMMON, RARE, EPIC, SSR, LEGENDARY)
- [ ] Type filter works (PHYSICAL, DIGITAL, EXPERIENCE, DISCOUNT, EXCLUSIVE)
- [ ] Status filter works
- [ ] Usage statistics display correctly
- [ ] Rarity badges display correctly
- [ ] Type badges display correctly
- [ ] Action menu works

### Create Prize Tests
- [ ] Click "+ Add Prize" button
- [ ] Form loads at `/admin/prizes/new`
- [ ] All fields present
- [ ] Image URL preview works
- [ ] Rarity dropdown works
- [ ] Type dropdown works
- [ ] Validation works
- [ ] Create prize successfully
- [ ] New prize appears in list

### Edit Prize Tests
- [ ] Click "Edit" on any prize
- [ ] Form pre-populates correctly
- [ ] Update fields and save
- [ ] Verify changes persist

### Toggle Active Tests
- [ ] Toggle active status via action menu
- [ ] Status changes immediately

### Delete Prize Tests
- [ ] Try deleting prize that's in use
- [ ] Should show error with usage details
- [ ] Try deleting unused prize
- [ ] Should delete successfully

**Notes:**
```
[Write any issues or observations here]
```

---

## 8️⃣ Analytics Dashboard

**URL:** http://localhost:3000/admin/analytics

### Overview Tests
- [ ] Page loads without errors
- [ ] Period selector works (7, 30, 90 days)
- [ ] User metrics section displays:
  - [ ] Total Users
  - [ ] Active Users
  - [ ] TikTok Linked
  - [ ] User Roles breakdown
- [ ] Engagement metrics section displays:
  - [ ] Total Tasks
  - [ ] Recent Completions
  - [ ] Prizes Awarded
  - [ ] Completion Rate
- [ ] Gacha metrics section displays:
  - [ ] Total Pulls
  - [ ] Total Revenue
  - [ ] Recent Revenue
  - [ ] Average per Pull
- [ ] Revenue metrics section displays:
  - [ ] Premium Packs Revenue
  - [ ] Merchandise Revenue
  - [ ] Total Revenue

### Trends Tests
- [ ] User registrations chart displays
- [ ] Task completions chart displays
- [ ] Gacha pulls chart displays
- [ ] Daily revenue chart displays
- [ ] Charts show last 7 days of data
- [ ] Bar widths are proportional
- [ ] Values display on bars
- [ ] Dates display correctly

### Period Change Tests
- [ ] Change period to 7 days
- [ ] Data updates correctly
- [ ] Change period to 90 days
- [ ] Data updates correctly
- [ ] Loading state shows during fetch

**Notes:**
```
[Write any issues or observations here]
```

---

## 9️⃣ Role-Based Access Control

### Test as Regular User
- [ ] Logout from admin account
- [ ] Login as `user@maffix.com` / `password123`
- [ ] Try to access `/admin` (should redirect or show 403)
- [ ] Try to access `/admin/missions` (should be blocked)
- [ ] Try to access `/admin/users` (should be blocked)
- [ ] Verify no admin button in user dashboard
- [ ] Open DevTools Network tab
- [ ] Try calling admin API directly (should return 403)

### Test as Admin
- [ ] Logout from user account
- [ ] Login as `admin@maffix.com` / `password123`
- [ ] Verify can access all `/admin` routes
- [ ] Verify admin button appears in user dashboard
- [ ] Verify all CRUD operations work
- [ ] Verify all API calls succeed

**Notes:**
```
[Write any issues or observations here]
```

---

## 🔟 Cross-Browser Testing

### Chrome
- [ ] All pages load correctly
- [ ] All features work
- [ ] No console errors

### Safari
- [ ] All pages load correctly
- [ ] All features work
- [ ] No console errors

### Firefox
- [ ] All pages load correctly
- [ ] All features work
- [ ] No console errors

**Notes:**
```
[Write any issues or observations here]
```

---

## 1️⃣1️⃣ Responsive Design Testing

### Desktop (1920x1080)
- [ ] All pages display correctly
- [ ] Sidebar is visible
- [ ] Tables are readable
- [ ] No horizontal scroll

### Tablet (768x1024)
- [ ] All pages display correctly
- [ ] Sidebar collapses
- [ ] Tables adapt
- [ ] Touch interactions work

### Mobile (375x667)
- [ ] All pages display correctly
- [ ] Sidebar is hidden
- [ ] Tables scroll horizontally
- [ ] Forms are usable
- [ ] Buttons are tappable

**Notes:**
```
[Write any issues or observations here]
```

---

## 1️⃣2️⃣ Performance Testing

### Page Load Times
- [ ] Mission list loads in <2s
- [ ] Release list loads in <2s
- [ ] Gacha dashboard loads in <2s
- [ ] Merchandise list loads in <2s
- [ ] User list loads in <2s
- [ ] Analytics dashboard loads in <3s

### API Response Times
- [ ] Check Network tab for slow requests
- [ ] All API calls complete in <1s
- [ ] No failed requests

**Notes:**
```
[Write any issues or observations here]
```

---

## 🐛 Issues Found

| # | Page | Issue Description | Severity | Status |
|---|------|-------------------|----------|--------|
| 1 |      |                   |          |        |
| 2 |      |                   |          |        |
| 3 |      |                   |          |        |

**Severity Levels:** Critical, High, Medium, Low

---

## ✅ Final Sign-Off

- [ ] All critical features tested
- [ ] All issues documented
- [ ] Ready for production (Yes/No): _______

**Tester Signature:** _______________  
**Date:** _______________

