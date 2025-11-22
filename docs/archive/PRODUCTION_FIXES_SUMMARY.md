# 🔧 生产环境问题修复总结

## 📋 问题概述

在 Vercel 生产环境（www.maffix.xyz）中，测试账户登录后出现多个功能性问题：

1. ❌ **Release 页面** - 封面图片不显示
2. ❌ **Mission 页面** - Mock 数据消失
3. ❌ **Gacha 页面** - 钻石数量显示为 0
4. ❌ **Tasks 页面** - Mock 数据消失
5. ❌ **Profile 页面** - Mock 数据消失
6. ❌ **所有页面** - 测试账户的 mock data 在生产环境不加载

---

## 🔍 根本原因

### 问题 1: 测试账户检测逻辑错误

**所有服务器端页面**的测试账户检测逻辑只检查 `NODE_ENV === 'development'`，没有检查 `ENABLE_TEST_ACCOUNTS` 环境变量：

```typescript
// ❌ 错误的逻辑（只在开发环境生效）
const isTestAccount = process.env.NODE_ENV === 'development' &&
  (session.user.id?.includes('test-') || ...)

// ✅ 正确的逻辑（支持生产环境）
const allowTestAccounts =
  process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

const isTestAccount =
  allowTestAccounts &&
  (session.user.id?.includes('test-') || ...)
```

**影响范围**：
- `/dashboard/tasks` - 任务页面
- `/dashboard/gacha` - 抽奖页面
- `/dashboard/profile` - 个人资料页面
- `/dashboard/missions` - 任务页面
- `/dashboard/missions/[id]` - 任务详情页面
- `/dashboard/prizes` - 奖品页面
- `/dashboard/orders` - 订单页面
- `/dashboard/purchases` - 购买历史页面
- `/dashboard/store/packs` - Premium Packs 页面

### 问题 2: Next.js 图片域名配置缺失

**Release 页面**使用 YouTube 缩略图（`i.ytimg.com`），但该域名未在 `next.config.js` 的 `remotePatterns` 中配置，导致图片无法加载。

```javascript
// ❌ 缺少 YouTube 图片域名
images: {
  remotePatterns: [
    { hostname: 'images.unsplash.com' },
    { hostname: '**.supabase.co' },
  ]
}

// ✅ 添加 YouTube 图片域名
images: {
  remotePatterns: [
    { hostname: 'images.unsplash.com' },
    { hostname: '**.supabase.co' },
    { hostname: 'i.ytimg.com' },        // YouTube 缩略图
    { hostname: 'img.youtube.com' },    // YouTube 备用域名
  ]
}
```

---

## ✅ 修复内容

### 1. 修复所有页面的测试账户检测逻辑

**修改的文件**（共 9 个）：

1. ✅ `apps/web/src/app/(dashboard)/tasks/page.tsx`
2. ✅ `apps/web/src/app/(dashboard)/gacha/page.tsx`
3. ✅ `apps/web/src/app/(dashboard)/profile/page.tsx`
4. ✅ `apps/web/src/app/(dashboard)/missions/page.tsx`
5. ✅ `apps/web/src/app/(dashboard)/missions/[id]/page.tsx`
6. ✅ `apps/web/src/app/(dashboard)/prizes/page.tsx`
7. ✅ `apps/web/src/app/(dashboard)/orders/page.tsx`
8. ✅ `apps/web/src/app/(dashboard)/purchases/page.tsx`
9. ✅ `apps/web/src/app/(dashboard)/store/packs/page.tsx`

**修改内容**：
```typescript
// 在每个页面的测试账户检测逻辑前添加：
const allowTestAccounts =
  process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

const isTestAccount =
  allowTestAccounts &&
  (session.user.id?.includes('test-') ||
    session.user.id?.includes('demo-') ||
    session.user.id?.includes('admin-'))
```

### 2. 修复 Release 页面图片加载问题

**修改的文件**：
- ✅ `apps/web/next.config.js`

**修改内容**：
```javascript
images: {
  remotePatterns: [
    // ... 现有配置
    {
      protocol: 'https',
      hostname: 'i.ytimg.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'img.youtube.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

---

## 🚀 部署步骤

### 步骤 1: 提交代码

```bash
git add -A
git commit -m "fix: enable test accounts in production and fix YouTube image loading

