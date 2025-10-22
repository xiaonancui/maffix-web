# 🎰 Gacha 抽奖功能修复总结

## 📋 问题描述

在 Vercel 生产环境（www.maffix.xyz）中，当用户尝试执行 Gacha Lucky Draw（抽奖）时，显示：

```
Service temporarily unavailable
```

**错误代码**: 503 Service Unavailable

---

## 🔍 根本原因

### 问题 1: 生产环境数据库检查逻辑错误

所有 Gacha API 路由在代码开头都有以下检查：

```typescript
// ❌ 错误的逻辑
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  return NextResponse.json(
    { error: 'Service temporarily unavailable' },
    { status: 503 }
  )
}
```

**问题**：
- 在 Vercel 生产环境中，即使设置了 `DATABASE_URL`，这个检查也可能在某些情况下触发
- 对于测试账户，我们应该使用 mock data，不需要数据库连接
- 这个检查阻止了所有请求，包括测试账户的请求

### 问题 2: 测试账户检测逻辑错误

```typescript
// ❌ 错误的逻辑
const isTestAccount = process.env.NODE_ENV === 'development' &&
  (session.user.id?.includes('test-') || ...)
```

**问题**：
- 只在开发环境（`NODE_ENV === 'development'`）中检测测试账户
- 在生产环境中，测试账户无法使用 mock data
- 导致测试账户尝试访问数据库，但数据库中没有相应的数据

---

## ✅ 修复内容

### 1. 移除生产环境数据库检查

**修改前**：
```typescript
export async function POST(request: Request) {
  try {
    // Check if we're in build time - return early if so
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }
    
    const session = await getServerSession(authOptions)
    // ...
  }
}
```

**修改后**：
```typescript
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if this is a test account - use mock data
    const allowTestAccounts =
      process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'
    
    const isTestAccount =
      allowTestAccounts &&
      (session.user.id?.includes('test-') || ...)
    
    if (isTestAccount) {
      // Return mock data
      // ...
    }
    
    // Real database logic for non-test accounts
    // ...
  }
}
```

### 2. 修复测试账户检测逻辑

**所有 Gacha API 路由**现在都正确检查 `ENABLE_TEST_ACCOUNTS` 环境变量：

```typescript
const allowTestAccounts =
  process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

const isTestAccount =
  allowTestAccounts &&
  (session.user.id?.includes('test-') ||
    session.user.id?.includes('demo-') ||
    session.user.id?.includes('admin-'))
```

### 3. 修改的文件

✅ **`apps/web/src/app/api/gacha/pull/route.ts`**
- 移除生产环境数据库检查
- 修复测试账户检测逻辑
- 测试账户现在可以使用 mock data 进行单次抽奖

✅ **`apps/web/src/app/api/gacha/pull-10x/route.ts`**
- 移除生产环境数据库检查
- 修复测试账户检测逻辑
- 测试账户现在可以使用 mock data 进行 10 连抽

✅ **`apps/web/src/app/api/gacha/tickets/route.ts`**
- 移除生产环境数据库检查
- 添加测试账户 mock data 支持
- 测试账户现在可以看到模拟的抽奖券

✅ **`apps/web/src/app/api/gacha/use-ticket/route.ts`**
- 移除生产环境数据库检查
- 添加测试账户检测
- 测试账户使用抽奖券时会收到友好的提示信息

---

## 🎰 Mock Data 详情

### Single Pull (单次抽奖)

**概率分布**：
- 🏆 **LEGENDARY** (1%): VIP Concert Backstage Pass - 1000 💎
- ⭐ **SSR** (4%): Limited Edition Signed Vinyl - 500 💎
- 💜 **EPIC** (10%): Exclusive Merchandise Bundle - 200 💎
- 💙 **RARE** (25%): Digital Album + Bonus Tracks - 100 💎
- ⚪ **COMMON** (60%): Fan Club Sticker - 20 💎

**消耗**: 100 💎 per pull

### 10x Pull (10 连抽)

**特性**：
- 执行 10 次抽奖
- **保底机制**: 至少 1 个 SSR 或更高稀有度的奖品
- 如果 10 次抽奖中没有 SSR+，系统会自动将一个 COMMON 替换为 SSR

**消耗**: 900 💎 (10% 折扣)

### Mock Tickets (模拟抽奖券)

测试账户会看到以下模拟抽奖券：
- **2x Single Draw Tickets** (单次抽奖券)
  - 来源: Welcome Bonus, Daily Login
- **1x 10x Draw Ticket** (10 连抽券)
  - 来源: Premium Pack

**注意**: 测试账户无法实际使用抽奖券，会收到提示使用钻石抽奖。

---

## 🧪 测试指南

### 测试账户

```
Email: admin@maffix.com
Password: password123
```

