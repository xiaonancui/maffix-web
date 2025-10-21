# TenTenTen Web - 完全重构方案 (Turborepo 架构)

**版本**: 2.0  
**日期**: 2025-10-13  
**状态**: 待审批

---

## 📋 执行摘要

本方案提出对 TenTenTen Web 项目进行**完全架构重构**，从当前的"前后端分离 + NPM Workspaces"架构，迁移到**基于 Turborepo 的现代化全栈 Monorepo 架构**。

### 核心变更
- ❌ **移除**: 独立的 NestJS 后端服务
- ❌ **移除**: Refine 框架（过度复杂）
- ❌ **移除**: Ant Design（体积大）
- ✅ **采用**: Next.js 14 全栈应用（App Router + API Routes）
- ✅ **采用**: Turborepo Monorepo 架构
- ✅ **采用**: shadcn/ui 组件库（轻量级）
- ✅ **采用**: React Server Components + Server Actions

### 预期收益
- 🚀 **开发效率提升 50%**：单一应用，无需维护前后端两套代码
- ⚡ **构建速度提升 5-10 倍**：Turborepo 智能缓存
- 📦 **包体积减少 40%**：移除 Refine + Ant Design
- 🎯 **代码复杂度降低 60%**：简化技术栈
- 💰 **部署成本降低 50%**：只需部署一个应用（Vercel）

---

## 🏗️ 新架构设计

### 1. 目录结构

```
tententen-web/
├── apps/
│   └── web/                          # Next.js 14 全栈应用
│       ├── src/
│       │   ├── app/                  # App Router
│       │   │   ├── (auth)/          # 认证相关页面
│       │   │   │   ├── login/
│       │   │   │   └── register/
│       │   │   ├── (dashboard)/     # Dashboard 布局组
│       │   │   │   ├── dashboard/   # 用户中心
│       │   │   │   ├── tasks/       # 任务管理
│       │   │   │   ├── gacha/       # 抽奖系统
│       │   │   │   └── profile/     # 个人资料
│       │   │   ├── (admin)/         # 管理后台
│       │   │   │   └── admin/
│       │   │   ├── api/             # API Routes
│       │   │   │   ├── auth/        # NextAuth.js
│       │   │   │   ├── tasks/       # 任务 API
│       │   │   │   ├── gacha/       # 抽奖 API
│       │   │   │   └── payment/     # 支付 API
│       │   │   ├── layout.tsx       # 根布局
│       │   │   └── page.tsx         # 首页
│       │   ├── components/          # React 组件
│       │   │   ├── ui/              # shadcn/ui 组件
│       │   │   ├── auth/            # 认证组件
│       │   │   ├── dashboard/       # Dashboard 组件
│       │   │   └── gacha/           # 抽奖组件
│       │   ├── lib/                 # 工具库
│       │   │   ├── auth.ts          # NextAuth 配置
│       │   │   ├── db.ts            # Prisma 客户端
│       │   │   └── utils.ts         # 工具函数
│       │   └── types/               # TypeScript 类型
│       ├── prisma/                  # Prisma Schema
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── public/                  # 静态资源
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       └── next.config.js
│
├── packages/
│   ├── ui/                          # 共享 UI 组件库
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── database/                    # 共享数据库层（未来扩展）
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── typescript-config/           # 共享 TS 配置
│       ├── base.json
│       ├── nextjs.json
│       └── package.json
│
├── turbo.json                       # Turborepo 配置
├── package.json                     # 根 package.json
├── .npmrc                           # NPM 配置（淘宝镜像）
├── .gitignore
└── README.md
```

### 2. 技术栈对比

| 层级 | 旧架构 | 新架构 | 理由 |
|-----|--------|--------|------|
| **前端框架** | Next.js 14 + Refine | Next.js 14 (App Router) | Refine 过度复杂，App Router 已足够强大 |
| **后端框架** | NestJS (独立服务) | Next.js API Routes | 简化部署，减少维护成本 |
| **UI 组件库** | Ant Design | shadcn/ui | 更轻量，更现代，更灵活 |
| **状态管理** | React Query (Refine) | Server Components + Server Actions | 原生支持，无需额外库 |
| **认证** | NextAuth.js | NextAuth.js | 保持不变 |
| **数据库 ORM** | Prisma | Prisma | 保持不变 |
| **数据库** | Supabase PostgreSQL | Supabase PostgreSQL | 保持不变 |
| **样式** | Tailwind CSS | Tailwind CSS | 保持不变 |
| **Monorepo** | NPM Workspaces | Turborepo | 智能缓存，极速构建 |
| **包管理器** | npm | cnpm | 适配中国大陆网络 |
| **部署** | Vercel (前端) + Railway (后端) | Vercel (全栈) | 简化部署，降低成本 |

---

## 🔄 数据模型迁移

