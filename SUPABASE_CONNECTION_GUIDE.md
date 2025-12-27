# Supabase 连接优化指南

## 📋 问题诊断

### 当前状态
- ❌ **直连失败**：端口 5432 无法连接（可能被防火墙阻断）
- ❌ **HTTP代理无效**：PostgreSQL 不使用 HTTP 协议，HTTP 代理对数据库连接无效
- ✅ **网络基础连通**：ping 成功，说明 IP 层面可达

### 根本原因
从中国连接 Supabase 时：
1. **端口阻断**：某些 ISP 会阻断非标准端口（如 PostgreSQL 的 5432）
2. **协议限制**：HTTP 代理只支持 HTTP/HTTPS 流量，不支持 PostgreSQL 二进制协议

---

## ✅ 推荐解决方案

### 方案 1：使用 Supabase Pooler（强烈推荐）⭐

Supabase 提供连接池服务，使用端口 6543（通常更少被阻断）：

#### 步骤 1：获取 Pooler 连接字符串

```bash
# 方法 A：从 Supabase Dashboard 获取
# 1. 访问 https://app.supabase.com/project/dbvtkxrbvjplakkvfjho/settings/database
# 2. 找到 "Connection String" > "Transaction Mode"
# 3. 选择 "Node.js" > "Pooler"

# 方法 B：手动构建
# 格式：postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

#### 步骤 2：更新 .env.local

```bash
# 原始连接（直连，端口 5432）
# DATABASE_URL="postgresql://postgres:7QmuVLiKZrPyO0TJ@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres"

# 新连接（Pooler，端口 6543）✅ 推荐
DATABASE_URL="postgresql://postgres.dbvtkxrbvjplakkvfjho:7QmuVLiKZrPyO0TJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 或者使用 Session Mode（适合长连接）
DATABASE_URL="postgresql://postgres.dbvtkxrbvjplakkvfjho:7QmuVLiKZrPyO0TJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**重要提示**：
- Pooler URL 格式：`postgres.[PROJECT_REF]`（注意有 `.postgres` 前缀）
- 必须添加 `?pgbouncer=true` 参数
- 端口是 `6543` 而不是 `5432`

#### 步骤 3：更新 Prisma Schema（可选，用于迁移）

```prisma
// apps/web/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // 添加 directUrl（用于 prisma migrate）
  directUrl = env("DIRECT_DATABASE_URL")
}
```

```bash
# .env.local
# Pooler URL（用于应用运行）
DATABASE_URL="postgresql://postgres.dbvtkxrbvjplakkvfjho:7QmuVLiKZrPyO0TJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct URL（用于 schema migration）
DIRECT_DATABASE_URL="postgresql://postgres:7QmuVLiKZrPyO0TJ@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres"
```

#### 优点
- ✅ 端口 6543 更少被阻断
- ✅ 内置连接池，性能更好
- ✅ Supabase 官方推荐用于远程连接
- ✅ 自动管理连接生命周期

#### 缺点
- ⚠️ 某些 PostgreSQL 特性可能受限（如 prepared statements）
- ⚠️ Migration 时需要使用 direct URL

---

### 方案 2：使用 SSH 隧道（高级）

如果 Pooler 也不行，可以创建 SSH 隧道：

```bash
# 创建 SSH 隧道（需要一台能连接 Supabase 的服务器）
ssh -L 5432:db.dbvtkxrbvjplakkvfjho.supabase.co:5432 user@your-server.com

# 然后连接本地端口
DATABASE_URL="postgresql://postgres:7QmuVLiKZrPyO0TJ@localhost:5432/postgres"
```

**适用场景**：
- 您有一台海外服务器（VPS）
- 需要稳定的开发环境

---

### 方案 3：使用 Supabase CLI（本地开发）

在本地运行 Supabase 实例：

```bash
# 安装 Supabase CLI
brew install supabase/tap/supabase

# 启动本地实例
supabase start

# 本地数据库会自动在 localhost:5432
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

**优点**：
- ✅ 零延迟（本地运行）
- ✅ 完全控制
- ✅ 离线开发

**缺点**：
- ⚠️ 需要定期同步生产数据
- ⚠️ 资源占用较大

---

## 🧪 测试连接

### 测试脚本 1：使用 Pooler URL

```bash
cd /Users/xiaonan/Projects/web/maffix-web/apps/web

# 测试 Pooler 连接
DATABASE_URL="postgresql://postgres.dbvtkxrbvjplakkvfjho:7QmuVLiKZrPyO0TJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true" \
npm run test:db
```

### 测试脚本 2：手动测试 Pooler 端口

```bash
# 检查 Pooler 端口是否可达
nc -zv aws-0-ap-southeast-1.pooler.supabase.com 6543

