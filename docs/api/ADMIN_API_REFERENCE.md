# Admin API Reference

Complete reference for all admin API endpoints in the Maffix platform.

**Base URL:** `/api/admin`  
**Authentication:** All endpoints require admin role (use `requireAdmin()` helper)  
**Response Format:** JSON with `{ success: boolean, ... }` structure

---

## 📋 Table of Contents

1. [Missions](#missions)
2. [Releases](#releases)
3. [Gacha](#gacha)
4. [Merchandise](#merchandise)
5. [Premium Packs](#premium-packs)
6. [Users](#users)
7. [Prizes](#prizes)
8. [Analytics](#analytics)
9. [Tasks](#tasks)

---

## Missions

### List Missions
**GET** `/api/admin/missions`

Query Parameters:
- `search` (string, optional) - Search by title
- `type` (string, optional) - Filter by task type
- `difficulty` (string, optional) - Filter by difficulty
- `isActive` (boolean, optional) - Filter by active status
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Items per page

Response:
```json
{
  "success": true,
  "missions": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### Create Mission
**POST** `/api/admin/missions`

Request Body: (see MissionForm schema)

### Get Mission
**GET** `/api/admin/missions/[id]`

### Update Mission
**PATCH** `/api/admin/missions/[id]`

### Delete Mission
**DELETE** `/api/admin/missions/[id]`

---

## Releases

### List Releases
**GET** `/api/admin/releases`

Query Parameters:
- `search` (string, optional) - Search by title or artist
- `type` (string, optional) - Filter by type (SINGLE, ALBUM, EP, VIDEO)
- `page` (number, default: 1)
- `limit` (number, default: 20)

### Create Release
**POST** `/api/admin/releases`

### Get Release
**GET** `/api/admin/releases/[id]`

### Update Release
**PATCH** `/api/admin/releases/[id]`

### Delete Release
**DELETE** `/api/admin/releases/[id]`

---

## Gacha

### Get Gacha Statistics
**GET** `/api/admin/gacha/stats`

Response:
```json
{
  "success": true,
  "totalPulls": 1234,
  "pullsByType": [...],
  "totalRevenue": 50000,
  "prizeDistribution": [...],
  "ssrRate": 4.2,
  "guaranteedSSRCount": 45,
  "recentPulls24h": 89,
  "activeItemsCount": 25,
  "uniqueUsersCount": 456,
  "topPrizes": [...]
}
```

### List Gacha Items
**GET** `/api/admin/gacha/items`

Query Parameters:
- `rarity` (string, optional) - Filter by rarity
- `isActive` (boolean, optional) - Filter by active status
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Create Gacha Item
**POST** `/api/admin/gacha/items`

Request Body:
```json
{
  "prizeId": "uuid",
  "probability": 0.05,
  "isActive": true
}
```

### Get Gacha Item
**GET** `/api/admin/gacha/items/[id]`

### Update Gacha Item
**PATCH** `/api/admin/gacha/items/[id]`

### Delete Gacha Item
**DELETE** `/api/admin/gacha/items/[id]`

---

## Merchandise

### List Merchandise
**GET** `/api/admin/merchandise`

Query Parameters:
- `search` (string, optional)
- `category` (string, optional)
- `inStock` (boolean, optional)
- `featured` (boolean, optional)
- `page` (number, default: 1)
- `limit` (number, default: 20)

### Create Merchandise
**POST** `/api/admin/merchandise`

### Get Merchandise
**GET** `/api/admin/merchandise/[id]`

### Update Merchandise
**PATCH** `/api/admin/merchandise/[id]`

### Delete Merchandise
**DELETE** `/api/admin/merchandise/[id]`

### List Variants
**GET** `/api/admin/merchandise/[id]/variants`

### Create Variant
**POST** `/api/admin/merchandise/[id]/variants`

### Update Variant
**PATCH** `/api/admin/merchandise/[id]/variants/[variantId]`

### Delete Variant
**DELETE** `/api/admin/merchandise/[id]/variants/[variantId]`

---

## Premium Packs

### List Premium Packs
**GET** `/api/admin/packs`

Query Parameters:
- `search` (string, optional)
- `isActive` (boolean, optional)
- `page` (number, default: 1)
- `limit` (number, default: 20)

### Create Premium Pack
**POST** `/api/admin/packs`

Request Body:
```json
{
  "name": "Starter Pack",
  "description": "Perfect for beginners",
  "price": 9.99,
  "currency": "USD",
  "diamonds": 1000,
  "drawTickets": 5,
  "guaranteedPrizes": ["prize-uuid-1"],
  "isActive": true,
  "sortOrder": 1
}
```

### Get Premium Pack
**GET** `/api/admin/packs/[id]`

### Update Premium Pack
**PATCH** `/api/admin/packs/[id]`

### Delete Premium Pack
**DELETE** `/api/admin/packs/[id]`

---

## Users

### List Users
**GET** `/api/admin/users`

Query Parameters:
- `search` (string, optional) - Search by name, email, or TikTok username
- `role` (string, optional) - Filter by role (USER, ADMIN, ARTIST)
- `page` (number, default: 1)
- `limit` (number, default: 20)

Response:
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "diamondBalance": 500,
      "points": 1200,
      "level": 5,
      "_count": {
        "completedTasks": 15,
        "prizes": 8,
        "gachaPulls": 23,
        "purchases": 2,
        "orders": 1
      }
    }
  ],
  "pagination": {...}
}
```

### Get User
**GET** `/api/admin/users/[id]`

Response includes:
- Full user profile
- Recent completed tasks (last 20)
- Recent prizes (last 20)
- Recent gacha pulls (last 20)
- Recent purchases (last 20)
- Recent transactions (last 20)
- Recent orders (last 10)
- Activity counts

### Update User
**PATCH** `/api/admin/users/[id]`

Request Body:
```json
{
  "name": "New Name",
  "role": "ADMIN",
  "diamondBalance": 1000,
  "points": 2000,
  "level": 10
}
```

---

## Prizes

### List Prizes
**GET** `/api/admin/prizes`

Query Parameters:
- `search` (string, optional)
- `rarity` (string, optional) - COMMON, RARE, EPIC, SSR, LEGENDARY
- `type` (string, optional) - PHYSICAL, DIGITAL, EXPERIENCE, DISCOUNT, EXCLUSIVE
- `isActive` (boolean, optional)
- `page` (number, default: 1)
- `limit` (number, default: 20)

Response includes usage statistics:
```json
{
  "success": true,
  "prizes": [
    {
      "id": "uuid",
      "name": "Exclusive T-Shirt",
      "rarity": "SSR",
      "type": "PHYSICAL",
      "_count": {
        "userPrizes": 5,
        "gachaItems": 1,
        "gachaPulls": 12,
        "premiumPacks": 2
      }
    }
  ],
  "pagination": {...}
}
```

### Create Prize
**POST** `/api/admin/prizes`

Request Body:
```json
{
  "name": "Prize Name",
  "description": "Prize description",
  "rarity": "SSR",
  "type": "PHYSICAL",
  "image": "https://example.com/image.jpg",
  "value": 500,
  "stock": 100,
  "isActive": true
}
```

### Get Prize
**GET** `/api/admin/prizes/[id]`

### Update Prize
**PATCH** `/api/admin/prizes/[id]`

### Delete Prize
**DELETE** `/api/admin/prizes/[id]`

**Note:** Deletion is prevented if prize is in use (has userPrizes, gachaItems, gachaPulls, or premiumPacks). Returns 409 Conflict with usage details.

---

## Analytics

### Get Analytics Overview
**GET** `/api/admin/analytics/overview`

Query Parameters:
- `days` (number, default: 30) - Time period for recent metrics

Response:
```json
{
  "success": true,
  "period": {
    "days": 30,
    "startDate": "2025-10-22T00:00:00.000Z",
    "endDate": "2025-11-21T00:00:00.000Z"
  },
  "users": {
    "total": 1234,
    "new": 89,
    "active": 456,
    "byRole": [...],
    "tiktokLinked": 678
  },
  "engagement": {
    "totalTasks": 50,
    "completedTasks": 2345,
    "recentCompletedTasks": 234,
    "totalPrizes": 100,
    "prizesAwarded": 567,
    "completionRate": 46.9
  },
  "gacha": {
    "totalPulls": 3456,
    "recentPulls": 345,
    "totalRevenue": 172800,
    "recentRevenue": 17250
  },
  "revenue": {
    "packs": {...},
    "merchandise": {...},
    "combined": {...}
  }
}
```

### Get Analytics Trends
**GET** `/api/admin/analytics/trends`

Query Parameters:
- `days` (number, default: 30) - Time period for trend data

Response:
```json
{
  "success": true,
  "period": {...},
  "trends": {
    "userRegistrations": [
      { "date": "2025-11-15", "value": 12 },
      { "date": "2025-11-16", "value": 8 }
    ],
    "taskCompletions": [...],
    "gachaPulls": {
      "count": [...],
      "revenue": [...]
    },
    "purchases": {
      "count": [...],
      "revenue": [...]
    },
    "orders": {
      "count": [...],
      "revenue": [...]
    }
  }
}
```

---

## Tasks

### Verify Task
**POST** `/api/admin/tasks/[userTaskId]/verify`

Request Body:
```json
{
  "status": "APPROVED"
}
```

---

## Error Responses

All endpoints follow consistent error format:

```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `409` - Conflict (e.g., cannot delete prize in use)
- `422` - Unprocessable Entity (validation error)
- `500` - Internal Server Error
- `503` - Service Unavailable (database error)

---

## Authentication

All admin endpoints use the `requireAdmin()` helper from `@/lib/auth-helpers`:

```typescript
import { requireAdmin } from '@/lib/auth-helpers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  const { session } = auth
  // Admin-only logic here
}
```

---

## Validation

Request bodies are validated using Zod schemas. Validation errors return 422 status with details:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

---

## Pagination

List endpoints support pagination with consistent format:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Related Documentation

- **RBAC Quick Reference:** `docs/rbac/RBAC_QUICK_REFERENCE.md`
- **API Standards:** `docs/admin/API_STANDARDS.md`
- **Testing Guide:** `docs/testing/TESTING_GUIDE.md`


