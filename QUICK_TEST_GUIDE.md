# 🧪 快速测试指南

## ⏱️ 预计时间：5-10 分钟

---

## 📋 测试前准备

### 1. 等待 Vercel 部署完成

访问 Vercel Dashboard 查看部署状态：
- URL: https://vercel.com/dashboard
- 项目: `maffix-web`
- 等待状态变为 **"Ready"** ✅

**预计部署时间**: 2-3 分钟

---

### 2. 确认环境变量

在 Vercel Dashboard 中确认以下环境变量已设置：

```
ENABLE_TEST_ACCOUNTS=true
NEXTAUTH_URL=https://www.maffix.xyz
NEXTAUTH_SECRET=your-secret-key-here
```

**检查路径**: Settings → Environment Variables

---

### 3. 清除浏览器缓存

**推荐方式**: 使用无痕模式（Incognito/Private Browsing）

或者手动清除缓存：
- Chrome: `Cmd+Shift+Delete` (Mac) / `Ctrl+Shift+Delete` (Windows)
- 选择 "Cookies and other site data"
- 选择 "Cached images and files"
- 点击 "Clear data"

---

## 🔐 测试账户

```
Email: admin@maffix.com
Password: password123
```

**预期权限**: 管理员账户，拥有最高权限和最多资源

---

## ✅ 核心功能测试（必测）

### 1. 登录测试 ✅

1. 访问 https://www.maffix.xyz/login
2. 输入测试账户信息
3. 点击 "Sign In"

**预期结果**:
- ✅ 成功登录
- ✅ 跳转到 `/dashboard`
- ✅ 不出现重定向循环错误

---

### 2. Dashboard 页面 ✅

URL: https://www.maffix.xyz/dashboard

**检查项目**:
- [ ] 钻石余额显示: **10,000 💎**
- [ ] 积分显示: **5,000 ⭐**
- [ ] 等级显示: **Level 10**
- [ ] 用户名显示: **Admin User**
- [ ] 快速操作按钮可见

**如果显示 0 或空白** → 修复失败，查看浏览器控制台错误

---

### 3. Gacha 页面 ✅

URL: https://www.maffix.xyz/gacha

**检查项目**:
- [ ] 钻石余额显示: **10,000 💎**
- [ ] 显示 3 个奖品（VIP Concert Ticket, Signed Album, Exclusive Sticker Pack）
- [ ] 显示抽奖按钮（Single Draw 和 10x Draw）
- [ ] 显示 Pity Counter

**如果钻石显示 0** → 修复失败

---

### 4. Tasks 页面 ✅

URL: https://www.maffix.xyz/tasks

**检查项目**:
- [ ] 显示 3 个模拟任务
- [ ] 任务显示奖励（💎 和 ⭐）
- [ ] 任务显示难度标签（EASY, MEDIUM）
- [ ] 显示提交按钮

**如果显示 "No tasks available"** → 修复失败

---

### 5. Releases 页面 ✅

URL: https://www.maffix.xyz/releases

**检查项目**:
- [ ] **封面图片正常显示**（YouTube 缩略图）
- [ ] 显示 10 个音乐视频
- [ ] 可以点击播放视频
- [ ] 图片不是占位符或错误图标

**如果图片不显示** → YouTube 域名配置失败

---

### 6. Missions 页面 ✅

URL: https://www.maffix.xyz/missions

**检查项目**:
- [ ] 显示多个 TikTok 任务
- [ ] 任务按类型分组（FOLLOW, LIKE, COMMENT, SHARE, DUET）
- [ ] 显示奖励信息（💎 和 ⭐）

**如果显示空白** → 修复失败

---

### 7. Profile 页面 ✅

URL: https://www.maffix.xyz/profile

**检查项目**:
- [ ] 显示用户信息（Admin User, admin@maffix.com）
- [ ] 显示钻石余额: **10,000 💎**
- [ ] 显示积分: **5,000 ⭐**
- [ ] 显示等级: **Level 10**
- [ ] 显示统计数据（Tasks Completed, Prizes Won 等）

**如果数据不完整** → 修复失败

---

## 🔍 诊断工具（如果测试失败）

### 1. 检查环境变量 API

访问: https://www.maffix.xyz/api/test-env

**期望输出**:
```json
{
  "environment": {
    "nodeEnv": "production",
    "enableTestAccounts": "true",
    "allowTestAccounts": true
  },
  "testAccountsEnabled": true
}
```

**如果 `testAccountsEnabled` 是 `false`**:
- 检查 Vercel 环境变量 `ENABLE_TEST_ACCOUNTS` 是否设置为 `true`
- 检查是否在 **Production** 环境中启用
- 重新部署项目

---

### 2. 检查浏览器控制台

打开浏览器开发者工具（F12）:

**Console 标签**:
- 查找红色错误信息
- 查找 "Failed to load" 或 "404" 错误

**Network 标签**:
- 查找失败的请求（红色）
- 查找图片加载失败（特别是 YouTube 图片）

---

### 3. 检查 Vercel 函数日志

1. 访问 https://vercel.com/dashboard
2. 选择 `maffix-web` 项目
3. 点击 **Logs** 标签
4. 查找错误信息

---

## 📊 测试结果总结

### ✅ 全部通过

如果所有测试项目都通过：
- 🎉 **修复成功！**
- 所有功能正常工作
- 可以正常使用测试账户

---

### ⚠️ 部分失败

如果部分测试失败：

**钻石/积分显示为 0**:
- 检查 `ENABLE_TEST_ACCOUNTS` 环境变量
- 访问 `/api/test-env` 确认配置

**图片不显示**:
- 检查浏览器控制台的图片加载错误
- 确认 Next.js 配置已更新

**Mock 数据不显示**:
- 清除浏览器缓存
- 使用无痕模式重新测试
- 检查 Vercel 部署是否完成

---

### ❌ 全部失败

如果所有测试都失败：

1. **确认部署完成**
   - 访问 Vercel Dashboard
   - 确认最新提交已部署

2. **确认环境变量**
   - 访问 `/api/test-env`
   - 确认 `ENABLE_TEST_ACCOUNTS=true`

3. **清除缓存**
   - 使用无痕模式
   - 或完全清除浏览器缓存

4. **查看日志**
   - 浏览器控制台
   - Vercel 函数日志

---

## 📞 需要帮助？

如果测试失败，请提供以下信息：

1. **失败的测试项目**
   - 哪些页面有问题？
   - 具体的错误现象？

2. **诊断 API 输出**
   - 访问 `/api/test-env` 的完整输出

3. **浏览器控制台错误**
   - Console 标签的错误信息
   - Network 标签的失败请求

4. **Vercel 部署状态**
   - 部署是否完成？
   - 最新提交的 commit hash？

---

## 🎯 快速检查清单

复制以下清单，逐项检查：

```
部署前检查:
[ ] Vercel 部署状态: Ready
[ ] ENABLE_TEST_ACCOUNTS=true 已设置
[ ] NEXTAUTH_URL=https://www.maffix.xyz 已设置
[ ] 浏览器缓存已清除

核心功能测试:
[ ] 登录成功
[ ] Dashboard 显示 10,000 💎
[ ] Gacha 显示 10,000 💎
[ ] Tasks 显示 3 个任务
[ ] Releases 图片正常显示
[ ] Missions 显示任务列表
[ ] Profile 显示完整数据

诊断工具:
[ ] /api/test-env 返回 testAccountsEnabled: true
[ ] 浏览器控制台无错误
[ ] Vercel 日志无错误
```

---

**预计测试时间**: 5-10 分钟  
**测试日期**: 2025-10-22  
**修复版本**: commit 4096911

