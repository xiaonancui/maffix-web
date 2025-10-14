#!/bin/bash

# Vercel 部署修复脚本
# 此脚本帮助您快速修复 Vercel 部署问题

echo "🔧 Vercel 部署修复脚本"
echo "======================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

echo "📋 当前配置检查:"
echo ""

# 检查 vercel.json
if [ -f "vercel.json" ]; then
    echo "✅ 发现 vercel.json 文件"
    echo ""
    echo "当前 vercel.json 内容:"
    cat vercel.json
    echo ""
    echo "⚠️  建议: 删除或简化 vercel.json，改用 Vercel Dashboard 配置"
    echo ""
    read -p "是否备份并删除 vercel.json? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mv vercel.json vercel.json.backup
        echo "✅ 已备份为 vercel.json.backup"
        
        read -p "是否使用推荐的简化配置? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp vercel.json.recommended vercel.json
            echo "✅ 已创建简化的 vercel.json"
        fi
    fi
else
    echo "ℹ️  未发现 vercel.json 文件"
    echo ""
    read -p "是否创建推荐的 vercel.json? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp vercel.json.recommended vercel.json
        echo "✅ 已创建 vercel.json"
    fi
fi

echo ""
echo "📝 下一步操作:"
echo ""
echo "1. 在 Vercel Dashboard 中配置:"
echo "   - Root Directory: apps/web"
echo "   - Framework Preset: Next.js"
echo "   - 其他设置保持默认"
echo ""
echo "2. 添加环境变量（不使用 @ 前缀）:"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL"
echo "   - DATABASE_URL"
echo ""
echo "3. 重新连接 GitHub 集成:"
echo "   - 进入项目设置 → Git"
echo "   - Disconnect 然后重新 Connect"
echo ""
echo "4. 提交并推送更改:"
echo "   git add ."
echo "   git commit -m 'fix: update Vercel configuration'"
echo "   git push origin main"
echo ""
echo "📚 详细说明请查看: VERCEL_DEPLOYMENT_DIAGNOSIS.md"
echo ""

