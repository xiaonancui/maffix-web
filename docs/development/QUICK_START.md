# 🚀 Maffix Web - 快速开始测试

## 📋 前置要求

1. **Node.js 18+** 已安装
2. **PostgreSQL 数据库** (选择以下之一)：
   - 本地 PostgreSQL
   - Supabase 免费账户

---

## ⚡ 快速启动（3 步）

### 步骤 1: 配置数据库连接

编辑 `apps/web/.env.local` 文件，设置您的数据库连接：

**选项 A - 本地 PostgreSQL:**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/maffix?schema=public"
```

**选项 B - Supabase:**
```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 步骤 2: 安装依赖并初始化数据库

```bash
# 安装 tsx（用于运行 seed 脚本）
cd apps/web
npm install
cd ../..
```

### 步骤 3: 运行自动化启动脚本

```bash
./start-testing.sh
```

这个脚本会自动：
- ✅ 生成 Prisma Client
- ✅ 创建数据库表
- ✅ 填充测试数据（5个任务 + 6个奖品）
- ✅ 启动开发服务器

---

## 🧪 手动启动（如果自动脚本失败）

### 1. 生成 Prisma Client
```bash
cd apps/web
npx prisma generate
```

### 2. 创建数据库表
```bash
npx prisma db push
```

### 3. 填充测试数据
```bash
npm run db:seed
```

### 4. 启动开发服务器
```bash
cd ../..
npm run dev
```

---

## 🎯 测试账户

创建一个测试账户：

1. 访问 http://localhost:3000/register
2. 填写信息：
   - **姓名**: Test User
   - **邮箱**: test@maffix.com
   - **密码**: password123
3. 注册后登录

---

## ✅ 快速测试清单

访问以下页面确认功能正常：

- [ ] **首页**: http://localhost:3000
- [ ] **注册**: http://localhost:3000/register
- [ ] **登录**: http://localhost:3000/login
- [ ] **Dashboard**: http://localhost:3000/dashboard
- [ ] **任务列表**: http://localhost:3000/tasks (应该看到 5 个任务)
- [ ] **Gacha**: http://localhost:3000/gacha (应该看到 6 个奖品)
- [ ] **我的奖品**: http://localhost:3000/prizes
- [ ] **个人资料**: http://localhost:3000/profile

---

## 🎨 预期效果

### Dashboard 页面应该显示：
- ✅ 欢迎信息 "Welcome back, Test User!"
- ✅ 三个统计卡片（Diamonds: 0, Points: 0, Level: 1）
- ✅ 快速操作按钮
- ✅ 账户信息

### 任务页面应该显示：
- ✅ 5 个测试任务：
  1. Follow on Social Media (Easy, 5💎 10⭐)
  2. Write a Review (Medium, 25💎 50⭐)
  3. Daily Check-in (Easy, 2💎 5⭐)
  4. Complete Your Profile (Easy, 10💎 20⭐)
  5. Refer a Friend (Hard, 50💎 100⭐)

### Gacha 页面应该显示：
- ✅ 6 个奖品：
  1. Exclusive Sticker Pack (Common, 40%)
  2. Limited Edition T-Shirt (Rare, 25%)
  3. VIP Concert Ticket (Epic, 15%)
  4. Meet & Greet Pass (Legendary, 5%)
  5. 20% Discount Code (Common, 10%)
  6. Exclusive Album Access (Epic, 5%)

---

## 🔧 常用命令

```bash
# 查看数据库内容（可视化界面）
cd apps/web
npx prisma studio

# 重置数据库（删除所有数据）
npx prisma db push --force-reset

# 重新填充测试数据
npm run db:seed

# 查看数据库连接状态
npx tsx scripts/test-db.ts
```

---

## 🐛 遇到问题？

### 问题 1: 数据库连接失败
```
Error: Can't reach database server
```
**解决方案**: 
- 检查 PostgreSQL 是否运行: `brew services list`
- 检查 `.env.local` 中的 `DATABASE_URL` 是否正确

### 问题 2: Prisma Client 未找到
```
Error: Cannot find module '@prisma/client'
```
**解决方案**:
```bash
cd apps/web
npx prisma generate
```

### 问题 3: 端口被占用
```
Error: Port 3000 is already in use
```
**解决方案**:
```bash
# 杀死占用端口的进程
kill -9 $(lsof -ti:3000)
```

### 问题 4: tsx 未安装
```
Error: Cannot find module 'tsx'
```
**解决方案**:
```bash
cd apps/web
npm install tsx --save-dev
```

---

## 📊 查看数据库

启动 Prisma Studio 可视化界面：

```bash
cd apps/web
npx prisma studio
```

访问 http://localhost:5555 查看和编辑数据库内容。

---

## 🎉 测试完成后

测试完成后，请告诉我：

1. ✅ **哪些功能正常工作**
2. ❌ **哪些功能有问题**
3. 🐛 **遇到的错误信息**
4. 💡 **改进建议**

然后我们将继续：
- **Phase 8**: 实现任务系统（任务提交和审核）
- **Phase 9**: 实现 Gacha 系统（抽奖逻辑）
- **Phase 10**: 测试与优化

---

## 📞 需要帮助

如果遇到任何问题，请提供：
1. 错误信息截图
2. 浏览器控制台日志（F12）
3. 终端错误输出

我会帮您快速解决！🚀

