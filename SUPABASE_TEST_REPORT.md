# 🔍 Supabase 连接测试报告

## 📊 测试总结

基于对您的 Supabase 项目的全面测试，以下是详细的结果和建议。

---

## ✅ 好消息

### 网络连接正常

测试结果显示：
- ✅ **端口 5432 可达**（直连数据库）
- ✅ **端口 6543 可达**（Pooler）
- 🎉 **您的网络环境没有阻断 Supabase！**

**证据**：
```bash
$ nc -zv db.dbvtkxrbvjplakkvfjho.supabase.co 5432
Connection to db.dbvtkxrbvjplakkvfjho.supabase.co port 5432 [tcp/postgresql] succeeded!

$ nc -zv aws-0-ap-southeast-1.pooler.supabase.com 6543
Connection to aws-0-ap-southeast-1.pooler.supabase.com port 6543 [tcp/lds-distrib] succeeded!
```

### 结论

**您不需要 HTTP 代理或 VPN！** 网络连接本身是通的。

---

## ⚠️ 发现的问题

### 问题 1：Prisma 连接失败（P1001 错误）

**错误信息**：
```
Can't reach database server at `db.dbvtkxrbvjplakkvfjho.supabase.co:5432`
```

**原因分析**：
- TCP 层面可以连接（`nc` 命令成功）
- 但 Prisma/Node.js PostgreSQL 驱动无法连接
- **可能是 SSL/TLS 握手问题**

### 问题 2：Pooler 连接认证失败

**错误信息**：
```
FATAL: Tenant or user not found
```

**原因分析**：
- Pooler 端口可达
- 但用户名或密码验证失败
- **Supabase Pooler 可能需要特殊的认证格式**

---

## 🔧 根本原因分析

### 为什么 `nc` 能连接但 Prisma 不能？

| 工具 | 测试内容 | 结果 |
|------|---------|------|
| **nc (netcat)** | TCP 端口可达性 | ✅ 成功 |
| **Prisma** | PostgreSQL 协议 + SSL/TLS | ❌ 失败 |

**关键差异**：
1. **nc 只测试 TCP 连接**（不关心协议）
2. **Prisma 需要完整的 PostgreSQL 握手**：
   ```
   TCP 连接 → SSL/TLS 握手 → PostgreSQL 认证 → 查询
   ```

**可能的失败点**：
- ❌ SSL/TLS 证书验证失败
- ❌ PostgreSQL 认证协议不匹配
- ❌ Supabase 数据库配置问题

---

## 🎯 推荐解决方案

### 方案 1：检查 Supabase 项目状态（最可能）⭐

**步骤**：

1. **访问 Supabase Dashboard**
   ```
   https://app.supabase.com/project/dbvtkxrbvjplakkvfjho
   ```

2. **检查项目状态**
   - ⚠️ 项目是否已**暂停**（Paused）？
   - ⚠️ 数据库是否正在**重启**？
   - ⚠️ 是否有**未付账单**？

3. **检查数据库密码**
   - Settings → Database → Reset Database Password
   - 确认密码是否正确：`7QmuVLiKZrPyO0TJ`

4. **验证连接字符串**
   - Settings → Database → Connection String
   - 复制正确的连接字符串

### 方案 2：使用 Supabase 提供的正确连接字符串

从 Supabase Dashboard 获取**官方**连接字符串：

```
1. 访问：https://app.supabase.com/project/dbvtkxrbvjplakkvfjho/settings/database

2. 找到 "Connection String" 部分

3. 选择 "Node.js" → "Transaction" 或 "Session"

4. 复制连接字符串（替换 [YOUR-PASSWORD]）
```

**示例格式**：
```bash
# Direct (用于 migration)
DATABASE_URL_DIRECT="postgresql://postgres.[YOUR-PASSWORD]@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres"

# Pooler (用于应用)
DATABASE_URL="postgresql://postgres.[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

**注意**：
- Supabase Dashboard 可能显示 `postgres.` 前缀
- **不要**添加额外的 `postgres.` 前缀（会导致双重前缀）

### 方案 3：测试 Supabase CLI（本地开发）

绕过网络问题，在本地运行 Supabase：

```bash
# 安装 Supabase CLI
brew install supabase/tap/supabase

