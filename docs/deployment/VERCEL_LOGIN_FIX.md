# 🔧 Vercel 测试账户登录问题修复

## 🔍 问题诊断

### 根本原因
测试账户只在**开发环境**下可用，但 Vercel 部署是**生产环境**，导致测试账户被禁用。

### 代码分析

在 `apps/web/src/lib/auth.ts` 第 31 行：

```typescript
// Development mode: Allow test accounts without database
if (process.env.NODE_ENV === 'development') {
  const testAccounts = [
    { email: 'test@maffix.com', password: 'password123', ... },
    { email: 'admin@maffix.com', password: 'password123', ... },
    { email: 'user@maffix.com', password: 'password123', ... },
  ]
  // ...
}
```

**问题**: 在 Vercel 生产环境中，`NODE_ENV === 'production'`，所以这段代码不会执行。

---

## ✅ 解决方案

### 方案 A: 启用生产环境测试账户（推荐用于演示）

修改 `apps/web/src/lib/auth.ts`，添加环境变量控制：

```typescript
// Allow test accounts in development OR when explicitly enabled
const allowTestAccounts = 
  process.env.NODE_ENV === 'development' || 
  process.env.ENABLE_TEST_ACCOUNTS === 'true'

if (allowTestAccounts) {
  const testAccounts = [
    // ... 测试账户列表
  ]
  // ...
}
```

然后在 Vercel 中添加环境变量：
```
ENABLE_TEST_ACCOUNTS=true
```

### 方案 B: 在数据库中创建真实测试账户（推荐用于生产）

在数据库中创建真实的测试用户，这样就可以正常登录。

---

## 🚀 快速修复步骤

### 步骤 1: 修改认证代码

我将修改 `auth.ts` 文件，添加环境变量控制。

### 步骤 2: 在 Vercel 中添加环境变量

1. 进入 Vercel Dashboard → 项目设置 → Environment Variables
2. 添加新变量：
   ```
   Name: ENABLE_TEST_ACCOUNTS
   Value: true
   Environments: ✅ Production, ✅ Preview
   ```
3. 保存

### 步骤 3: 重新部署

推送代码或在 Vercel 中手动触发重新部署。

---

## 📋 测试账户信息

修复后，以下测试账户将在 Vercel 上可用：

### 1. 管理员账户
```
邮箱: admin@maffix.com
密码: password123
```

### 2. 普通用户账户
```
邮箱: test@maffix.com
密码: password123
```

### 3. 备用账户
```
邮箱: user@maffix.com
密码: password123
```

---

## ⚠️ 安全注意事项

### 生产环境建议

1. **仅用于演示**: 测试账户应该只在演示环境中启用
2. **使用强密码**: 如果必须在生产环境启用，请修改密码
3. **限制权限**: 考虑限制测试账户的功能
4. **定期审查**: 定期检查测试账户的使用情况

### 长期方案

对于真正的生产环境，建议：
1. 在数据库中创建真实用户
2. 禁用测试账户功能
3. 使用正常的注册流程

---

## 🔄 替代方案：数据库用户

如果您已经配置了 DATABASE_URL，可以在数据库中创建测试用户：

```sql
-- 创建测试用户（密码: password123）
INSERT INTO "User" (id, email, name, password, role, diamonds, points, level)
VALUES 
  ('test-user-1', 'test@maffix.com', 'Test User', '$2a$10$...', 'USER', 500, 100, 1),
  ('admin-user-1', 'admin@maffix.com', 'Admin User', '$2a$10$...', 'ADMIN', 10000, 5000, 10);
```

**注意**: 密码需要使用 bcrypt 加密。

---

## 📊 验证修复

修复后，您应该能够：

1. ✅ 访问 Vercel 部署的 URL
2. ✅ 进入登录页面
3. ✅ 使用测试账户登录
4. ✅ 看到 Dashboard
5. ✅ 访问所有功能

---

## 🐛 如果仍然无法登录

请检查：

1. **环境变量是否设置**
   - 在 Vercel Dashboard 中确认 `ENABLE_TEST_ACCOUNTS=true`

2. **是否重新部署**
   - 环境变量更改后需要重新部署

3. **浏览器控制台错误**
   - 打开 F12 → Console 查看错误信息

4. **Vercel 函数日志**
   - 在 Vercel Dashboard → Deployments → Functions 查看日志

---

现在让我修复代码...