### Prisma Schema (保持 90% 不变)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户模型
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  role          UserRole  @default(USER)
  diamonds      Int       @default(0)

  accounts      Account[]
  sessions      Session[]
  tasks         Task[]
  drawRecords   DrawRecord[]
}

// NextAuth.js 必需模型
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum UserRole {
  USER
  ADMIN
}

// 任务系统
model Task {
  id          String      @id @default(cuid())
  url         String
  platform    String
  status      TaskStatus  @default(PENDING)
  reward      Int
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  
  reviewedBy  String?
  reviewNotes String?
}

enum TaskStatus {
  PENDING
  APPROVED
  REJECTED
}

// Gacha 系统
model Banner {
  id          String    @id @default(cuid())
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean   @default(true)

  prizePool   Prize[]
}

model Prize {
  id              String      @id @default(cuid())
  name            String
  description     String?
  rarity          RarityType
  imageUrl        String?
  totalQuantity   Int?
  claimedQuantity Int         @default(0)

  bannerId        String
  banner          Banner      @relation(fields: [bannerId], references: [id])
  
  drawRecords     DrawRecord[]
}

enum RarityType {
  UR
  SSR
  SR
  R
}

model DrawRecord {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  prizeId   String
  prize     Prize    @relation(fields: [prizeId], references: [id])
}
```

---

## 📦 核心配置文件

### 1. 根目录 `package.json`

```json
{
  "name": "tententen-web",
  "version": "2.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:generate": "turbo run db:generate",
    "db:push": "turbo run db:push",
    "db:migrate": "turbo run db:migrate",
    "db:studio": "turbo run db:studio"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.1.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "packageManager": "cnpm@9.0.0"
}
```

### 2. `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 3. `.npmrc` (使用淘宝镜像)

```ini
registry=https://registry.npmmirror.com
disturl=https://npmmirror.com/dist
sass_binary_site=https://npmmirror.com/mirrors/node-sass
phantomjs_cdnurl=https://npmmirror.com/mirrors/phantomjs
electron_mirror=https://npmmirror.com/mirrors/electron
chromedriver_cdnurl=https://npmmirror.com/mirrors/chromedriver
operadriver_cdnurl=https://npmmirror.com/mirrors/operadriver
```

---

## 🚀 实施计划

详见下一节的任务清单。

---

## 📊 新旧架构对比

### 复杂度对比

| 指标 | 旧架构 | 新架构 | 改善 |
|-----|--------|--------|------|
| **代码库数量** | 2 个（frontend + backend） | 1 个（web） | -50% |
| **配置文件数量** | 15+ | 8 | -47% |
| **依赖包数量** | ~800 | ~400 | -50% |
| **部署服务数量** | 2 个 | 1 个 | -50% |
| **API 调用复杂度** | HTTP 跨域请求 | 本地函数调用 | -80% |

### 性能对比（预估）

| 指标 | 旧架构 | 新架构 | 提升 |
|-----|--------|--------|------|
| **首次构建时间** | ~120s | ~60s | 2x |
| **增量构建时间** | ~120s | ~10s | 12x |
| **开发服务器启动** | ~15s | ~5s | 3x |
| **包体积** | ~2.5MB | ~1.5MB | 1.7x |

---

## ⚠️ 风险评估

### 高风险项
1. **数据迁移**: 需要确保 Prisma Schema 兼容性
2. **认证系统**: NextAuth.js 配置需要重新测试
3. **API 兼容性**: 前端可能依赖旧的 API 端点

### 缓解措施
1. 在新分支上进行开发，保留旧代码
2. 逐步迁移功能模块，而非一次性重写
3. 编写迁移脚本，自动化数据迁移

---

## ✅ 成功标准

重构完成后，项目应满足：

- ✅ 可以通过 `cnpm install` 一键安装所有依赖
- ✅ 可以通过 `turbo dev` 启动开发服务器
- ✅ 用户可以注册、登录、访问 Dashboard
- ✅ 数据库连接正常，可以进行 CRUD 操作
- ✅ 所有核心功能（任务、Gacha）正常工作
- ✅ 构建时间 < 60 秒
- ✅ 代码覆盖率 > 60%

---

## 📅 时间估算

| 阶段 | 任务 | 预计时间 |
|-----|------|---------|
| Phase 1 | 清理现有代码 | 0.5 天 |
| Phase 2 | 搭建 Turborepo 基础架构 | 1 天 |
| Phase 3 | 迁移认证系统 | 1 天 |
| Phase 4 | 迁移 Dashboard 功能 | 2 天 |
| Phase 5 | 迁移任务系统 | 1.5 天 |
| Phase 6 | 迁移 Gacha 系统 | 1.5 天 |
| Phase 7 | 测试和优化 | 1.5 天 |
| **总计** | | **9 天** |

---

## 🎯 下一步

请审阅本方案，确认后我将：
1. 创建详细的任务清单
2. 开始执行 Phase 1（清理代码）
3. 逐步实施重构

**是否批准此方案？**

