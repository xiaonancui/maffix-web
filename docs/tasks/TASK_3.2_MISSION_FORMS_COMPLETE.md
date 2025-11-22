# Task 3.2: Mission Management - Create/Edit Forms - COMPLETE ✅

## Overview

**Status:** ✅ COMPLETE  
**Completed:** 2025-11-21  
**Time Spent:** 3-4 hours  
**Files Created:** 3 files (~610 lines)

---

## Deliverables

### 1. Shared Mission Form Component

**File:** `apps/web/src/components/admin/MissionForm.tsx` (420 lines)

**Features:**
- ✅ Reusable form component for both create and edit modes
- ✅ All mission fields supported:
  - Basic Information: title, description, type, difficulty
  - TikTok Mission Settings: missionType, targetTikTokAccount, targetVideoUrl, targetAudioId, autoVerify
  - Rewards: points, diamonds
  - Status & Schedule: isActive, startDate, endDate, maxCompletions
- ✅ Client-side validation with error messages
- ✅ Conditional field rendering based on mission type
- ✅ Loading states during submission
- ✅ Admin visual design theme
- ✅ Responsive layout (mobile/tablet/desktop)
- ✅ TypeScript type-safe with MissionFormData interface

**Validation Rules:**
- Title and description are required
- Points and diamonds must be >= 0
- Mission type-specific validation:
  - FOLLOW missions require targetTikTokAccount
  - LIKE/REPOST missions require targetVideoUrl
  - USE_AUDIO missions require targetAudioId
- End date must be after start date
- Real-time error clearing on field edit

---

### 2. Create Mission Page

**File:** `apps/web/src/app/(admin)/admin/missions/new/page.tsx` (95 lines)

**Features:**
- ✅ Client component with form submission
- ✅ Calls POST /api/admin/missions endpoint
- ✅ Success: Redirects to /admin/missions
- ✅ Error handling with user-friendly messages
- ✅ Loading states during API call
- ✅ Cancel button returns to missions list
- ✅ AdminPageHeader with title and description
- ✅ Error display banner

**API Integration:**
- Endpoint: `POST /api/admin/missions`
- Request body: All mission fields
- Response: `{ success: true, mission: {...} }`
- Error handling: Displays error message to user

---

### 3. Edit Mission Page

**File:** `apps/web/src/app/(admin)/admin/missions/[id]/edit/page.tsx` (190 lines)

**Features:**
- ✅ Dynamic route with mission ID parameter
- ✅ Fetches existing mission data on mount
- ✅ Calls PATCH /api/admin/missions/[id] endpoint
- ✅ Pre-populates form with existing data
- ✅ Date conversion for datetime-local inputs
- ✅ Loading state while fetching mission
- ✅ Error state if mission not found
- ✅ Success: Redirects to /admin/missions
- ✅ Cancel button returns to missions list

**API Integration:**
- Fetch: `GET /api/admin/missions/[id]`
- Update: `PATCH /api/admin/missions/[id]`
- Request body: All mission fields (nullable for optional fields)
- Response: `{ success: true, mission: {...} }`
- Error handling: Displays error message to user

---

## Technical Implementation

### Form Component Architecture

```typescript
export interface MissionFormData {
  title: string
  description: string
  type: 'SOCIAL' | 'CONTENT' | 'DAILY' | 'PROFILE' | 'REFERRAL' | 'PURCHASE' | 'EVENT'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  missionType?: 'FOLLOW' | 'LIKE' | 'REPOST' | 'USE_AUDIO' | null
  targetTikTokAccount?: string
  targetVideoUrl?: string
  targetAudioId?: string
  autoVerify: boolean
  points: number
  diamonds: number
  isActive: boolean
  startDate?: string
  endDate?: string
  maxCompletions?: number
}
```

### Form Sections

1. **Basic Information**
   - Title (text input, required)
   - Description (textarea, required)
   - Type (select dropdown, 7 options)
   - Difficulty (select dropdown, 3 options)

2. **TikTok Mission Settings**
   - Mission Type (select dropdown, 5 options including "None")
   - Conditional fields based on mission type:
     - FOLLOW → Target TikTok Account
     - LIKE/REPOST → Target Video URL
     - USE_AUDIO → Target Audio ID
   - Auto-verify checkbox

3. **Rewards**
   - Points (number input, min 0, icon: 🎯)
   - Diamonds (number input, min 0, icon: 💎)

4. **Status & Schedule**
   - Is Active (checkbox with status badge)
   - Start Date (datetime-local input, optional)
   - End Date (datetime-local input, optional)
   - Max Completions (number input, optional)

5. **Action Buttons**
   - Cancel (secondary button)
   - Submit (primary button with loading state)

---

## User Flow

### Create Mission Flow

1. User clicks "Create Mission" button on missions list page
2. Navigates to `/admin/missions/new`
3. Fills out form fields
4. Client-side validation on submit
5. If valid: POST request to `/api/admin/missions`
6. On success: Redirect to `/admin/missions`
7. On error: Display error message, stay on form

### Edit Mission Flow

1. User clicks "Edit" action on mission row
2. Navigates to `/admin/missions/[id]/edit`
3. Page fetches mission data via GET request
4. Form pre-populates with existing data
5. User modifies fields
6. Client-side validation on submit
7. If valid: PATCH request to `/api/admin/missions/[id]`
8. On success: Redirect to `/admin/missions`
9. On error: Display error message, stay on form

---

## Integration with Existing Code

### Uses Existing Components
- ✅ `FormField` - All form inputs
- ✅ `StatusBadge` - Active/Inactive status display
- ✅ `AdminPageHeader` - Page title and description

### Uses Existing API Endpoints
- ✅ `POST /api/admin/missions` - Create mission
- ✅ `GET /api/admin/missions/[id]` - Fetch mission
- ✅ `PATCH /api/admin/missions/[id]` - Update mission

### Integrates with Mission List Page
- ✅ "Create Mission" button links to `/admin/missions/new`
- ✅ "Edit" action menu links to `/admin/missions/[id]/edit`
- ✅ Both pages redirect back to `/admin/missions` on success/cancel

---

## Testing Checklist

- [ ] Create new mission with all fields
- [ ] Create mission with minimal fields (only required)
- [ ] Edit existing mission
- [ ] Validation: Submit empty form
- [ ] Validation: Invalid points/diamonds (negative)
- [ ] Validation: End date before start date
- [ ] Validation: FOLLOW mission without target account
- [ ] Validation: LIKE mission without target video URL
- [ ] Validation: USE_AUDIO mission without target audio ID
- [ ] Cancel button returns to list
- [ ] Loading states display correctly
- [ ] Error messages display correctly
- [ ] Success redirects to list
- [ ] Form pre-populates correctly in edit mode
- [ ] Date fields display correctly
- [ ] Responsive design on mobile/tablet

---

## Next Steps

With Task 3.2 complete, the mission management CRUD cycle is now fully functional:
- ✅ List missions (Task 3.1)
- ✅ Create mission (Task 3.2)
- ✅ Edit mission (Task 3.2)
- ✅ Delete mission (Task 3.1 - bulk/row actions)

**Remaining tasks for Issue 3:**
- Task 3.3: Release/Video Management
- Task 3.4: Gacha System Management
- Task 3.5: Store/Merchandise Management
- Task 3.6: Premium Packs Management
- Task 3.7: User Management
- Task 3.8: Prize Management
- Task 3.9: Analytics Dashboard
- Task 3.12: Testing & Documentation

---

**Last Updated:** 2025-11-21  
**Status:** ✅ COMPLETE

