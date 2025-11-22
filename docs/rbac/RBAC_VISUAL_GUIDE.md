# Role-Based Access Control - Visual Design Guide

## Overview
This document provides visual specifications for the role-based UI differentiation in the Maffix platform.

---

## Header Color Specifications

### Admin Panel Header (ADMIN Role)

**Current State:**
```css
background: bg-gray-900 (#111827)
border: border-gray-800 (#1f2937)
```

**Proposed State:**
```css
background: bg-gradient-to-r from-[#FF5656] to-[#ff3333]
border: border-[#ff3333]
shadow: shadow-lg with red glow
```

**Visual Description:**
- Bright red gradient background (left to right)
- Strong visual presence
- Immediately identifiable as admin interface
- High contrast with content area

**Text Colors:**
- Logo: `text-white` (white)
- Navigation links: `text-white` with `hover:text-white/80`
- Active link: `border-b-2 border-white`

---

### User Dashboard Header (USER Role)

**Current State:**
```css
background: bg-gray-900 (#111827)
border: border-gray-800 (#1f2937)
```

**Proposed State:**
```css
background: bg-black (#000000)
border: border-gray-800 (#1f2937)
shadow: shadow-lg
```

**Visual Description:**
- Pure black background
- Sleek, modern appearance
- Professional and clean
- Matches the overall dark theme

**Text Colors:**
- Logo: `text-white` (white)
- Navigation links: `text-white/80` with `hover:text-white`
- Active link: `border-b-2 border-[#FF5656]`
- Diamond balance: `text-[#FF5656]` (accent color)

---

## Component-Level Changes

### 1. Admin Panel Layout (`apps/web/src/app/(admin)/layout.tsx`)

**Before:**
```tsx
<nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 justify-between">
      <div className="flex">
        <div className="flex flex-shrink-0 items-center">
          <Link href="/admin" className="text-xl font-bold text-white">
            🛡️ Maffix Admin
          </Link>
        </div>
        {/* Navigation links */}
      </div>
    </div>
  </div>
</nav>
```

**After:**
```tsx
<nav className="bg-gradient-to-r from-[#FF5656] to-[#ff3333] border-b border-[#ff3333] shadow-lg shadow-red-500/20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 justify-between">
      <div className="flex">
        <div className="flex flex-shrink-0 items-center">
          <Link href="/admin" className="text-xl font-bold text-white">
            🛡️ Maffix Admin
          </Link>
        </div>
        {/* Navigation links with updated hover states */}
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
          ADMIN
        </span>
        <Link href="/dashboard" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
          ← Back to User Dashboard
        </Link>
      </div>
    </div>
  </div>
</nav>
```

**Key Changes:**
- Background: Red gradient
- Border: Red color
- Shadow: Red glow effect
- Added: ADMIN role badge
- Updated: Link hover states

---

### 2. User Dashboard Layout (`apps/web/src/app/(dashboard)/layout.tsx`)

**Before:**
```tsx
<nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 justify-between">
      <div className="flex">
        <div className="flex flex-shrink-0 items-center">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            Maffix
          </Link>
        </div>
        {/* Navigation links */}
      </div>
      <div className="flex items-center gap-4">
        {/* Diamond balance and profile */}
      </div>
    </div>
  </div>
</nav>
```

**After:**
```tsx
<nav className="bg-black border-b border-gray-800 shadow-lg">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 justify-between">
      <div className="flex">
        <div className="flex flex-shrink-0 items-center">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            Maffix
          </Link>
        </div>
        {/* Navigation links */}
      </div>
      <div className="flex items-center gap-4">
        {/* Diamond balance */}
        <Link
          href="/transactions"
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          <span>💎</span>
          <span className="text-[#FF5656]">{diamondBalance}</span>
        </Link>

        {/* Admin Panel Link (only for admins) */}
        {session.user.role === 'ADMIN' && (
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg bg-[#FF5656] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#ff3333] transition-colors"
          >
            <span>🛡️</span>
            <span>Admin</span>
          </Link>
        )}

        {/* Profile Icon */}
        <Link href="/profile" className="rounded-full bg-white/20 p-1 text-white hover:bg-white/30 transition-colors">
          {/* Profile icon SVG */}
        </Link>

        {/* Mobile Menu */}
        <MobileMenu diamondBalance={diamondBalance} hasCompletedTenDraw={hasCompletedTenDraw} />
      </div>
    </div>
  </div>
</nav>
```

**Key Changes:**
- Background: Pure black
- Added: Conditional admin panel link for admin users
- Enhanced: Diamond balance styling
- Maintained: Existing navigation structure

---

## Role-Based UI Elements

### Admin-Only Features

**1. Mission Management Button**
- Location: `/missions` page
- Component: `MissionsHeader.tsx`
- Visibility: `{session?.user?.role === 'ADMIN' && <AddMissionButton />}`

**2. Gacha Settings Button**
- Location: `/gacha` page
- Component: `GachaHeader.tsx`
- Visibility: `{session?.user?.role === 'ADMIN' && <SettingsButton />}`

**3. Admin Panel Link**
- Location: User dashboard header
- Visibility: `{session?.user?.role === 'ADMIN' && <AdminPanelLink />}`

**4. Admin Dashboard Statistics**
- Location: `/admin` page
- Access: ADMIN role required
- Features: System stats, user management, task verification

---

## Color Palette Reference

### Primary Colors
- **Brand Red:** `#FF5656`
- **Dark Red:** `#ff3333`
- **Pure Black:** `#000000`
- **Dark Gray:** `#111827` (gray-900)
- **Border Gray:** `#1f2937` (gray-800)

### Text Colors
- **Primary Text:** `#FFFFFF` (white)
- **Secondary Text:** `#9CA3AF` (gray-400)
- **Accent Text:** `#FF5656` (brand red)

### Background Colors
- **Admin Header:** Gradient from `#FF5656` to `#ff3333`
- **User Header:** `#000000` (black)
- **Content Background:** `#000000` (black)
- **Card Background:** `#111827` (gray-900)

---

## Responsive Considerations

### Mobile View
- Admin header maintains red gradient on mobile
- User header maintains black background on mobile
- Mobile menu inherits parent header styling
- Admin badge may be hidden on very small screens (< 375px)

### Tablet View
- Full navigation visible
- All role-based elements visible
- Consistent header heights

### Desktop View
- Full feature set visible
- Optimal spacing and layout
- Clear visual hierarchy

---

## Accessibility

### Contrast Ratios
- Admin header text on red background: WCAG AA compliant
- User header text on black background: WCAG AAA compliant
- All interactive elements meet minimum contrast requirements

### Focus States
- All links and buttons have visible focus indicators
- Keyboard navigation fully supported
- Screen reader friendly labels

### Color Blindness
- Red gradient distinguishable from black even with color blindness
- Additional visual cues (icons, badges) supplement color coding
- Text labels clearly indicate role and context


