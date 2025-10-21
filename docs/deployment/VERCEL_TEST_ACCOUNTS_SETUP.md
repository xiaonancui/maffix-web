# 🔑 Vercel 测试账户配置指南

## 📋 问题说明

您的应用已成功部署到 Vercel，但测试账户无法登录。

**原因**: 测试账户默认只在开发环境 (`NODE_ENV=development`) 下可用，而 Vercel 部署是生产环境 (`NODE_ENV=production`)。

**解决方案**: 通过环境变量 `ENABLE_TEST_ACCOUNTS=true` 在生产环境中启用测试账户。

---

## ✅ 快速修复步骤（5 分钟）

### 步骤 1: 推送代码更新

代码已经修改完成，现在需要推送到 GitHub：

```bash
git add apps/web/src/lib/auth.ts apps/web/.env.example
git commit -m "feat: add ENABLE_TEST_ACCOUNTS environment variable for production testing"
git push origin main
```

### 步骤 2: 在 Vercel 中添加环境变量

1. **进入 Vercel Dashboard**
   - 访问: https://vercel.com/dashboard
   - 选择您的项目 `maffix-web`

2. **进入环境变量设置**
   - 点击顶部的 **Settings** 标签
   - 在左侧菜单选择 **Environment Variables**

3. **添加新环境变量**
   - 点击 **Add New** 按钮
   - 选择 **Environment Variable**

4. **填写变量信息**
   ```
   Name: ENABLE_TEST_ACCOUNTS
   Value: true
   ```

5. **选择环境**
   - ✅ **Production** (必选)
   - ✅ **Preview** (推荐)
   - ⬜ Development (可选)

6. **保存**
   - 点击 **Save** 按钮

### 步骤 3: 重新部署

环境变量添加后，需要重新部署才能生效：

**方法 A: 自动部署**（推荐）
```bash
# 推送代码会自动触发部署
git push origin main
```

**方法 B: 手动部署**
1. 进入 Vercel Dashboard → 项目
2. 点击 **Deployments** 标签
3. 找到最新的部署
4. 点击右侧的 **...** 菜单
5. 选择 **Redeploy**
6. 确认重新部署

### 步骤 4: 等待部署完成

- 部署通常需要 2-5 分钟
- 在 Deployments 页面可以看到进度
- 等待状态变为 **Ready** ✅

### 步骤 5: 测试登录

1. **访问您的 Vercel URL**
   ```
   https://your-project.vercel.app/login
   ```

2. **使用测试账户登录**
   ```
   邮箱: admin@maffix.com
   密码: password123
   ```

3. **验证成功**
   - 应该能够成功登录
   - 跳转到 Dashboard 页面
   - 看到用户信息和统计数据

---

## 🔑 可用的测试账户

修复后，以下测试账户将在 Vercel 上可用：

### 1. 管理员账户 👑
```
邮箱: admin@maffix.com
密码: password123
角色: ADMIN
```

**权限**:
- ✅ 访问所有用户功能
- ✅ 访问管理后台 `/admin`
- ✅ 审核任务提交
- ✅ 管理用户

**初始资源**:
- 💎 Diamonds: 10,000
- ⭐ Points: 5,000
- 📊 Level: 10

### 2. 普通用户账户 👤
```
邮箱: test@maffix.com
密码: password123
角色: USER
```

**权限**:
- ✅ 访问 Dashboard
- ✅ 查看和提交任务
- ✅ 参与 Gacha 抽奖
- ✅ 查看和兑换奖品
- ❌ 无法访问管理后台

**初始资源**:
- 💎 Diamonds: 500
- ⭐ Points: 100
- 📊 Level: 1

### 3. 备用测试账户 👤
```
邮箱: user@maffix.com
密码: password123
角色: USER
```

**权限**: 与普通用户相同

**初始资源**:
- 💎 Diamonds: 500
- ⭐ Points: 100
- 📊 Level: 1

---

## 📊 验证环境变量

### 检查环境变量是否正确设置

1. **在 Vercel Dashboard 中检查**
   - Settings → Environment Variables
   - 应该看到 `ENABLE_TEST_ACCOUNTS` = `true`
   - 确认在 **Production** 环境中可用

2. **在部署日志中检查**
   - Deployments → 最新部署 → Build Logs
   - 搜索 "ENABLE_TEST_ACCOUNTS"
   - 应该看到环境变量被正确加载

