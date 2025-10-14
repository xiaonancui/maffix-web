# 🎯 Vercel Dashboard 完整配置指南

## 📋 配置概览

本指南将帮助您在 Vercel Dashboard 中正确配置 Next.js 14 Turborepo monorepo 项目。

---

## 1️⃣ 项目基本设置

### 访问项目设置
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目 `maffix-web`
3. 点击顶部的 **Settings** 标签

---

## 2️⃣ Build & Development Settings

### 路径: Settings → General → Build & Development Settings

#### ⚠️ 关键配置

```
Framework Preset: Next.js
Root Directory: apps/web
```

#### 详细设置

| 设置项 | 值 | 说明 |
|--------|-----|------|
| **Framework Preset** | `Next.js` | 自动检测，无需手动选择 |
| **Root Directory** | `apps/web` | ⚠️ **最关键的设置** |
| **Build Command** | (留空) | 使用默认: `npm run build` |
| **Output Directory** | (留空) | 使用默认: `.next` |
| **Install Command** | (留空) | 使用默认: `npm install` |
| **Development Command** | (留空) | 使用默认: `npm run dev` |

#### 为什么 Root Directory 必须是 apps/web？

```
项目结构:
maffix-web/                    ← Git 仓库根目录
├── apps/
│   └── web/                   ← Next.js 应用在这里
│       ├── src/
│       ├── package.json       ← 包含 build 脚本
│       ├── next.config.js
│       └── .next/             ← 构建输出
├── packages/
├── package.json               ← Monorepo 根配置
└── turbo.json

设置 Root Directory = apps/web 后:
- Vercel 将 apps/web 视为项目根目录
- 所有路径相对于 apps/web
- 避免路径重复问题
```

---

## 3️⃣ Git 集成设置

### 路径: Settings → Git

#### 当前状态检查

1. **检查连接状态**
   - 应该显示: `Connected to GitHub`
   - 仓库: `xiaonancui/maffix-web`

2. **Production Branch**
   ```
   Production Branch: main
   ```

#### 🔧 如果自动部署不工作

**症状**: 推送代码到 GitHub 后，Vercel 不自动部署

**解决方案**: 重新连接 GitHub 集成

1. 点击 **Disconnect** 按钮
2. 确认断开连接
3. 点击 **Connect Git Repository**
4. 选择 GitHub
5. 找到并选择 `xiaonancui/maffix-web`
6. 授权 Vercel 访问仓库
7. 完成连接

**验证**: 
- 进入 GitHub 仓库 → Settings → Webhooks
- 应该看到一个指向 `vercel.com` 的 webhook
- 状态应该是绿色勾号 ✅

---

## 4️⃣ 环境变量设置

### 路径: Settings → Environment Variables

#### ⚠️ 重要说明

**不要使用 `@` 前缀！**

❌ 错误: `NEXTAUTH_SECRET: @nextauth_secret`
✅ 正确: `NEXTAUTH_SECRET: your_actual_secret_value`

#### 必需的环境变量

##### 1. NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: [生成一个随机字符串]
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**生成方法**:
```bash
# 方法 1: 使用 OpenSSL
openssl rand -base64 32

# 方法 2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

##### 2. NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://your-domain.vercel.app
Environments: ✅ Production
```

**注意**: 
- Production 环境使用实际的 Vercel 域名
- Preview 环境可以使用 `https://$VERCEL_URL`
- Development 环境使用 `http://localhost:3000`

##### 3. DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://user:password@host:5432/database
Environments: ✅ Production, ✅ Preview
```

**格式**:
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

#### 可选的 OAuth 环境变量

##### Google OAuth
```
Name: GOOGLE_CLIENT_ID
Value: your_google_client_id.apps.googleusercontent.com
Environments: ✅ Production

Name: GOOGLE_CLIENT_SECRET
Value: your_google_client_secret
Environments: ✅ Production
```

##### TikTok OAuth
```
Name: TIKTOK_CLIENT_ID
Value: your_tiktok_client_id
Environments: ✅ Production

Name: TIKTOK_CLIENT_SECRET
Value: your_tiktok_client_secret
Environments: ✅ Production
```

##### Discord OAuth
```
Name: DISCORD_CLIENT_ID
Value: your_discord_client_id
Environments: ✅ Production

