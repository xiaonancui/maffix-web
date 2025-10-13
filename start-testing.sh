#!/bin/bash

echo "🚀 Maffix Web - 测试启动脚本"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f "apps/web/.env.local" ]; then
    echo "❌ 错误: apps/web/.env.local 文件不存在"
    echo "请先配置数据库连接字符串"
    echo ""
    echo "示例配置:"
    echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/maffix?schema=public\""
    exit 1
fi

echo "✅ 环境变量文件已找到"
echo ""

# Install tsx if not installed
echo "📦 检查依赖..."
cd apps/web
if ! npm list tsx > /dev/null 2>&1; then
    echo "📦 安装 tsx..."
    npm install
fi
cd ../..

echo "✅ 依赖检查完成"
echo ""

# Generate Prisma Client
echo "🔧 生成 Prisma Client..."
cd apps/web
npx prisma generate
cd ../..

echo "✅ Prisma Client 已生成"
echo ""

# Push database schema
echo "📊 推送数据库 Schema..."
cd apps/web
npx prisma db push
cd ../..

echo "✅ 数据库 Schema 已更新"
echo ""

# Seed database
echo "🌱 填充测试数据..."
cd apps/web
npm run db:seed
cd ../..

echo "✅ 测试数据已填充"
echo ""

# Start development server
echo "🚀 启动开发服务器..."
echo ""
echo "服务器将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev

