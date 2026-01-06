# Migration Guide: Gacha Banner System & Economy Updates

**Migration Date:** 2026-01-06
**Migration Name:** `add_gacha_banner_system_and_economy_updates`

---

## 📋 Overview

This migration implements Phase 1 of the fan engagement and progression system, introducing:
1. **Economy Updates**: User XP, Levels, Diamonds, and Tickets
2. **Gacha Banner System**: Support for multiple rotating banners (Beat like Dat, SYBAU, events)
3. **Enhanced Transaction Tracking**: Better audit trail with specific transaction types

---

## 🔄 Database Schema Changes

### 1. User Model Updates

#### Fields Added:
- `xp` (Int, default: 0): Lifetime XP accumulation
- `tickets` (Int, default: 0): Currency from merchandise purchases

#### Fields Renamed:
- `diamondBalance` → `diamonds`: For consistency with naming convention

#### Field Purpose:
- **diamonds**: Soft currency earned from missions → spent in Aura Zone
- **tickets**: Gacha tickets earned from merch purchases (GBP) → spent in Aura Zone
- **xp**: Experience points that determine user level (1-50 cap)
- **level**: Cached level value derived from XP for performance

---

### 2. Currency Enum Expansion

**Before:**
```prisma
enum Currency {
  DIAMONDS
  POINTS
}
```

**After:**
```prisma
enum Currency {
  DIAMONDS // From missions → spend in Aura Zone
  TICKETS  // From store purchases (GBP merch) → spend in Aura Zone
  POINTS   // Legacy/general purpose points
}
```

---

### 3. TransactionType Enum Enhancement

**New Values Added:**
- `MISSION_REWARD`: Completing Easy/Medium/Hard missions
- `GACHA_SPEND`: Spending diamonds/tickets in Aura Zone
- `STORE_BONUS`: Tickets awarded from merchandise purchases
- `LEVEL_UP`: Bonus rewards for leveling up

**Existing Values (Backwards Compatible):**
- `EARN`, `SPEND`, `PURCHASE`, `GIFT`, `REFUND`, `ADJUSTMENT`

---

### 4. GachaBanner Model (NEW)

```prisma
model GachaBanner {
  id                 String      @id @default(uuid())
  name               String      // "Beat like Dat", "SYBAU", etc.
  slug               String      @unique
  description        String?
  backgroundVideoUrl String      // MV video URL for UI
  currencyType       Currency    // DIAMONDS or TICKETS
  costPerPull        Int         // e.g., 100 diamonds or 1 ticket
  startDate          DateTime
  endDate            DateTime
  isActive           Boolean     @default(true)
  sortOrder          Int         @default(0)
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  gachaItems         GachaItem[]
  gachaPulls         GachaPull[]
}
```

**Purpose:**
- Support multiple rotating banners with different prize pools
- Each banner can use different currency (DIAMONDS or TICKETS)
- Background video changes based on active banner (song-based theming)

---

### 5. GachaItem Model Updates

**Field Added:**
- `bannerId` (String): Foreign key to GachaBanner

**Impact:**
- Each gacha item now belongs to a specific banner
- Same prize can appear in multiple banners with different probabilities

---

### 6. GachaPull Model Updates

**Fields Added:**
- `bannerId` (String): Track which banner was used for the pull
- `currencyUsed` (Currency): Track if DIAMONDS or TICKETS were spent

**Purpose:**
- Complete audit trail for gacha pulls
- Analytics on banner performance and currency usage

---

## ⚠️ Breaking Changes & Migration Steps

### Step 1: Apply Database Migration

⚠️ **IMPORTANT**: The migration leaves `bannerId` and `currencyUsed` as NULLABLE initially to handle existing data.

```bash
npx prisma migrate deploy
```

### Step 2: Create Default Banner

Before making fields NOT NULL, create a default banner for existing data:

```sql
INSERT INTO "gacha_banners" (
  id, name, slug, description, backgroundVideoUrl,
  currencyType, costPerPull, startDate, endDate,
  isActive, sortOrder, createdAt, updatedAt
) VALUES (
  'default-banner-id',
  'Default Banner',
  'default',
  'Legacy banner for existing gacha items',
  'https://example.com/default-video.mp4',
  'DIAMONDS',
  100,
  NOW(),
  NOW() + INTERVAL '10 years',
  true,
  0,
  NOW(),
  NOW()
);
```

### Step 3: Migrate Existing Data

Update existing gacha items and pulls to reference the default banner:

```sql
-- Update existing gacha items
UPDATE "gacha_items"
SET "bannerId" = 'default-banner-id'
WHERE "bannerId" IS NULL;

-- Update existing gacha pulls
UPDATE "gacha_pulls"
SET "bannerId" = 'default-banner-id',
    "currencyUsed" = 'DIAMONDS'
WHERE "bannerId" IS NULL;
```

### Step 4: Make Fields NOT NULL

After migrating data, enforce constraints:

```sql
ALTER TABLE "gacha_items" ALTER COLUMN "bannerId" SET NOT NULL;
ALTER TABLE "gacha_pulls" ALTER COLUMN "bannerId" SET NOT NULL;
ALTER TABLE "gacha_pulls" ALTER COLUMN "currencyUsed" SET NOT NULL;
```

---

## 🔧 Code Changes

### Breaking Changes in Codebase

**All references to `diamondBalance` have been renamed to `diamonds`:**
- ✅ 35 files updated automatically
- ✅ API routes updated
- ✅ React components updated
- ✅ Prisma seed scripts updated
- ✅ Migration files updated

**Areas to Review:**
1. **API Endpoints**: All gacha pull endpoints now need `bannerId` parameter
2. **Transaction Creation**: Use new specific TransactionType values
3. **Store Integration**: Implement ticket granting on merchandise purchases

---

## 📊 System Design: Economy Loops

### Loop 1: Social Media Engagement → Diamonds → Gacha
```
User completes mission → Earns Diamonds → Spend on Diamond Banner → Win prizes
```

### Loop 2: Merch Purchases → Tickets → Gacha
```
User buys merch → Earns Tickets (based on GBP spent) → Spend on Ticket Banner → Win prizes
```

### XP & Level Progression
```
Complete missions → Earn XP → Level up (1-50) → Unlock rewards/bonuses
```

---

## 🎯 Next Steps (Phase 2+)

**Not included in this migration but needed for full system:**

1. **Mission System Integration**
   - Award diamonds on mission completion
   - Award XP on mission completion
   - Calculate level from XP with algorithm

2. **Store Integration**
   - Calculate tickets based on GBP merchandise subtotal
   - Create STORE_BONUS transactions
   - Grant tickets on successful purchase

3. **Gacha UI Updates**
   - Display active banners
   - Show background video from banner
   - Support banner switching
   - Display correct currency cost

4. **Level System**
   - Define XP requirements per level (1-50)
   - Level-up rewards
   - Level gates for content

5. **Analytics**
   - Banner performance metrics
   - Currency flow tracking
   - Conversion funnels

---

## 📝 Testing Checklist

- [ ] Verify migration applies successfully
- [ ] Verify existing users have `diamonds`, `xp`, and `tickets` fields
- [ ] Create test GachaBanner
- [ ] Test gacha pulls with new banner system
- [ ] Verify transactions use new TransactionType values
- [ ] Test that existing gacha items work with default banner
- [ ] Verify Prisma Client types are updated

---

## 🔍 Rollback Plan

If issues arise, you can rollback by:

1. Revert schema.prisma to previous version
2. Drop the new migration:
```bash
npx prisma migrate resolve --rolled-back 20260106184800_add_gacha_banner_system_and_economy_updates
```

3. Revert code changes:
```bash
git revert <commit-hash>
```

**Note:** This will lose any data created with the new schema.

---

## 📞 Support & Questions

For questions or issues:
- Check migration logs in `prisma/migrations/`
- Review transaction history in database
- Verify Prisma Client regenerated: `npx prisma generate`

---

**End of Migration Guide**