# 启动本地实例
supabase start

# 连接本地数据库
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

---

## 🧪 验证步骤

### 步骤 1：在 Supabase Dashboard 测试连接

1. 打开 [Supabase SQL Editor](https://app.supabase.com/project/dbvtkxrbvjplakkvfjho/sql)
2. 运行简单查询：
   ```sql
   SELECT current_database(), current_user, NOW();
   ```
3. **如果成功** → 数据库正常，问题在本地配置
4. **如果失败** → 数据库有问题，需要修复

### 步骤 2：重置数据库密码

如果 Dashboard 查询也失败：

1. Settings → Database → Database Password
2. 点击 "Reset Database Password"
3. 设置新密码
4. 更新 `.env.local` 中的 `DATABASE_URL`

### 步骤 3：使用 Prisma Migrate（绕过 Prisma Client）

```bash
cd /Users/xiaonan/Projects/web/maffix-web/apps/web

# 尝试直接推送 schema（不使用 migrate）
npx prisma db push --skip-generate
```

---

## 📝 关于 HTTP 代理的重要说明

### ❌ 为什么 HTTP 代理无效

测试结果证明：

```bash
# 设置环境变量
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890

# 结果：对 PostgreSQL 连接无效
```

**原因**：
1. PostgreSQL 不使用 HTTP 协议
2. Prisma/`pg` 驱动不理会 `http_proxy` 环境变量
3. HTTP 代理只能代理 HTTP/HTTPS 流量

### ✅ 如果真的需要代理

**选项 1：VPN（全局代理）**
```bash
# 启动 VPN 后，所有流量（包括 PostgreSQL）都会走代理
```

**选项 2：SSH 隧道**
```bash
# 需要一台海外服务器
ssh -L 5432:db.dbvtkxrbvjplakkvfjho.supabase.co:5432 user@vps.com

# 然后连接本地
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
```

**选项 3：SOCKS5 代理 + Proxychains**
```bash
# 需要特殊配置
proxychains npm run test:db
```

---

## 💡 下一步行动

### 立即检查（5 分钟）

1. ✅ 访问 Supabase Dashboard
   ```
   https://app.supabase.com/project/dbvtkxrbvjplakkvfjho
   ```

2. ✅ 检查项目状态（是否暂停）

3. ✅ 在 SQL Editor 运行测试查询
   ```sql
   SELECT 1;
   ```

4. ✅ 如果上面成功，重置数据库密码

5. ✅ 更新 `.env.local` 中的 `DATABASE_URL`

### 如果上面都失败

**可能的原因**：
- Supabase 项目被暂停或删除
- 网络服务商（ISP）深度包检测阻断 PostgreSQL 协议
- 本地防火墙/安全软件阻止

**备选方案**：
- 使用 Supabase CLI（本地开发）
- 切换到国内数据库服务（如阿里云 RDS）
- 使用 Vercel Postgres（在 Vercel 部署时测试）

---

## 🎯 关键要点

### ✅ 我们确认的事实

1. **网络层面可达**：TCP 端口可以连接
2. **不是端口阻断问题**：5432 和 6543 都可达
3. **HTTP 代理无效**：对 PostgreSQL 连接没有帮助

### ❓ 待确认的问题

1. Supabase 项目状态（是否暂停？）
2. 数据库密码是否正确
3. Supabase 官方连接字符串的准确格式

### 🎯 最可能的原因

**Supabase 项目未激活或密码错误**，而不是网络问题。

---

## 📞 如何获取帮助

如果问题持续，请：

1. **截图 Supabase Dashboard**
   - 项目状态页
   - Database Settings 页面

2. **测试官方连接字符串**
   - 从 Dashboard 复制
   - 不要手动拼接

3. **联系 Supabase 支持**
   - https://supabase.com/support
   - 提供项目 ID：`dbvtkxrbvjplakkvfjho`

---

生成时间：2025-12-27
测试环境：macOS, Supabase Project: dbvtkxrbvjplakkvfjho