3. **在函数日志中检查**（登录时）
   - Deployments → 最新部署 → Functions
   - 点击 `/api/auth/[...nextauth]` 函数
   - 查看日志，应该看到:
     ```
     ✅ Test account login: admin@maffix.com (Environment: production)
     ```

---

## ⚠️ 安全注意事项

### 重要警告

测试账户使用简单密码 (`password123`)，**不应该在真正的生产环境中启用**！

### 适用场景

✅ **适合启用测试账户的场景**:
- 演示环境 (Demo)
- 测试环境 (Staging)
- 开发预览 (Preview)
- 客户展示
- 功能验证

❌ **不适合启用测试账户的场景**:
- 真正的生产环境
- 有真实用户数据的环境
- 公开访问的应用
- 处理敏感信息的应用

### 安全建议

如果必须在生产环境启用测试账户：

1. **修改密码**
   ```typescript
   // 在 auth.ts 中修改
   {
     email: 'admin@maffix.com',
     password: 'your-strong-password-here',  // 使用强密码
     // ...
   }
   ```

2. **限制访问**
   - 使用 IP 白名单
   - 添加额外的认证层
   - 限制测试账户的权限

3. **监控使用**
   - 记录测试账户的登录日志
   - 设置异常登录告警
   - 定期审查访问记录

4. **定期禁用**
   - 演示完成后立即禁用
   - 设置自动过期时间
   - 使用临时部署 URL

---

## 🔄 禁用测试账户

当不再需要测试账户时：

### 方法 1: 删除环境变量

1. 进入 Vercel Dashboard → Settings → Environment Variables
2. 找到 `ENABLE_TEST_ACCOUNTS`
3. 点击右侧的 **...** 菜单
4. 选择 **Delete**
5. 确认删除
6. 重新部署应用

### 方法 2: 修改环境变量值

1. 进入 Vercel Dashboard → Settings → Environment Variables
2. 找到 `ENABLE_TEST_ACCOUNTS`
3. 点击 **Edit**
4. 将值改为 `false`
5. 保存
6. 重新部署应用

---

## 🐛 故障排查

### 问题 1: 添加环境变量后仍无法登录

**可能原因**:
- 环境变量未在 Production 环境中启用
- 未重新部署应用
- 缓存问题

**解决方案**:
1. 确认环境变量在 **Production** 环境中可用
2. 手动触发重新部署
3. 清除浏览器缓存
4. 使用无痕模式测试

### 问题 2: 登录时显示 "Invalid credentials"

**可能原因**:
- 邮箱或密码输入错误
- 环境变量值不是 `"true"` (字符串)
- 代码未正确部署

**解决方案**:
1. 检查邮箱和密码（区分大小写）
2. 确认环境变量值是字符串 `"true"`，不是布尔值
3. 检查最新部署是否包含代码更改
4. 查看 Vercel 函数日志

### 问题 3: 环境变量设置后看不到效果

**可能原因**:
- 环境变量更改后未重新部署
- 部署失败
- 缓存问题

**解决方案**:
1. 检查 Deployments 页面，确认最新部署成功
2. 查看构建日志，确认没有错误
3. 手动触发重新部署
4. 等待几分钟让更改生效

### 问题 4: 在 Vercel 函数日志中看不到登录日志

**可能原因**:
- 日志延迟
- 函数未被调用
- 日志级别设置

**解决方案**:
1. 等待几分钟，日志可能有延迟
2. 确认登录请求确实发送到了服务器
3. 检查浏览器网络标签，查看 API 请求
4. 在 Vercel Dashboard 中启用详细日志

---

## 📚 相关文档

- **TEST_ACCOUNTS_GUIDE.md** - 测试账户完整使用指南
- **VERCEL_DEPLOYMENT.md** - Vercel 部署指南
- **VERCEL_DASHBOARD_SETUP.md** - Vercel Dashboard 配置指南

---

## ✅ 成功标志

修复成功后，您应该能够：

1. ✅ 访问 Vercel 部署的 URL
2. ✅ 看到登录页面
3. ✅ 使用测试账户登录
4. ✅ 成功跳转到 Dashboard
5. ✅ 看到用户统计数据
6. ✅ 访问所有功能页面
7. ✅ 使用管理员账户访问 `/admin`

---

## 🎉 完成！

按照以上步骤操作后，您的测试账户应该可以在 Vercel 上正常使用了！

如果还有任何问题，请提供：
- Vercel 部署 URL
- 登录时的错误信息
- Vercel 函数日志截图
- 浏览器控制台错误

我会继续帮助您解决！🚀