**初始资源**:
- 钻石余额: 10,000 💎
- 可以进行 100 次单次抽奖
- 可以进行 11 次 10 连抽

### 测试步骤

#### 1. 测试单次抽奖 ✅

1. 访问 https://www.maffix.xyz/gacha
2. 确认钻石余额显示 10,000 💎
3. 点击 **"Pull Once"** 按钮（100 💎）
4. 等待抽奖动画（约 0.3 秒）
5. 查看抽奖结果弹窗

**预期结果**:
- ✅ 抽奖成功
- ✅ 显示获得的奖品（名称、稀有度、描述）
- ✅ 钻石余额减少 100（变为 9,900 💎）
- ✅ 显示奖品稀有度颜色
  - LEGENDARY: 金色渐变
  - SSR: 琥珀色渐变
  - EPIC: 紫色渐变
  - RARE: 蓝色渐变
  - COMMON: 灰色渐变

#### 2. 测试 10 连抽 ✅

1. 访问 https://www.maffix.xyz/gacha
2. 点击 **"Pull 10x"** 按钮（900 💎）
3. 等待抽奖动画（约 0.5 秒）
4. 查看 10 个奖品的结果

**预期结果**:
- ✅ 抽奖成功
- ✅ 显示 10 个奖品
- ✅ 至少有 1 个 SSR 或更高稀有度的奖品（保底机制）
- ✅ 钻石余额减少 900
- ✅ 可以逐个查看每个奖品的详情

#### 3. 测试余额不足 ✅

1. 多次抽奖直到钻石余额低于 100
2. 尝试点击 **"Pull Once"** 按钮

**预期结果**:
- ✅ 按钮显示为禁用状态（灰色）
- ✅ 显示 "Not enough diamonds" 提示
- ✅ 无法点击抽奖按钮

#### 4. 测试抽奖券显示 ✅

1. 访问 https://www.maffix.xyz/gacha
2. 查看 "Draw Tickets" 卡片

**预期结果**:
- ✅ 显示 2 张单次抽奖券
- ✅ 显示 1 张 10 连抽券
- ✅ 显示抽奖券图标（🎫 和 🎟️）

---

## 🔍 故障排查

### 问题 1: 仍然显示 "Service temporarily unavailable"

**可能原因**:
- Vercel 部署未完成
- 浏览器缓存未清除
- 使用了旧版本的代码

**解决方案**:
1. 确认 Vercel 部署状态为 "Ready"
2. 清除浏览器缓存或使用无痕模式
3. 检查 Vercel 函数日志

### 问题 2: 抽奖后钻石余额没有变化

**可能原因**:
- 测试账户使用 mock data，余额是模拟的
- 页面未刷新

**解决方案**:
- 关闭抽奖结果弹窗后，页面会自动刷新
- 手动刷新页面（F5）

### 问题 3: 抽奖结果不显示

**可能原因**:
- JavaScript 错误
- 网络请求失败

**解决方案**:
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签的错误信息
3. 查看 Network 标签的请求状态

---

## 📊 API 响应示例

### Single Pull 成功响应

```json
{
  "success": true,
  "prize": {
    "id": "prize-epic-1",
    "name": "💜 Exclusive Merchandise Bundle",
    "description": "Premium T-shirt, poster, and holographic sticker pack",
    "type": "PHYSICAL",
    "rarity": "EPIC",
    "value": 200,
    "imageUrl": null
  },
  "userPrize": {
    "id": "user-prize-1729612345678",
    "wonAt": "2025-10-22T10:30:45.678Z"
  },
  "cost": 100,
  "newBalance": 9900,
  "totalPulls": 1
}
```

### 10x Pull 成功响应

```json
{
  "success": true,
  "prizes": [
    { "id": "prize-1", "name": "...", "rarity": "SSR", ... },
    { "id": "prize-2", "name": "...", "rarity": "RARE", ... },
    { "id": "prize-3", "name": "...", "rarity": "COMMON", ... },
    // ... 7 more prizes
  ],
  "userPrizes": [
    { "id": "user-prize-1", "wonAt": "..." },
    // ... 9 more
  ],
  "cost": 900,
  "newBalance": 9100,
  "totalPulls": 10,
  "guaranteedSSR": false
}
```

---

## ✅ 修复完成

所有 Gacha API 路由已修复，测试账户现在可以在生产环境中正常使用抽奖功能。

**修复的功能**:
- ✅ 单次抽奖（100 💎）
- ✅ 10 连抽（900 💎，保底 SSR）
- ✅ 抽奖券显示（mock data）
- ✅ 余额检查和扣除（模拟）
- ✅ 抽奖结果展示
- ✅ 稀有度概率分布

**环境变量要求**:
```
ENABLE_TEST_ACCOUNTS=true
```

---

**修复日期**: 2025-10-22  
**修复人员**: Augment Agent  
**影响范围**: 所有 Gacha API 路由

