# 🔍 Vercel 登录问题深度诊断

## 📋 当前状态

✅ Vercel 部署成功  
✅ 代码已更新并推送  
❌ 测试账户仍然无法登录

---

## 🔍 需要检查的关键点

### 1. 环境变量检查 ⚠️

**最关键的问题**: 请确认您是否已经在 Vercel 中添加了环境变量！

#### 检查步骤：

1. **打开 Vercel Dashboard**
   - 访问: https://vercel.com/dashboard
   - 选择项目 `maffix-web`

2. **查看环境变量**
   - 点击 **Settings** 标签
   - 左侧菜单选择 **Environment Variables**
   - 查找 `ENABLE_TEST_ACCOUNTS`

3. **验证配置**
   ```
   Name: ENABLE_TEST_ACCOUNTS
   Value: true  (必须是字符串 "true"，不是布尔值)
   Environments: ✅ Production (必须勾选)
   ```

**如果没有这个环境变量，测试账户将无法工作！**

---

### 2. 部署状态检查

#### 检查最新部署是否包含代码更新：

1. **进入 Deployments 页面**
   - 在 Vercel Dashboard 中点击 **Deployments**

2. **查看最新部署**
   - 确认最新部署的时间（应该在最近 10 分钟内）
   - 确认状态是 **Ready** ✅

3. **查看部署详情**
   - 点击最新的部署
   - 查看 **Source** 是否显示最新的 commit
   - Commit 信息应该包含 "enable test accounts"

---

### 3. 登录错误信息检查

请告诉我具体的错误信息：

#### 在浏览器中检查：

1. **打开浏览器开发者工具**
   - 按 F12 或右键 → 检查

2. **切换到 Console 标签**
   - 尝试登录
   - 查看是否有错误信息

3. **切换到 Network 标签**
   - 尝试登录
   - 找到 `/api/auth/callback/credentials` 请求
   - 查看响应内容

#### 可能的错误类型：

**A. 显示 "Invalid email or password"**
- 原因：认证失败
- 可能是环境变量未设置

**B. 显示 "An error occurred"**
- 原因：服务器错误
- 需要查看 Vercel 函数日志

**C. 页面无响应或一直加载**
- 原因：API 请求失败
- 需要查看 Network 标签

**D. 登录后立即跳转回登录页**
- 原因：Session 创建失败
- 可能是 NEXTAUTH_SECRET 或 NEXTAUTH_URL 配置问题

---

### 4. Vercel 函数日志检查

#### 查看服务器端日志：

1. **进入 Vercel Dashboard**
   - 选择项目 `maffix-web`

2. **查看函数日志**
   - 点击 **Deployments** 标签
   - 点击最新的部署
   - 点击 **Functions** 标签
   - 找到 `/api/auth/[...nextauth]` 函数
   - 点击查看日志

3. **尝试登录并查看日志**
   - 在新标签页打开您的 Vercel URL
   - 尝试登录
   - 回到函数日志页面
   - 查看是否有新的日志输出

#### 期望看到的日志：

如果环境变量正确设置，应该看到：
```
✅ Test account login: admin@maffix.com (Environment: production)
✅ Test account sign in: admin@maffix.com
```

如果没有看到这些日志，说明：
- 环境变量未设置
- 或环境变量值不正确

---

### 5. 环境变量值格式检查

**常见错误**: 环境变量值的格式不正确

#### 正确的格式：

```
Name: ENABLE_TEST_ACCOUNTS
Value: true
```

**注意**:
- ✅ 值是字符串 `"true"`（不带引号输入）
- ❌ 不是布尔值 `true`
- ❌ 不是 `"True"` 或 `"TRUE"`
- ❌ 不是 `1` 或 `yes`

#### 验证方法：

在 Vercel 环境变量页面，值应该显示为：
```
true
```

---

### 6. NEXTAUTH 环境变量检查

测试账户登录还需要其他 NextAuth 环境变量：

#### 必需的环境变量：

```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-project.vercel.app
```

#### 检查步骤：