Name: DISCORD_CLIENT_SECRET
Value: your_discord_client_secret
Environments: ✅ Production
```

#### 添加环境变量的步骤

1. 点击 **Add New** 按钮
2. 选择 **Environment Variable** (不是 Secret)
3. 输入 **Name** (例如: `NEXTAUTH_SECRET`)
4. 输入 **Value** (实际的值，不使用 `@` 前缀)
5. 选择 **Environments**:
   - ✅ Production (必选)
   - ✅ Preview (推荐)
   - ✅ Development (可选)
6. 点击 **Save**

#### 验证环境变量

添加完所有环境变量后，您应该看到类似这样的列表:

```
NEXTAUTH_SECRET          Production, Preview, Development
NEXTAUTH_URL             Production
DATABASE_URL             Production, Preview
GOOGLE_CLIENT_ID         Production
GOOGLE_CLIENT_SECRET     Production
...
```

---

## 5️⃣ 部署设置

### 路径: Settings → Deployments

#### Production Branch
```
Production Branch: main
```

#### Ignored Build Step
```
(留空 - 不忽略任何构建)
```

#### Auto-assign Custom Domains
```
✅ Enabled (推荐)
```

---

## 6️⃣ 域名设置（可选）

### 路径: Settings → Domains

#### 默认域名
```
your-project.vercel.app
```

#### 添加自定义域名（可选）
1. 点击 **Add**
2. 输入您的域名
3. 按照指示配置 DNS 记录
4. 等待验证完成

---

## 7️⃣ 函数设置

### 路径: Settings → Functions

#### Serverless Function Region
```
Washington, D.C., USA (iad1) - 推荐
或选择离您用户最近的区域
```

#### Serverless Function Timeout
```
10s (默认)
```

**注意**: 如果您的 API 路由需要更长时间，可以增加到 30s 或更多（需要付费计划）

---

## ✅ 配置验证清单

完成所有配置后，请验证：

### Build & Development Settings
- [ ] Framework Preset: Next.js
- [ ] Root Directory: `apps/web` ⚠️
- [ ] Build Command: (留空)
- [ ] Output Directory: (留空)
- [ ] Install Command: (留空)

### Git Integration
- [ ] Connected to GitHub
- [ ] Repository: `xiaonancui/maffix-web`
- [ ] Production Branch: `main`
- [ ] GitHub webhook 已创建（在 GitHub 仓库中可见）

### Environment Variables
- [ ] `NEXTAUTH_SECRET` 已添加
- [ ] `NEXTAUTH_URL` 已添加
- [ ] `DATABASE_URL` 已添加
- [ ] 所有变量**不使用** `@` 前缀
- [ ] 所有变量在 Production 环境中可用

### Deployment Settings
- [ ] Production Branch: `main`
- [ ] Auto-deploy: Enabled

---

## 🚀 测试部署

### 方法 1: 推送代码触发自动部署
```bash
# 创建一个空提交来触发部署
git commit --allow-empty -m "chore: trigger Vercel deployment"
git push origin main
```

### 方法 2: 手动触发部署
1. 进入 Vercel Dashboard → 项目
2. 点击 **Deployments** 标签
3. 点击最近的部署旁边的 **...** 菜单
4. 选择 **Redeploy**

### 验证部署成功
1. 等待构建完成（通常 2-5 分钟）
2. 检查构建日志，确保没有错误
3. 访问部署的 URL
4. 测试应用功能

---

## 🔍 故障排除

### 问题: 构建失败
**检查**:
- 构建日志中的具体错误信息
- 环境变量是否正确设置
- Root Directory 是否设置为 `apps/web`

### 问题: 自动部署不触发
**检查**:
- GitHub webhook 是否存在
- Webhook 状态是否正常（绿色勾号）
- Production Branch 是否设置为 `main`

### 问题: 环境变量未生效
**检查**:
- 环境变量是否在正确的环境中（Production）
- 是否使用了 `@` 前缀（应该删除）
- 部署后是否重新部署（环境变量更改需要重新部署）

---

## 📞 获取帮助

如果问题持续存在，请提供：
1. 完整的构建日志
2. Vercel 项目设置截图
3. 具体的错误消息

查看详细诊断: [VERCEL_DEPLOYMENT_DIAGNOSIS.md](./VERCEL_DEPLOYMENT_DIAGNOSIS.md)
