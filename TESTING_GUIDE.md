# 🧪 Maffix Web 测试指南

## 📋 测试前准备

### 1. 配置数据库

您有两个选择：

#### 选项 A: 使用 Supabase（推荐 - 免费且简单）

1. 访问 [Supabase](https://supabase.com) 并创建免费账户
2. 创建新项目
3. 在项目设置中找到数据库连接字符串
4. 更新 `apps/web/.env.local` 中的 `DATABASE_URL`

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

#### 选项 B: 使用本地 PostgreSQL

1. 安装 PostgreSQL（如果尚未安装）
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # 创建数据库
   createdb maffix
   ```

2. 使用默认配置（已在 `.env.local` 中）
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/maffix?schema=public"
   ```

### 2. 运行数据库迁移

```bash
cd apps/web
npx prisma db push
```

这将创建所有必要的数据库表。

### 3. （可选）填充测试数据

创建一些测试任务和奖品：

```bash
npx prisma db seed
```

---

## 🚀 启动开发服务器

### 方法 1: 使用 Turborepo（推荐）

从项目根目录运行：

```bash
npm run dev
```

### 方法 2: 直接启动 Next.js

```bash
cd apps/web
npm run dev
```

服务器将在 **http://localhost:3000** 启动

---

## ✅ 测试清单

### 1. 首页测试
- [ ] 访问 http://localhost:3000
- [ ] 确认看到 "Welcome to Maffix" 标题
- [ ] 点击 "Login" 和 "Register" 按钮确认跳转正常

### 2. 注册功能测试
- [ ] 访问 http://localhost:3000/register
- [ ] 填写注册表单：
  - 姓名：Test User
  - 邮箱：test@example.com
  - 密码：password123
  - 确认密码：password123
- [ ] 点击 "Create account"
- [ ] 确认跳转到登录页面

### 3. 登录功能测试
- [ ] 访问 http://localhost:3000/login
- [ ] 使用刚注册的账户登录：
  - 邮箱：test@example.com
  - 密码：password123
- [ ] 点击 "Sign in"
- [ ] 确认跳转到 Dashboard

### 4. Dashboard 测试
- [ ] 确认看到欢迎信息 "Welcome back, Test User!"
- [ ] 确认看到三个统计卡片：
  - 💎 Diamonds: 0
  - ⭐ Points: 0
  - 🏆 Level: 1
- [ ] 确认看到快速操作按钮
- [ ] 确认看到账户信息

### 5. 导航测试
- [ ] 点击顶部导航栏的 "Tasks" 链接
- [ ] 确认跳转到任务列表页面
- [ ] 点击 "Gacha" 链接
- [ ] 确认跳转到 Gacha 页面
- [ ] 点击 "Prizes" 链接
- [ ] 确认跳转到奖品页面
- [ ] 点击用户图标
- [ ] 确认跳转到个人资料页面

### 6. 任务页面测试
- [ ] 访问 http://localhost:3000/tasks
- [ ] 如果没有任务，应该看到 "No tasks available"
- [ ] 如果有任务，确认显示：
  - 任务标题和描述
  - 难度标签（Easy/Medium/Hard）
  - 奖励（Diamonds 和 Points）
  - "Start Task" 按钮

### 7. Gacha 页面测试
- [ ] 访问 http://localhost:3000/gacha
- [ ] 确认看到 Diamond 余额卡片
- [ ] 确认看到 "Pull Gacha" 按钮
- [ ] 如果余额不足，按钮应该是禁用状态
- [ ] 确认看到奖品池列表

### 8. 奖品页面测试
- [ ] 访问 http://localhost:3000/prizes
- [ ] 如果没有奖品，应该看到 "No prizes yet" 提示
- [ ] 确认有 "View Tasks" 和 "Try Gacha" 按钮

### 9. 个人资料页面测试
- [ ] 访问 http://localhost:3000/profile
- [ ] 确认看到用户信息卡片
- [ ] 确认看到统计数据：
  - Tasks Completed: 0
  - Prizes Won: 0
  - Prizes Redeemed: 0
  - Total Earned: 💎 0
- [ ] 确认看到 "Recent Transactions" 部分
- [ ] 如果没有交易，应该显示 "No transactions yet"

### 10. 登出测试
- [ ] 在个人资料页面点击 "Sign out" 按钮
- [ ] 确认跳转回首页
- [ ] 尝试访问 http://localhost:3000/dashboard
- [ ] 确认被重定向到登录页面

### 11. 路由保护测试
- [ ] 登出状态下访问 http://localhost:3000/dashboard
- [ ] 确认被重定向到 /login
- [ ] 登出状态下访问 http://localhost:3000/tasks
- [ ] 确认被重定向到 /login
- [ ] 登录后访问 http://localhost:3000/login
- [ ] 确认被重定向到 /dashboard

---

## 🐛 常见问题排查

### 问题 1: 数据库连接失败

**错误信息**: `Can't reach database server`

**解决方案**:
1. 检查 `.env.local` 中的 `DATABASE_URL` 是否正确
2. 如果使用本地 PostgreSQL，确认服务已启动：
   ```bash
   brew services list  # macOS
   ```
3. 如果使用 Supabase，检查网络连接

### 问题 2: Prisma Client 未生成

**错误信息**: `Cannot find module '@prisma/client'`

**解决方案**:
```bash
cd apps/web
npx prisma generate
```

### 问题 3: 端口已被占用

**错误信息**: `Port 3000 is already in use`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀死进程
kill -9 $(lsof -ti:3000)

# 或者使用不同端口
PORT=3001 npm run dev
```

### 问题 4: NextAuth 错误

**错误信息**: `[next-auth][error][NO_SECRET]`

**解决方案**:
确认 `.env.local` 中有 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL`

### 问题 5: 样式未加载

**解决方案**:
1. 清除 Next.js 缓存：
   ```bash
   rm -rf apps/web/.next
   ```
2. 重新启动开发服务器

---

## 📊 测试数据库状态

### 查看数据库内容

使用 Prisma Studio：

```bash
cd apps/web
npx prisma studio
```

这将在 http://localhost:5555 打开可视化数据库管理界面。

### 重置数据库

如果需要清空所有数据：

```bash
cd apps/web
npx prisma db push --force-reset
```

⚠️ **警告**: 这将删除所有数据！

---

## 📝 测试报告模板

测试完成后，请填写以下信息：

```
测试日期: ___________
测试人员: ___________

✅ 通过的测试:
- [ ] 首页
- [ ] 注册
- [ ] 登录
- [ ] Dashboard
- [ ] 导航
- [ ] 任务页面
- [ ] Gacha 页面
- [ ] 奖品页面
- [ ] 个人资料
- [ ] 登出
- [ ] 路由保护

❌ 失败的测试:
- 

🐛 发现的问题:
1. 
2. 

💡 改进建议:
1. 
2. 
```

---

## 🎯 下一步

测试完成并确认所有功能正常后，我们将继续：

- **Phase 8**: 实现任务系统（任务提交和审核）
- **Phase 9**: 实现 Gacha 系统（抽奖逻辑）
- **Phase 10**: 测试与优化

---

## 📞 需要帮助？

如果遇到任何问题，请告诉我：
1. 具体的错误信息
2. 您正在测试的功能
3. 浏览器控制台的错误日志（F12 打开开发者工具）