1. 在 Vercel Dashboard → Settings → Environment Variables
2. 确认以下变量存在且在 **Production** 环境中：
   - `NEXTAUTH_SECRET` (任意长字符串)
   - `NEXTAUTH_URL` (您的 Vercel 部署 URL)
   - `ENABLE_TEST_ACCOUNTS` (值为 `true`)

---

## 🔧 诊断脚本

### 方法 1: 使用浏览器控制台测试

在您的 Vercel 部署页面，打开浏览器控制台（F12），运行：

```javascript
// 测试 API 是否可访问
fetch('/api/auth/providers')
  .then(res => res.json())
  .then(data => console.log('Providers:', data))
  .catch(err => console.error('Error:', err))

// 测试登录请求
fetch('/api/auth/callback/credentials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    email: 'admin@maffix.com',
    password: 'password123',
    redirect: 'false',
    json: 'true',
  })
})
  .then(res => res.json())
  .then(data => console.log('Login result:', data))
  .catch(err => console.error('Login error:', err))
```

### 方法 2: 使用 curl 测试（在本地终端）

```bash
# 替换 YOUR_VERCEL_URL 为您的实际 URL
curl -X POST https://YOUR_VERCEL_URL/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=admin@maffix.com&password=password123&redirect=false&json=true"
```

---

## 📊 问题排查流程图

```
开始
  ↓
环境变量 ENABLE_TEST_ACCOUNTS 是否存在？
  ├─ 否 → 添加环境变量 → 重新部署 → 测试登录
  └─ 是
      ↓
    值是否为 "true"？
      ├─ 否 → 修改为 "true" → 重新部署 → 测试登录
      └─ 是
          ↓
        是否在 Production 环境中？
          ├─ 否 → 勾选 Production → 重新部署 → 测试登录
          └─ 是
              ↓
            最新部署是否在环境变量添加之后？
              ├─ 否 → 重新部署 → 测试登录
              └─ 是
                  ↓
                NEXTAUTH_SECRET 和 NEXTAUTH_URL 是否设置？
                  ├─ 否 → 添加这些变量 → 重新部署 → 测试登录
                  └─ 是
                      ↓
                    查看 Vercel 函数日志
                      ↓
                    是否看到 "Test account login" 日志？
                      ├─ 是 → 检查浏览器控制台错误
                      └─ 否 → 代码可能未正确部署
```

---

## 🎯 请提供以下信息

为了帮助您更好地诊断问题，请提供：

### 1. 环境变量截图
- Vercel Dashboard → Settings → Environment Variables
- 显示 `ENABLE_TEST_ACCOUNTS` 的配置

### 2. 部署状态
- 最新部署的时间
- 部署状态（Ready/Failed）
- Commit 信息

### 3. 登录错误信息
- 浏览器显示的错误消息
- 浏览器控制台的错误（F12 → Console）
- Network 标签中 `/api/auth/callback/credentials` 的响应

### 4. Vercel 函数日志
- `/api/auth/[...nextauth]` 函数的日志输出
- 尝试登录时的日志

### 5. 您的 Vercel URL
- 部署的 URL（例如：https://maffix-web.vercel.app）

---

## 🔄 快速修复尝试

如果上述检查都没问题，尝试以下操作：

### 1. 强制重新部署

```bash
# 在本地执行
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### 2. 清除 Vercel 缓存

在 Vercel Dashboard：
1. Settings → General
2. 找到 "Clear Cache" 按钮
3. 点击清除缓存
4. 重新部署

### 3. 检查 Vercel 项目设置

在 Vercel Dashboard → Settings → General：
- **Root Directory**: 应该设置为 `apps/web`
- **Framework Preset**: Next.js
- **Node.js Version**: 18.x 或更高

---

## 📞 下一步

请按照上述检查清单逐项检查，并告诉我：

1. **环境变量 `ENABLE_TEST_ACCOUNTS` 是否已添加？**
2. **具体的登录错误信息是什么？**
3. **Vercel 函数日志中看到了什么？**

有了这些信息，我可以更准确地帮您定位问题！🔍
