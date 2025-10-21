# 🔍 Vercel 部署问题完整诊断报告

## 📋 执行摘要

经过彻底分析，您的 Next.js 14 Turborepo monorepo 项目存在以下问题：

### 问题 1：自动部署未触发 ❌
**根本原因**: GitHub webhooks 未正确配置

### 问题 2：手动部署失败 ❌
**根本原因**: `vercel.json` 配置与 Vercel Dashboard 设置冲突，导致路径问题

---

## 🔍 详细诊断结果

### 1. GitHub 集成诊断

#### ✅ 已确认正常
- GitHub 仓库存在且活跃
- main 分支存在
- 最近有大量提交活动（30+ commits）

#### ❌ 发现的问题
- **未检测到 GitHub webhooks**: 通过 GitHub API 检查，仓库中没有配置 webhooks
- **影响**: 这解释了为什么推送代码后 Vercel 不会自动触发部署

#### 🔧 修复方案
需要在 Vercel 中重新连接 GitHub 集成：

1. **断开并重新连接 GitHub**:
   - 进入 Vercel Dashboard → 项目设置 → Git
   - 点击 "Disconnect" 断开当前连接
   - 重新点击 "Connect Git Repository"
   - 选择 `xiaonancui/maffix-web` 仓库
   - 授权 Vercel 访问仓库

2. **验证 webhook 创建**:
   - 重新连接后，Vercel 会自动在 GitHub 仓库中创建 webhook
   - 在 GitHub 仓库设置中检查: Settings → Webhooks
   - 应该看到一个指向 `vercel.com` 的 webhook

---

### 2. Vercel 配置诊断

#### ❌ 发现的关键问题

**问题 A: vercel.json 配置冲突**

当前的 `vercel.json` 配置存在多个问题：

```json
{
  "version": 2,
  "buildCommand": "cd apps/web && npm run build:vercel",
  "outputDirectory": "apps/web/.next",
  "routes": [...],
  "env": {
    "NEXTAUTH_SECRET": "@nextauth_secret",
    ...
  }
}
```

**问题点**:
1. ❌ `version: 2` 是旧版配置格式
2. ❌ `buildCommand` 使用 `cd apps/web` 可能导致路径问题
3. ❌ `outputDirectory: "apps/web/.next"` 与 Root Directory 设置冲突
4. ❌ `routes` 配置对于 Next.js 14 App Router 不必要且可能导致问题
5. ❌ `env` 中使用 `@` 前缀引用 secrets，但这些 secrets 可能未在 Vercel 中创建

**问题 B: 路径重复问题**

如果在 Vercel Dashboard 中设置了 Root Directory，同时 `vercel.json` 又指定了 `apps/web`，会导致路径重复：
- 预期路径: `/vercel/path0/apps/web/.next`
- 实际路径: `/vercel/path0/apps/web/apps/web/.next` ❌

---

### 3. 环境变量诊断

#### ⚠️ 潜在问题

`vercel.json` 中的环境变量配置使用了 `@` 前缀：
```json
"NEXTAUTH_SECRET": "@nextauth_secret"
```

这种语法要求在 Vercel 中创建对应的 **Secrets**，而不是普通的环境变量。

**检查清单**:
- [ ] 在 Vercel 项目设置中，是否创建了名为 `nextauth_secret` 的 Secret？
- [ ] 还是只是添加了名为 `NEXTAUTH_SECRET` 的环境变量？

**区别**:
- **Environment Variables**: 直接在项目设置中添加的键值对
- **Secrets**: 需要先在 Vercel 账户级别创建，然后用 `@secret_name` 引用

---

## ✅ 完整修复方案

### 方案 A: 推荐方案（删除 vercel.json，使用 Dashboard 配置）

#### 步骤 1: 删除或重命名 vercel.json
```bash
# 备份现有配置
mv vercel.json vercel.json.backup

# 或者直接删除
rm vercel.json

git add .
git commit -m "chore: remove vercel.json to use Dashboard configuration"
git push origin main
```

#### 步骤 2: 在 Vercel Dashboard 中配置

进入项目设置 → Build & Development Settings:

```
Root Directory: apps/web
Framework Preset: Next.js (auto-detected)
Build Command: (leave empty - uses default)
Output Directory: (leave empty - uses default .next)
Install Command: (leave empty - uses default npm install)
Node.js Version: 18.x or 20.x
```

#### 步骤 3: 配置环境变量