- Fix test account detection logic in all dashboard pages
- Add ENABLE_TEST_ACCOUNTS environment variable check
- Add YouTube image domains to Next.js config
- Fixes mock data not loading in production
- Fixes Release page cover images not displaying"
git push origin main
```

### 步骤 2: 确认 Vercel 环境变量

确保 Vercel 中已设置以下环境变量：

```
ENABLE_TEST_ACCOUNTS=true
NEXTAUTH_URL=https://www.maffix.xyz
NEXTAUTH_SECRET=your-secret-key-here
```

**检查方法**：
1. 访问 https://vercel.com/dashboard
2. 选择 `maffix-web` 项目
3. Settings → Environment Variables
4. 确认 `ENABLE_TEST_ACCOUNTS` 存在且值为 `true`
5. 确认在 **Production** 环境中启用

### 步骤 3: 等待部署完成

Vercel 会自动检测 GitHub 推送并开始部署。等待部署完成（通常 2-3 分钟）。

### 步骤 4: 清除浏览器缓存

```bash
# 使用无痕模式测试，或清除浏览器缓存
# Chrome: Cmd+Shift+Delete (Mac) / Ctrl+Shift+Delete (Windows)
```

---

## 🧪 测试清单

部署完成后，使用测试账户登录并验证以下功能：

### 测试账户

```
Email: admin@maffix.com
Password: password123
```

### 功能测试

- [ ] **Dashboard 页面** (`/dashboard`)
  - [ ] 显示钻石余额（admin 应该是 10,000 💎）
  - [ ] 显示积分（admin 应该是 5,000 ⭐）
  - [ ] 显示等级（admin 应该是 Level 10）

- [ ] **Tasks 页面** (`/tasks`)
  - [ ] 显示 3 个模拟任务
  - [ ] 任务卡片显示奖励（💎 和 ⭐）
  - [ ] 可以点击提交按钮

- [ ] **Gacha 页面** (`/gacha`)
  - [ ] 显示钻石余额：10,000 💎
  - [ ] 显示 3 个奖品（VIP Concert Ticket, Signed Album, Exclusive Sticker Pack）
  - [ ] 显示抽奖按钮（Single Draw 和 10x Draw）
  - [ ] 显示 Pity Counter

- [ ] **Missions 页面** (`/missions`)
  - [ ] 显示多个 TikTok 任务
  - [ ] 任务按类型分组（FOLLOW, LIKE, COMMENT, SHARE, DUET）
  - [ ] 显示奖励信息

- [ ] **Prizes 页面** (`/prizes`)
  - [ ] 显示模拟奖品列表
  - [ ] 显示奖品稀有度（LEGENDARY, EPIC, RARE）
  - [ ] 显示兑换按钮

- [ ] **Profile 页面** (`/profile`)
  - [ ] 显示用户信息（Admin User, admin@maffix.com）
  - [ ] 显示钻石余额：10,000 💎
  - [ ] 显示积分：5,000 ⭐
  - [ ] 显示等级：Level 10
  - [ ] 显示统计数据

- [ ] **Store 页面** (`/store`)
  - [ ] 显示 8 个商品
  - [ ] 商品图片正常显示（Unsplash 图片）
  - [ ] 可以点击商品查看详情

- [ ] **Releases 页面** (`/releases`)
  - [ ] ✅ **封面图片正常显示**（YouTube 缩略图）
  - [ ] 显示 10 个音乐视频
  - [ ] 可以点击播放视频

- [ ] **Orders 页面** (`/orders`)
  - [ ] 显示模拟订单历史
  - [ ] 显示订单状态和追踪信息

- [ ] **Purchases 页面** (`/purchases`)
  - [ ] 显示 Premium Pack 购买历史
  - [ ] 显示奖励发放状态

---

## 📊 预期结果

### 修复前 ❌

- **Tasks 页面**: "No tasks available at the moment."
- **Gacha 页面**: 钻石余额显示 0 💎
- **Missions 页面**: 空白或无数据
- **Profile 页面**: 数据不完整
- **Releases 页面**: 封面图片不显示（显示占位符或错误）

### 修复后 ✅

- **Tasks 页面**: 显示 3 个模拟任务
- **Gacha 页面**: 显示 10,000 💎（admin 账户）
- **Missions 页面**: 显示完整的 TikTok 任务列表
- **Profile 页面**: 显示完整的用户信息和统计数据
- **Releases 页面**: 所有封面图片正常显示

---

## 🔍 诊断工具

如果问题仍然存在，使用以下诊断工具：

### 1. 检查环境变量

访问：`https://www.maffix.xyz/api/test-env`

**期望输出**：
```json
{
  "environment": {
    "nodeEnv": "production",
    "enableTestAccounts": "true",
    "allowTestAccounts": true
  },
  "testAccountsEnabled": true,
  "diagnosis": {
    "canUseTestAccounts": true,
    "reason": "Test accounts are enabled"
  }
}
```

### 2. 检查浏览器控制台

打开浏览器开发者工具（F12），查看：
- **Console** 标签：查找错误信息
- **Network** 标签：查找失败的请求
- **Application** → **Cookies**：确认 session cookie 存在

### 3. 检查 Vercel 函数日志

1. 访问 https://vercel.com/dashboard
2. 选择 `maffix-web` 项目
3. 点击 **Logs** 标签
4. 查找登录和页面加载的日志

---

## 📝 技术说明

### 为什么需要 `ENABLE_TEST_ACCOUNTS` 环境变量？

在生产环境中，`NODE_ENV` 始终是 `'production'`，因此原来的检测逻辑：

```typescript
const isTestAccount = process.env.NODE_ENV === 'development' && ...
```

在生产环境中永远返回 `false`，导致测试账户无法加载 mock data。

通过添加 `ENABLE_TEST_ACCOUNTS` 环境变量，我们可以在生产环境中显式启用测试账户：

```typescript
const allowTestAccounts =
  process.env.NODE_ENV === 'development' || 
  process.env.ENABLE_TEST_ACCOUNTS === 'true'
```

### 为什么 Release 页面图片不显示？

Next.js 的 `<Image>` 组件要求所有外部图片域名必须在 `next.config.js` 中配置。这是出于安全考虑，防止恶意图片加载。

YouTube 缩略图使用 `i.ytimg.com` 域名，必须添加到 `remotePatterns` 中才能正常加载。

---

## ✅ 修复完成

所有问题已修复，代码已准备好部署到生产环境。

**下一步**：
1. 提交并推送代码到 GitHub
2. 等待 Vercel 自动部署
3. 使用测试账户验证所有功能
4. 如有问题，查看诊断工具输出

---

**修复日期**: 2025-10-22  
**修复人员**: Augment Agent  
**影响范围**: 所有 Dashboard 页面 + Release 页面图片加载

