# 🚀 Deployment Guide

This document outlines the complete CI/CD pipeline and deployment process for the Maffix Web application.

## 📋 Overview

The project uses a modern CI/CD pipeline with the following components:

- **GitHub Actions** for continuous integration and deployment
- **Vercel** for hosting and automatic deployments
- **Turborepo** for efficient monorepo builds
- **Next.js 14** with App Router architecture
- **PostgreSQL** database with Prisma ORM

## 🔄 CI/CD Workflows

### 1. Main Pipeline (`main.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests

**Jobs:**
- **Quality Checks**: Code formatting, linting, type checking, security audit
- **Build & Test**: Generate Prisma client, run tests, build application
- **Deploy Preview**: Deploy to Vercel preview (PRs and non-main branches)
- **Deploy Production**: Deploy to Vercel production (main branch only)
- **Database Migration**: Run migrations on production (main branch only)

### 2. Quality Checks (`quality-checks.yml`)

**Triggers:** Pull Requests, Push to main branches

**Jobs:**
- **Lint & Format Check**: ESLint, Prettier, dependency checks
- **Type Safety**: TypeScript compilation and type checking
- **Security Audit**: npm audit, vulnerability scanning
- **Dependency Review**: License and security review for PRs

### 3. Tests (`tests.yml`)

**Triggers:** Pull Requests, Push to main branches

**Jobs:**
- **Unit Tests**: Jest/Vitest unit tests with coverage
- **Integration Tests**: Database integration tests with PostgreSQL
- **E2E Tests**: Playwright end-to-end tests (main branch only)

### 4. Deployment Status (`deployment-status.yml`)

**Triggers:** Deployment status changes

**Jobs:**
- **Notify Deployment**: Success/failure notifications
- **Health Check**: Post-deployment health and performance checks

## 🔧 Required Secrets

Configure these secrets in your GitHub repository settings:

### Vercel Deployment
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Application Environment
```
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=your_production_database_url
```

### OAuth Providers
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

### Optional (for Turbo Remote Caching)
```
TURBO_TOKEN=your_turbo_token
TURBO_TEAM=your_turbo_team
```

## 🌐 Deployment Environments

### Preview Deployments
- **Trigger**: Pull requests and pushes to non-main branches
- **URL**: Auto-generated Vercel preview URLs
- **Purpose**: Testing and review before production

### Production Deployment
- **Trigger**: Push to `main` branch
- **URL**: https://maffix-web.vercel.app
- **Features**: 
  - Automatic database migrations
  - Health checks
  - Performance monitoring

## 📦 Build Process

The build process uses Turborepo for efficient caching and parallel execution:

1. **Install Dependencies**: `npm ci --ignore-scripts`
2. **Generate Prisma Client**: `npm run db:generate`
3. **Type Checking**: `npm run type-check`
4. **Linting**: `npm run lint`
5. **Testing**: `npm run test`
6. **Building**: `npm run build`

## 🔍 Quality Gates

All deployments must pass these quality gates:

- ✅ Code formatting (Prettier)
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Security audit (npm audit)
- ✅ Unit tests
- ✅ Build success

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify environment variables
   - Ensure Prisma schema is up to date

2. **Deployment Failures**
   - Verify Vercel secrets are configured
   - Check build logs in GitHub Actions
   - Ensure database is accessible

3. **Test Failures**
   - Check test database configuration
   - Verify mock data setup
   - Review test environment variables

### Debug Commands

```bash
# Local build test
npm run build

# Type checking
npm run type-check

# Run tests locally
npm run test

# Check formatting
npm run format:check

# Lint code
npm run lint
```

## 📈 Monitoring

Post-deployment monitoring includes:

- **Health Checks**: HTTP status and response time
- **Performance Checks**: Page load times
- **Error Tracking**: Application errors and exceptions
- **Deployment Notifications**: Success/failure alerts

## 🔄 Rollback Process

If a deployment fails or causes issues:

1. **Automatic**: Vercel maintains previous deployments
2. **Manual**: Use Vercel dashboard to promote previous deployment
3. **Database**: Run migration rollback if needed

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
