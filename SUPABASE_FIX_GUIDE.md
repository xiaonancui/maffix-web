# 🔧 Supabase 连接问题修复指南

## 问题诊断

当前遇到的问题：
- ✅ Prisma CLI 可以连接数据库（`prisma db execute` 成功）
- ❌ Prisma Client 在运行时无法连接（超时错误）

这通常是由于：
1. Supabase 免费版数据库自动暂停
2. 网络连接问题
3. 连接池配置问题

---

## 🚀 解决方案

### 方案 1：在 Supabase Dashboard 中创建测试用户（推荐）⭐

这是最快速可靠的方法。

#### 步骤：

1. **登录 Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **选择您的项目**
   - 项目名称：`dbvtkxrbvjplakkvfjho`

3. **检查数据库状态**
   - 如果显示 "Paused"，点击 "Resume" 恢复数据库
   - 等待 1-2 分钟让数据库完全启动

4. **打开 SQL Editor**
   - 左侧菜单 → SQL Editor
   - 点击 "New query"

5. **运行创建用户的 SQL**
   
   复制并运行 `apps/web/scripts/create-test-users.sql` 中的内容，或直接运行：

   ```sql
   -- 创建测试用户（密码：password123）
   INSERT INTO "User" (
     id, email, name, password, role, 
     "diamondBalance", points, level, 
     "createdAt", "updatedAt"
   )
   VALUES (
     gen_random_uuid(),
     'user@maffix.com',
     'Test User',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIvAprzZ3.',
     'USER',
     500, 100, 1,
     NOW(), NOW()
   )
   ON CONFLICT (email) DO NOTHING;

   -- 创建管理员（密码：password123）
   INSERT INTO "User" (
     id, email, name, password, role, 
     "diamondBalance", points, level, 
     "createdAt", "updatedAt"
   )
   VALUES (
     gen_random_uuid(),
     'admin@maffix.com',
     'Admin User',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIvAprzZ3.',
     'ADMIN',
     10000, 5000, 10,
     NOW(), NOW()
   )
   ON CONFLICT (email) DO NOTHING;

   -- 验证创建成功
   SELECT email, name, role, "diamondBalance" 
   FROM "User" 
   WHERE email IN ('user@maffix.com', 'admin@maffix.com');
   ```

6. **点击 "Run" 执行**
   - 应该看到 2 行插入成功
   - 最后的 SELECT 会显示创建的用户

7. **重启开发服务器**
   ```bash
   # 停止当前服务器（Ctrl+C）
   npm run dev
   ```

8. **测试登录**
   - 访问：http://localhost:3001/login
   - 使用：`user@maffix.com` / `password123`
   - 或：`admin@maffix.com` / `password123`

---

### 方案 2：修复 Supabase 连接配置

如果方案 1 完成后仍然无法注册新用户：

#### 步骤 1：获取正确的连接字符串

1. **在 Supabase Dashboard 中**
   - Settings → Database
   - 找到 "Connection string" 部分

2. **选择 "Session mode"（不是 Transaction mode）**
   - 复制 URI 格式的连接字符串
   - 格式：`postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

3. **确保密码正确**
   - 如果忘记密码，可以在 Database Settings 中重置

#### 步骤 2：更新 .env 文件

```bash
cd apps/web
```

编辑 `.env` 文件：

```env
# 使用您从 Supabase 复制的连接字符串
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.dbvtkxrbvjplakkvfjho.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="maffix-secret-key-change-this-in-production-please-use-a-long-random-string"