# 或使用 telnet
telnet aws-0-ap-southeast-1.pooler.supabase.com 6543
```

---

## 📊 预期性能

### 使用 Pooler 后的预期延迟

| 操作 | 预期延迟 | 评价 |
|------|---------|------|
| 简单查询 (SELECT 1) | 180-280ms | ⭐⭐⭐⭐ 可接受 |
| 复杂查询 (COUNT) | 250-400ms | ⭐⭐⭐ 可用 |
| 事务操作 | 300-500ms | ⭐⭐⭐ 需要优化 |
| Prisma Studio | 200-350ms | ⭐⭐⭐⭐ 良好 |

### 优化建议

1. **启用 Prisma 连接池**
   ```typescript
   // src/lib/db.ts
   const prisma = new PrismaClient({
     log: ['query', 'error', 'warn'],
     datasources: {
       db: {
         url: process.env.DATABASE_URL
       }
     }
   });
   ```

2. **使用缓存减少数据库查询**
   ```typescript
   // 热点数据缓存
   import { unstable_cache } from 'next/cache'

   export const getCachedUser = unstable_cache(
     async (id: string) => prisma.user.findUnique({ where: { id } }),
     ['user'],
     { revalidate: 60 } // 缓存 60 秒
   );
   ```

3. **批量操作替代多次查询**
   ```typescript
   // ❌ 不好
   for (const id of userIds) {
     await prisma.user.findUnique({ where: { id } })
   }

   // ✅ 好
   await prisma.user.findMany({
     where: { id: { in: userIds } }
   })
   ```

---

## 🚀 快速实施步骤

### 步骤 1：获取正确的 Pooler URL

```bash
# 访问 Supabase Dashboard
# https://app.supabase.com/project/dbvtkxrbvjplakkvfjho/settings/database

# 复制 Pooler 连接字符串（Transaction Mode）
# 格式类似：
# postgresql://postgres.dbvtkxrbvjplakkvfjho:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 步骤 2：更新 .env.local

```bash
# 编辑文件
vim /Users/xiaonan/Projects/web/maffix-web/.env.local

# 替换 DATABASE_URL 为 Pooler URL（记得添加 ?pgbouncer=true）
DATABASE_URL="postgresql://postgres.dbvtkxrbvjplakkvfjho:7QmuVLiKZrPyO0TJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 如果需要运行 migration，也添加 DIRECT_DATABASE_URL
DIRECT_DATABASE_URL="postgresql://postgres:7QmuVLiKZrPyO0TJ@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres"
```

### 步骤 3：测试连接

```bash
cd /Users/xiaonan/Projects/web/maffix-web/apps/web
npm run test:db
```

### 步骤 4：启动开发服务器

```bash
npm run dev
# 访问 http://localhost:3000
```

---

## ❓ 常见问题

### Q1: Pooler 连接也失败了怎么办？

**A**: 尝试以下方案：
1. 确认 Pooler URL 格式正确（特别是 `postgres.` 前缀）
2. 检查是否添加了 `?pgbouncer=true`
3. 尝试 Session Mode（去掉 `?pgbouncer=true`）
4. 使用本地 Supabase CLI（方案 3）

### Q2: 开发环境连接成功，但 Vercel 部署失败？

**A**: Vercel 不需要代理，确保：
1. Vercel 的环境变量使用 Pooler URL
2. Vercel 部署在海外区域（默认），延迟较低
3. 不要在 Vercel 中使用 DIRECT_DATABASE_URL

### Q3: 迁移 (prisma migrate) 失败？

**A**: Migration 需要 direct connection：
```bash
# 使用 DIRECT_DATABASE_URL
DIRECT_DATABASE_URL="postgresql://postgres:7QmuVLiKZrPyO0TJ@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres" \
npx prisma migrate dev

# 如果还是失败，使用 Supabase Dashboard 的 SQL Editor 手动执行
```

### Q4: HTTP 代理是否有助于改善连接？

**A**: **不会**。原因：
- PostgreSQL 使用自定义二进制协议
- HTTP/HTTPS 代理只支持 HTTP 协议
- 环境变量 `http_proxy`/`https_proxy` 只影响 HTTP 客户端（如 fetch、axios）
- Prisma/PostgreSQL 驱动不读取这些环境变量

**如果您想使用代理**，需要：
- 使用 SOCKS5 代理（需要特殊配置）
- 或 SSH 隧道
- 或使用 VPN（全局代理所有流量）

---

## 📚 参考资源

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma Connection Pool](https://www.prisma.io/docs/concepts/components/prisma-client/data-proxy#connection-pool)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

## ✅ 总结

**推荐配置**：

```bash
# .env.local
DATABASE_URL="postgresql://postgres.dbvtkxrbvjplakkvfjho:7QmuVLiKZrPyO0TJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_DATABASE_URL="postgresql://postgres:7QmuVLiKZrPyO0TJ@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres"
```

**使用场景**：
- **开发环境**：使用 `DATABASE_URL`（Pooler）
- **Migration**：使用 `DIRECT_DATABASE_URL`
- **Vercel 部署**：使用 `DATABASE_URL`（Pooler）

**预期结果**：
- ✅ 连接成功
- ✅ 延迟 200-300ms（可接受）
- ✅ 开发体验良好

---

生成时间：2025-12-27
项目：Maffix Web v2.0
