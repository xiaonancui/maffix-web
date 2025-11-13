# 🔧 开发服务器故障排查指南

## 问题：ChunkLoadError: Loading chunk app/layout failed

### 错误信息
```
ChunkLoadError: Loading chunk app/layout failed.
(missing: http://localhost:3000/_next/static/chunks/app/layout.js)
```

---

## 🔍 根本原因

这个错误通常由以下原因引起：

1. **`.next` 缓存损坏**
   - Next.js 构建缓存出现问题
   - 热重载（HMR）状态不一致

2. **端口冲突**
   - 多个 Next.js 进程同时运行
   - 端口 3000 被其他进程占用

3. **Node 模块缓存问题**
   - `node_modules/.cache` 缓存损坏

4. **浏览器缓存问题**
   - 浏览器缓存了旧的 chunk 文件

---

## ✅ 解决方案

### 方案 1：清理 .next 缓存并重启（推荐）

```bash
# 进入 web 应用目录
cd apps/web

# 删除 .next 缓存
rm -rf .next

# 重新启动开发服务器
npm run dev
```

### 方案 2：完全清理缓存（彻底）

```bash
# 进入 web 应用目录
cd apps/web

# 删除所有缓存
rm -rf .next node_modules/.cache

# 重新启动开发服务器
npm run dev
```

### 方案 3：杀掉占用端口的进程

```bash
# 查找占用 3000 端口的进程
lsof -ti:3000

# 杀掉这些进程（替换 PID 为实际的进程 ID）
kill -9 <PID>

# 或者一行命令杀掉所有占用 3000 端口的进程
lsof -ti:3000 | xargs kill -9

# 重新启动开发服务器
cd apps/web && npm run dev
```

### 方案 4：清理浏览器缓存

1. 打开浏览器开发者工具（F12）
2. 右键点击刷新按钮
3. 选择 **"清空缓存并硬性重新加载"**

或者使用无痕模式：
- Chrome/Edge: `Ctrl+Shift+N` (Windows) 或 `Cmd+Shift+N` (Mac)
- Firefox: `Ctrl+Shift+P` (Windows) 或 `Cmd+Shift+P` (Mac)

### 方案 5：完全重置（终极方案）

```bash
# 停止所有 Node 进程
pkill -f node

# 进入项目根目录
cd /Users/xiaonan/Projects/web/maffix-web

# 清理所有缓存和构建文件
rm -rf apps/web/.next
rm -rf apps/web/node_modules/.cache
rm -rf node_modules/.cache
rm -rf .turbo

# 重新安装依赖（可选，通常不需要）
# npm install

# 重新启动开发服务器
cd apps/web && npm run dev
```

---

## 🚀 快速修复命令（一键执行）

```bash
# 一键清理并重启
cd apps/web && rm -rf .next node_modules/.cache && npm run dev
```

---

## 🔍 验证修复

### 1. 检查开发服务器启动

启动后应该看到：
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
- Environments: .env.local, .env

✓ Starting...
✓ Ready in 1457ms
```

### 2. 访问应用

打开浏览器访问：http://localhost:3000

### 3. 检查浏览器控制台

- 打开开发者工具（F12）
- 切换到 Console 标签
- 确认没有 ChunkLoadError 错误

---

## 📋 预防措施

### 1. 正确停止开发服务器

使用 `Ctrl+C` 停止开发服务器，而不是直接关闭终端。

### 2. 定期清理缓存

如果经常遇到此问题，可以创建一个清理脚本：

```bash
# 创建清理脚本
cat > clean-dev.sh << 'EOF'
#!/bin/bash
echo "🧹 Cleaning Next.js cache..."
cd apps/web
rm -rf .next node_modules/.cache
echo "✅ Cache cleaned!"
echo "🚀 Starting dev server..."
npm run dev
EOF

# 添加执行权限
chmod +x clean-dev.sh

# 使用脚本启动
./clean-dev.sh
```

### 3. 使用 Turbo 清理命令

```bash
# 清理所有 Turbo 缓存
npx turbo clean

# 然后重新启动
cd apps/web && npm run dev
```

---

## 🐛 其他常见开发服务器问题

### 问题 1: Port 3000 is in use

**错误信息**：
```
⚠ Port 3000 is in use, trying 3001 instead.
```

**解决方案**：
```bash
# 杀掉占用 3000 端口的进程
lsof -ti:3000 | xargs kill -9

# 或者使用其他端口
PORT=3002 npm run dev
```

### 问题 2: Module not found

**错误信息**：
```
Module not found: Can't resolve '...'
```

**解决方案**：
```bash
# 重新安装依赖
npm install

# 清理缓存并重启
rm -rf .next node_modules/.cache && npm run dev
```

### 问题 3: Fast Refresh 不工作

**解决方案**：
```bash
# 清理缓存
rm -rf .next

# 确保文件保存正确
# 检查编辑器的自动保存设置
```

---

## ✅ 修复完成

**问题**：ChunkLoadError: Loading chunk app/layout failed  
**解决方案**：清理 `.next` 缓存并重启开发服务器  
**状态**：✅ 已修复  
**开发服务器**：http://localhost:3000

---

**修复日期**：2025-10-22  
**修复方法**：`rm -rf .next node_modules/.cache && npm run dev`