# OAuth (可选)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXT_PUBLIC_APP_NAME="Maffix"
```

#### 步骤 3：同步到 .env.local

```bash
cp .env .env.local
```

#### 步骤 4：重新生成 Prisma Client

```bash
npx prisma generate
```

#### 步骤 5：重启开发服务器

```bash
cd ../..
npm run dev
```

---

### 方案 3：添加测试数据（可选）

如果连接修复后，想要添加任务和奖品数据：

1. **在 Supabase SQL Editor 中运行**

```sql
-- 创建示例任务
INSERT INTO "Task" (id, title, description, type, difficulty, points, diamonds, "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Follow on Social Media', 'Follow our official account', 'SOCIAL', 'EASY', 10, 5, true, NOW(), NOW()),
  (gen_random_uuid(), 'Write a Review', 'Write a review about our music', 'CONTENT', 'MEDIUM', 50, 25, true, NOW(), NOW()),
  (gen_random_uuid(), 'Daily Check-in', 'Check in daily to earn rewards', 'DAILY', 'EASY', 5, 2, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 创建示例奖品
INSERT INTO "Prize" (id, name, description, type, rarity, value, stock, "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Exclusive Sticker Pack', 'Limited edition stickers', 'PHYSICAL', 'COMMON', 10, 100, true, NOW(), NOW()),
  (gen_random_uuid(), 'VIP Concert Ticket', 'Front row seat at next concert', 'EXPERIENCE', 'EPIC', 500, 10, true, NOW(), NOW()),
  (gen_random_uuid(), 'Meet & Greet Pass', 'Personal meet and greet session', 'EXPERIENCE', 'LEGENDARY', 1000, 5, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 为奖品创建 Gacha 配置
INSERT INTO "GachaItem" ("prizeId", probability, "isActive")
SELECT id, 
  CASE 
    WHEN rarity = 'COMMON' THEN 40.0
    WHEN rarity = 'RARE' THEN 25.0
    WHEN rarity = 'EPIC' THEN 15.0
    WHEN rarity = 'LEGENDARY' THEN 5.0
  END,
  true
FROM "Prize"
WHERE "isActive" = true
ON CONFLICT DO NOTHING;
```

---

## 🧪 验证修复

### 1. 测试登录

```bash
# 访问登录页面
open http://localhost:3001/login

# 使用测试账户
Email: user@maffix.com
Password: password123
```

### 2. 测试注册（如果连接修复）

```bash
# 访问注册页面
open http://localhost:3001/register

# 创建新账户
Name: Your Name
Email: your@email.com
Password: password123
```

### 3. 测试 Dashboard

登录后应该能看到：
- ✅ 用户统计（Diamonds, Points, Level）
- ✅ 快速操作按钮
- ✅ 账户信息

---

## 📊 测试账户信息

创建成功后，您将拥有以下测试账户：

| 账户类型 | 邮箱 | 密码 | Diamonds | 角色 |
|---------|------|------|----------|------|
| 普通用户 | user@maffix.com | password123 | 500 💎 | USER |
| 管理员 | admin@maffix.com | password123 | 10,000 💎 | ADMIN |
| 艺术家 | artist@maffix.com | password123 | 1,000 💎 | ARTIST |

---

## 🔍 故障排查

### 问题：数据库仍然无法连接

**检查清单：**
- [ ] Supabase 项目是否处于活动状态（不是 Paused）
- [ ] 密码是否正确
- [ ] 网络连接是否正常
- [ ] 防火墙是否阻止了连接

**解决方法：**
1. 在 Supabase Dashboard 中点击 "Resume" 恢复数据库
2. 等待 2-3 分钟让数据库完全启动
3. 重新测试连接

### 问题：SQL 执行失败

**可能原因：**
- 表不存在（需要先运行 `prisma db push`）
- 用户已存在（使用 `ON CONFLICT` 子句避免）

**解决方法：**
```bash
cd apps/web
npx prisma db push
# 然后重新运行 SQL
```

### 问题：登录失败

**检查：**
- [ ] 用户是否成功创建（在 Supabase Table Editor 中查看 User 表）
- [ ] 密码哈希是否正确
- [ ] NextAuth 配置是否正确

---

## 📞 需要帮助？

如果以上方法都不行，请提供：
1. Supabase Dashboard 中的数据库状态截图
2. 浏览器控制台的错误信息（F12 → Console）
3. 开发服务器的错误日志

---

## ✅ 成功标志

修复成功后，您应该能够：
- ✅ 访问 http://localhost:3001/login
- ✅ 使用测试账户登录
- ✅ 看到 Dashboard 页面
- ✅ 浏览任务和 Gacha 页面
- ✅ （如果连接修复）注册新用户

---

**祝您修复顺利！** 🚀

