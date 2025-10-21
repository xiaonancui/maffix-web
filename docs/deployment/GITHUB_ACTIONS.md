# GitHub Actions CI/CD 配置指南

## 概述

TenTenTen 项目配置了完整的 GitHub Actions CI/CD 流水线，确保代码质量、安全性和自动化部署。

## 工作流程

### 1. 主要 CI/CD 流水线 (`.github/workflows/ci.yml`)

**触发条件：**

- 推送到 `main` 或 `develop` 分支
- 创建针对 `main` 或 `develop` 分支的 Pull Request

**包含的检查：**

- ✅ 代码质量检查（Prettier、ESLint、TypeScript）
- ✅ 前端测试和构建
- ✅ 后端测试和构建
- ✅ 安全扫描（Trivy）
- ✅ 依赖检查和审计
- ✅ 部署准备（仅 main 分支）

### 2. 代码质量工作流 (`.github/workflows/code-quality.yml`)

**触发条件：**

- 推送到 `main`、`develop` 或 `feature/*` 分支
- 创建 Pull Request

**检查项目：**

- 📝 代码格式化检查（Prettier）
- 🔍 代码规范检查（ESLint）
- 🔧 TypeScript 类型检查
- 📋 提交信息格式检查
- 📦 文件大小检查
- 🔒 package-lock.json 一致性检查
- 📊 代码复杂度分析
- 🛡️ 安全性 Linting
- 🌿 分支命名规范检查

### 3. 安全检查工作流 (`.github/workflows/security.yml`)

**触发条件：**

- 推送到 `main` 或 `develop` 分支
- 创建 Pull Request
- 每周一凌晨 2 点定时运行

**安全检查：**

- 🔍 依赖安全审计
- 🛡️ 代码安全扫描（Trivy）
- 🔐 密钥泄露检测（TruffleHog）
- 📄 许可证合规检查
- 🐳 Docker 安全扫描
- 📋 安全策略合规检查

## 自动化功能

### Dependabot 自动更新

配置文件：`.github/dependabot.yml`

**更新频率：**

- 每周一自动检查依赖更新
- 分别处理根目录、前端、后端依赖
- 自动创建 PR 进行依赖更新

**安全策略：**

- 忽略主要版本更新（需要手动审查）
- 自动处理补丁和次要版本更新
- 包含安全漏洞修复的优先级更新

### Pre-commit Hooks

使用 Husky 和 lint-staged 配置：

**提交前自动执行：**

- 代码格式化（Prettier）
- 代码规范检查（ESLint）
- TypeScript 类型检查

**推送前自动执行：**

- 完整的类型检查
- 安全审计

## 如何使用

### 1. 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/your-feature-name

# 2. 开发和提交（会自动触发 pre-commit hooks）
git add .
git commit -m "feat: add new feature"

# 3. 推送分支（会自动触发 pre-push hooks）
git push origin feature/your-feature-name

# 4. 创建 Pull Request
# GitHub Actions 会自动运行所有检查
```

### 2. Pull Request 检查

创建 PR 后，以下检查会自动运行：

1. **代码质量检查** - 确保代码符合项目标准
2. **安全扫描** - 检测潜在的安全漏洞
3. **构建测试** - 验证前后端能正常构建
4. **依赖审计** - 检查依赖包的安全性

### 3. 分支保护规则

建议在 GitHub 设置以下分支保护规则：

**对于 `main` 分支：**

- ✅ 要求 PR 审查
- ✅ 要求状态检查通过
- ✅ 要求分支是最新的
- ✅ 限制推送权限

**对于 `develop` 分支：**

- ✅ 要求状态检查通过
- ✅ 要求分支是最新的

## 故障排除

### 常见问题

#### 1. TypeScript 错误

```bash
# 本地运行类型检查
npm run type-check

# 修复常见类型错误
npm run lint:fix
```

#### 2. 格式化问题

```bash
# 自动格式化代码
npm run format

# 检查格式化状态
npm run format:check
```

#### 3. 安全审计失败

```bash
# 运行安全审计
npm run security:audit

# 自动修复安全问题
npm run security:fix
```

#### 4. 依赖问题

```bash
# 清理并重新安装依赖
npm run clean
npm run install:all
```

### 跳过检查（紧急情况）

```bash
# 跳过 pre-commit hooks
git commit --no-verify -m "emergency fix"

# 跳过 pre-push hooks
git push --no-verify
```

**⚠️ 注意：** 只在紧急情况下使用，跳过检查可能导致代码质量问题。

## 环境变量配置

### GitHub Secrets

在 GitHub 仓库设置中配置以下 Secrets：

**认证相关：**

- `NEXTAUTH_SECRET` - NextAuth 密钥
- `GOOGLE_CLIENT_ID` - Google OAuth 客户端 ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth 客户端密钥
- `TIKTOK_CLIENT_KEY` - TikTok OAuth 客户端密钥
- `TIKTOK_CLIENT_SECRET` - TikTok OAuth 客户端密钥

**部署相关：**

- `VERCEL_TOKEN` - Vercel 部署令牌（如果使用 Vercel）
- `DOCKER_HUB_USERNAME` - Docker Hub 用户名（如果使用 Docker）
- `DOCKER_HUB_ACCESS_TOKEN` - Docker Hub 访问令牌

## 监控和通知

### 状态徽章

在 README.md 中添加状态徽章：

```markdown
![CI](https://github.com/xiaonancui/tententen-web/workflows/CI%2FCD%20Pipeline/badge.svg)
![Security](https://github.com/xiaonancui/tententen-web/workflows/Security%20Checks/badge.svg)
![Code Quality](https://github.com/xiaonancui/tententen-web/workflows/Code%20Quality%20Checks/badge.svg)
```

### 通知设置

GitHub Actions 会在以下情况发送通知：

- ✅ 所有检查通过
- ❌ 检查失败
- ⚠️ 发现安全漏洞
- 📦 Dependabot 创建更新 PR

## 最佳实践

1. **提交信息规范**：使用约定式提交格式

   ```
   feat: 添加新功能
   fix: 修复 bug
   docs: 更新文档
   style: 代码格式调整
   refactor: 代码重构
   test: 添加测试
   chore: 构建过程或辅助工具的变动
   ```

2. **分支命名规范**：

   ```
   feature/功能描述
   bugfix/问题描述
   hotfix/紧急修复描述
   release/版本号
   ```

3. **安全最佳实践**：
   - 定期更新依赖
   - 及时修复安全漏洞
   - 不在代码中硬编码敏感信息
   - 使用环境变量管理配置

4. **代码质量**：
   - 保持代码格式一致
   - 遵循 ESLint 规则
   - 编写类型安全的 TypeScript 代码
   - 添加适当的测试覆盖

---

**📞 需要帮助？**

如果遇到 CI/CD 相关问题，请：

1. 检查 GitHub Actions 日志
2. 查看本文档的故障排除部分
3. 联系开发团队：team@tententen.com