进入项目设置 → Environment Variables，添加以下变量（**不使用 @ 前缀**）:

**Production 环境**:
```
NEXTAUTH_SECRET=your_actual_secret_value
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=your_postgresql_connection_string
```

**可选的 OAuth 变量**:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

**重要**: 确保为每个环境变量选择正确的环境：
- ✅ Production (生产环境)
- ✅ Preview (预览环境 - 可选)
- ✅ Development (开发环境 - 可选)

#### 步骤 4: 重新连接 GitHub 集成

1. 进入 Vercel Dashboard → 项目设置 → Git
2. 如果已连接，点击 "Disconnect"
3. 点击 "Connect Git Repository"
4. 选择 `xiaonancui/maffix-web`
5. 授权访问

#### 步骤 5: 验证配置

1. 检查 GitHub 仓库 Settings → Webhooks，应该看到 Vercel webhook
2. 在 Vercel 项目设置中确认:
   - Production Branch: `main`
   - Root Directory: `apps/web`
   - 所有环境变量已设置

#### 步骤 6: 触发部署

```bash
# 推送一个小改动来触发自动部署
git commit --allow-empty -m "chore: trigger Vercel deployment"
git push origin main
```

或者在 Vercel Dashboard 中点击 "Redeploy" 按钮。

---

### 方案 B: 保留 vercel.json（需要修复配置）

如果您希望保留 `vercel.json` 进行版本控制，需要修复配置：

#### 修复后的 vercel.json:
```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

**关键改动**:
1. ✅ 移除 `version: 2`
2. ✅ 移除 `cd apps/web` (Root Directory 在 Dashboard 中设置)
3. ✅ 改为 `outputDirectory: ".next"` (相对于 Root Directory)
4. ✅ 移除 `routes` 配置
5. ✅ 移除 `env` 配置（在 Dashboard 中设置）
6. ✅ 移除 `framework` 配置（自动检测）

**同时在 Vercel Dashboard 中设置**:
- Root Directory: `apps/web`
- 环境变量: 直接添加，不使用 `@` 前缀

---

## 🎯 部署验证清单

完成修复后，按以下清单验证：

### GitHub 集成
- [ ] GitHub webhook 已创建（在仓库 Settings → Webhooks 中可见）
- [ ] Webhook 状态为绿色勾号（表示连接正常）
- [ ] Production Branch 设置为 `main`

### Vercel 项目配置
- [ ] Root Directory 设置为 `apps/web`
- [ ] Framework Preset 显示为 Next.js
- [ ] Build Command 留空或设置为 `npm run build:vercel`
- [ ] Output Directory 留空
- [ ] Install Command 留空

### 环境变量
- [ ] `NEXTAUTH_SECRET` 已设置（Production）
- [ ] `NEXTAUTH_URL` 已设置（Production）
- [ ] `DATABASE_URL` 已设置（Production）
- [ ] 所有环境变量**不使用** `@` 前缀
- [ ] 环境变量在正确的环境中可用

### 部署测试
- [ ] 推送代码到 main 分支后，Vercel 自动触发部署
- [ ] 构建日志中没有路径错误
- [ ] 构建成功完成
- [ ] 部署的应用可以访问

---

## 📊 需要提供的信息（用于进一步诊断）

如果按照上述方案修复后仍有问题，请提供以下信息：

### 1. Vercel 部署日志
- 进入 Vercel Dashboard → 项目 → Deployments
- 点击最近失败的部署
- 复制完整的构建日志（特别是错误部分）

### 2. Vercel 项目设置截图
- Build & Development Settings 页面
- Environment Variables 页面
- Git 集成页面

### 3. GitHub Webhook 状态
- 进入 GitHub 仓库 → Settings → Webhooks
- 截图显示 webhook 列表和状态

### 4. 具体错误信息
- 构建失败的具体错误消息
- 是否有关于路径、依赖、或环境变量的错误

---

## 🚀 预期结果

完成修复后，您应该看到：

1. **自动部署**: 推送到 main 分支后，Vercel 自动开始构建
2. **构建成功**: 构建日志显示所有步骤成功完成
3. **应用可访问**: 部署的 URL 可以正常访问应用
4. **环境变量生效**: 应用可以正确读取环境变量

---

## 📞 后续支持

如果问题持续存在，请提供：
1. 完整的 Vercel 构建日志
2. Vercel 项目设置的详细信息
3. 任何新的错误消息

我会根据这些信息提供更具体的解决方案。
