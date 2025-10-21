# TenTenTen Web 重构实施计划

**版本**: 2.0  
**预计工期**: 9 个工作日  
**风险等级**: 中等  
**回滚策略**: 在新分支开发，保留旧代码

---

## 📅 总体时间线

```
Day 1-2:  Phase 1-3 (准备 + 清理 + 搭建基础架构)
Day 3-4:  Phase 4-5 (配置 Next.js + 迁移数据库)
Day 5-6:  Phase 6-7 (认证系统 + Dashboard)
Day 7-8:  Phase 8-9 (任务系统 + Gacha 系统)
Day 9:    Phase 10 (测试与优化)
```

---

## Phase 1: 准备与评估 (0.5 天)

### 目标
- 备份现有代码
- 评估可复用的代码和配置
- 创建新的开发分支

### 任务清单

#### 1.1 创建备份
```bash
# 创建备份分支
git checkout -b backup/v1.0-architecture
git push origin backup/v1.0-architecture

# 创建重构分支
git checkout main
git checkout -b refactor/v2.0-turborepo
```

#### 1.2 评估可复用代码
- [ ] 检查 Prisma Schema
- [ ] 检查 NextAuth.js 配置
- [ ] 检查环境变量
- [ ] 检查 Tailwind CSS 配置
- [ ] 列出需要迁移的组件

#### 1.3 创建迁移清单
- [ ] 创建 `MIGRATION_CHECKLIST.md`
- [ ] 列出所有需要迁移的功能
- [ ] 标记优先级

### 输出物
- ✅ 备份分支 `backup/v1.0-architecture`
- ✅ 重构分支 `refactor/v2.0-turborepo`
- ✅ `MIGRATION_CHECKLIST.md`

---

## Phase 2: 清理现有代码 (0.5 天)

### 目标
- 删除旧的 frontend 和 backend 目录
- 保留必要的文件和文档

### 任务清单

#### 2.1 备份重要文件
```bash
# 备份 Prisma Schema
cp backend/prisma/schema.prisma ./prisma-backup.prisma

# 备份环境变量模板
cp frontend/.env.example ./env-backup-frontend.txt
cp backend/.env.example ./env-backup-backend.txt

# 备份 NextAuth 配置
cp frontend/src/lib/auth.ts ./auth-backup.ts
```

#### 2.2 删除旧代码
```bash
# 删除 frontend 和 backend 目录
rm -rf frontend/
rm -rf backend/

# 删除根目录的 node_modules
rm -rf node_modules/

# 删除旧的配置文件
rm package-lock.json
```

#### 2.3 保留的文件
- ✅ `.git/` (Git 仓库)
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ `ARCHITECTURE.md`
- ✅ `docs/` 目录
- ✅ `.github/` (CI/CD 配置)

### 输出物
- ✅ 清理后的项目根目录
- ✅ 备份的重要文件

---

## Phase 3: 搭建 Turborepo 基础架构 (1 天)

### 目标
- 初始化 Turborepo 项目
- 创建 apps 和 packages 目录结构
- 配置根级别的配置文件

### 任务清单

#### 3.1 初始化 Turborepo
```bash
# 创建根 package.json
cat > package.json << 'EOF'
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
    "clean": "turbo run clean && rm -rf node_modules"
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
EOF
```

#### 3.2 创建 turbo.json
```bash
cat > turbo.json << 'EOF'
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
    }
  }
}
EOF
```

#### 3.3 创建 .npmrc
```bash
cat > .npmrc << 'EOF'
registry=https://registry.npmmirror.com
disturl=https://npmmirror.com/dist
EOF
```

#### 3.4 创建目录结构
```bash
mkdir -p apps/web
mkdir -p packages/ui
mkdir -p packages/database
mkdir -p packages/typescript-config
```

#### 3.5 安装 Turborepo
```bash
cnpm install
```

### 输出物
- ✅ `turbo.json`
- ✅ 根 `package.json`
- ✅ `.npmrc`
- ✅ `apps/` 和 `packages/` 目录

---

## Phase 4: 配置 Next.js 全栈应用 (1 天)

