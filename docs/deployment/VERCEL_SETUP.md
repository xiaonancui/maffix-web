# 🚀 Vercel 部署快速设置指南

## ⚠️ 关键配置

在 Vercel Dashboard 中导入项目时，**必须**设置以下配置：

### Root Directory (根目录)
```
apps/web
```

**为什么？**
- 这是一个 monorepo 项目，Next.js 应用在 `apps/web` 子目录中
- 如果不设置，Vercel 会在错误的位置查找文件
- 设置后，Vercel 会将 `apps/web` 视为项目根目录

### 其他设置
- **Framework Preset**: Next.js (自动检测)
- **Build Command**: 留空（使用默认）
- **Output Directory**: 留空（使用默认 `.next`）
- **Install Command**: 留空（使用默认 `npm install`）

## 📝 部署步骤

1. **在 Vercel 中导入项目**
   ```
   https://vercel.com/new
   ```

2. **选择 GitHub 仓库**
   ```
   xiaonancui/maffix-web
   ```

3. **配置项目设置**
   - ⚠️ **Root Directory**: 设置为 `apps/web`
   - 其他设置保持默认

4. **添加环境变量**
   ```
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   DATABASE_URL=your_database_url
   ```

5. **点击 Deploy**

## 🔧 如果部署失败

### 错误: "No such file or directory"
**解决方案**: 确保 Root Directory 设置为 `apps/web`

### 错误: "routes-manifest.json couldn't be found"
**解决方案**: 
1. 检查 Root Directory 是否正确设置为 `apps/web`
2. 确保 Output Directory 留空（不要设置为 `apps/web/.next`）

### 错误: "Failed to collect page data"
**解决方案**: 
1. 确保所有环境变量已设置
2. 检查 DATABASE_URL 是否正确

## 📚 完整文档

查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) 获取完整的部署指南。

## 🎯 项目结构

```
maffix-web/
├── apps/
│   └── web/          ← Vercel Root Directory 指向这里
│       ├── src/
│       ├── prisma/
│       ├── package.json
│       └── next.config.js
├── packages/
├── package.json      ← Monorepo 根目录
└── turbo.json
```

## ✅ 验证清单

部署前确认：
- [ ] Root Directory 设置为 `apps/web`
- [ ] 环境变量已添加（至少 NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL）
- [ ] Build Command 留空
- [ ] Output Directory 留空
- [ ] Framework Preset 为 Next.js