### 目标
- 创建 apps/web Next.js 应用
- 配置 TypeScript、Tailwind CSS
- 设置基础的目录结构

### 任务清单

#### 4.1 初始化 Next.js 应用
```bash
cd apps/web
cnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

#### 4.2 安装核心依赖
```bash
cnpm install next-auth@latest @prisma/client zod react-hook-form @hookform/resolvers
cnpm install -D prisma
```

#### 4.3 安装 shadcn/ui
```bash
cnpm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
```

#### 4.4 创建目录结构
```bash
mkdir -p src/app/(auth)/login
mkdir -p src/app/(auth)/register
mkdir -p src/app/(dashboard)/dashboard
mkdir -p src/app/(dashboard)/tasks
mkdir -p src/app/(dashboard)/gacha
mkdir -p src/app/(admin)/admin
mkdir -p src/app/api/auth
mkdir -p src/app/api/tasks
mkdir -p src/app/api/gacha
mkdir -p src/components/ui
mkdir -p src/components/auth
mkdir -p src/components/dashboard
mkdir -p src/lib
mkdir -p src/types
```

#### 4.5 配置 TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 输出物
- ✅ `apps/web/` Next.js 应用
- ✅ 基础目录结构
- ✅ TypeScript 配置
- ✅ Tailwind CSS 配置

---

## Phase 5: 迁移数据库层 (1 天)

### 目标
- 迁移 Prisma Schema
- 配置数据库连接
- 生成 Prisma Client

### 任务清单

#### 5.1 创建 Prisma 目录
```bash
cd apps/web
mkdir -p prisma
```

#### 5.2 复制 Prisma Schema
```bash
# 从备份恢复
cp ../../prisma-backup.prisma prisma/schema.prisma
```

#### 5.3 配置环境变量
```bash
# 创建 .env.local
cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
EOF
```

#### 5.4 生成 Prisma Client
```bash
npx prisma generate
```

#### 5.5 创建数据库工具文件
```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 输出物
- ✅ `prisma/schema.prisma`
- ✅ `.env.local`
- ✅ `src/lib/db.ts`
- ✅ 生成的 Prisma Client

---

## Phase 6: 实现认证系统 (1 天)

### 目标
- 配置 NextAuth.js
- 实现登录/注册页面
- 实现会话管理

### 任务清单

#### 6.1 配置 NextAuth.js
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
```

#### 6.2 创建登录页面
```typescript
// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  )
}
```

#### 6.3 创建注册页面
```typescript
// src/app/(auth)/register/page.tsx
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegisterForm />
    </div>
  )
}
```

### 输出物
- ✅ NextAuth.js 配置
- ✅ 登录页面
- ✅ 注册页面
- ✅ 认证组件

---

## Phase 7-10: 后续阶段

详细任务清单见任务管理系统。

---

## 🔄 回滚策略

如果重构失败，可以快速回滚：

```bash
# 切换回旧架构
git checkout main

# 或者恢复备份分支
git checkout backup/v1.0-architecture
git checkout -b main-restored
```

---

## ✅ 验收标准

每个 Phase 完成后，必须满足：

1. ✅ 代码可以正常编译
2. ✅ 没有 TypeScript 错误
3. ✅ 没有 ESLint 错误
4. ✅ 可以正常启动开发服务器
5. ✅ 相关功能可以正常工作

---

## 📊 进度追踪

使用任务管理工具追踪进度：

- [ ] Phase 1: 准备与评估
- [ ] Phase 2: 清理现有代码
- [ ] Phase 3: 搭建 Turborepo 基础架构
- [ ] Phase 4: 配置 Next.js 全栈应用
- [ ] Phase 5: 迁移数据库层
- [ ] Phase 6: 实现认证系统
- [ ] Phase 7: 实现 Dashboard 功能
- [ ] Phase 8: 实现任务系统
- [ ] Phase 9: 实现 Gacha 系统
- [ ] Phase 10: 测试与优化

---

**准备好开始了吗？请确认批准后，我将开始执行 Phase 1。**

