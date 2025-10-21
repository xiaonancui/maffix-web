# 📚 Maffix Web Documentation Index

Welcome to the Maffix Web documentation! This index provides a comprehensive guide to all available documentation organized by category.

## 📖 Table of Contents

- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Development](#-development)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Refactoring History](#-refactoring-history)

---

## 🚀 Getting Started

Start here if you're new to the project.

### Quick Start
- **[Quick Start Guide](development/QUICK_START.md)**  
  Complete setup instructions for local development, including environment configuration, database setup, and running the application.

### Test Accounts
- **[Test Accounts Guide](testing/TEST_ACCOUNTS_GUIDE.md)**  
  Pre-configured test accounts for development and testing, including user and admin credentials.

---

## 🏗️ Architecture

Understand the system design and technical decisions.

### System Architecture
- **[Architecture Overview](architecture/ARCHITECTURE.md)**  
  Comprehensive overview of the system architecture, including:
  - Technology stack (Next.js 14, Turborepo, Prisma, NextAuth.js)
  - Database schema and relationships
  - Authentication flow
  - API structure
  - Frontend architecture

### Historical Context
- **[Architecture Comparison](refactoring-history/ARCHITECTURE_COMPARISON.md)**  
  Comparison between the old NestJS + Refine architecture and the new Next.js 14 architecture.

---

## 💻 Development

Resources for active development.

### Setup & Configuration
- **[Quick Start Guide](development/QUICK_START.md)**  
  Detailed local development setup instructions.

### Code Organization
The project follows a monorepo structure with Turborepo:
```
apps/web/              # Main Next.js application
├── src/
│   ├── app/          # App Router (pages + API routes)
│   ├── components/   # React components
│   └── lib/          # Utilities and configurations
└── prisma/           # Database schema and migrations
```

### Key Technologies
- **Frontend**: Next.js 14 (App Router, Server Components)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **UI**: shadcn/ui + Tailwind CSS
- **Monorepo**: Turborepo

---

## 🚢 Deployment

Production deployment guides and troubleshooting.

### Deployment Guides
- **[Deployment Overview](deployment/DEPLOYMENT.md)**  
  General deployment instructions and best practices.

- **[Vercel Setup](deployment/VERCEL_SETUP.md)**  
  Complete Vercel deployment configuration, including environment variables and build settings.

- **[Supabase Setup](deployment/SUPABASE_FIX_GUIDE.md)**  
  PostgreSQL database configuration with Supabase, including connection pooling and SSL setup.

- **[GitHub Actions](deployment/GITHUB_ACTIONS.md)**  
  CI/CD pipeline configuration for automated testing and deployment.

### Troubleshooting Guides

#### Vercel-Specific Issues
- **[Vercel Login Fix](deployment/VERCEL_LOGIN_FIX.md)**  
  Solutions for authentication issues on Vercel (NEXTAUTH_URL, JWT secret, session handling).

- **[Quick Fix: Vercel Login](deployment/QUICK_FIX_VERCEL_LOGIN.md)**  
  Quick reference for common Vercel login problems.

- **[Vercel Deployment Diagnosis](deployment/VERCEL_DEPLOYMENT_DIAGNOSIS.md)**  
  Comprehensive troubleshooting guide for Vercel deployment issues.

- **[Vercel Fix Summary](deployment/VERCEL_FIX_SUMMARY.md)**  
  Summary of all Vercel-related fixes applied to the project.

#### Setup Guides
- **[Vercel Dashboard Setup](deployment/VERCEL_DASHBOARD_SETUP.md)**  
  Step-by-step guide for configuring the Vercel dashboard.

- **[Vercel Test Accounts Setup](deployment/VERCEL_TEST_ACCOUNTS_SETUP.md)**  
  Setting up test accounts in the Vercel production environment.

- **[Vercel Login Diagnosis](deployment/VERCEL_LOGIN_DIAGNOSIS.md)**  
  Detailed diagnosis of login issues specific to Vercel deployments.

---

## 🧪 Testing

Testing strategies, guides, and results.

### Testing Documentation
- **[Testing Guide](testing/TESTING_GUIDE.md)**  
  Comprehensive testing documentation including:
  - Unit testing strategies
  - Integration testing
  - E2E testing
  - Test account usage
  - Testing best practices

- **[Test Accounts Guide](testing/TEST_ACCOUNTS_GUIDE.md)**  
  Detailed information about pre-configured test accounts:
  - User accounts (different roles)
  - Admin accounts
  - Test data setup

- **[Test Summary](testing/TEST_SUMMARY.md)**  
  Summary of test results, coverage reports, and testing status.

---

## 📜 Refactoring History

Historical documentation of the major refactoring from NestJS + Refine to Next.js 14.

### Overview
The project underwent a complete architectural refactoring to simplify the stack and improve maintainability. These documents provide context and guidance for understanding the evolution of the codebase.

### Refactoring Documentation

#### Executive Summary
- **[Executive Summary](refactoring-history/EXECUTIVE_SUMMARY.md)**  
  High-level overview of the refactoring project, goals, and outcomes.

- **[Refactoring Complete](refactoring-history/REFACTORING_COMPLETE.md)**  
  Final summary of the completed refactoring work.

#### Planning & Analysis
- **[Refactoring Proposal](refactoring-history/REFACTORING_PROPOSAL.md)**  
  Initial proposal for the refactoring, including rationale and approach.

- **[Refactoring Analysis](refactoring-history/REFACTORING_ANALYSIS.md)**  
  Detailed analysis of the existing codebase and refactoring requirements.

- **[Architecture Comparison](refactoring-history/ARCHITECTURE_COMPARISON.md)**  
  Side-by-side comparison of old vs. new architecture.

#### Implementation
- **[Refactoring Implementation Plan](refactoring-history/REFACTORING_IMPLEMENTATION_PLAN.md)**  
  Step-by-step implementation plan for the refactoring.

- **[Implementation Checklist](refactoring-history/IMPLEMENTATION_CHECKLIST.md)**  
  Detailed checklist of all refactoring tasks.

- **[Backend Migration Guide](refactoring-history/BACKEND_MIGRATION_GUIDE.md)**  
  Guide for migrating from NestJS backend to Next.js API routes.

#### Quick References
- **[Quick Start (Refactoring)](refactoring-history/QUICK_START_REFACTORING.md)**  
  Quick start guide specific to the refactored codebase.

- **[Refactoring Summary](refactoring-history/REFACTORING_SUMMARY.md)**  
  Concise summary of all refactoring changes.

- **[Refactoring Docs README](refactoring-history/README_REFACTORING_DOCS.md)**  
  Original README for the refactoring documentation.

#### Historical Reference
- **[Old README](refactoring-history/README.old.md)**  
  Original README from before the refactoring (preserved for reference).

---

## 🔍 Quick Reference

### Common Tasks

**Starting Development:**
```bash
npm install
cp apps/web/.env.example apps/web/.env
cd apps/web && npm run db:setup
cd ../.. && npm run dev
```

**Database Operations:**
```bash
cd apps/web
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

**Testing:**
```bash
npm run test         # Run tests
npm run test:watch   # Watch mode
```

### Important Links

- **Main README**: [../README.md](../README.md)
- **Architecture**: [architecture/ARCHITECTURE.md](architecture/ARCHITECTURE.md)
- **Quick Start**: [development/QUICK_START.md](development/QUICK_START.md)
- **Testing Guide**: [testing/TESTING_GUIDE.md](testing/TESTING_GUIDE.md)
- **Deployment**: [deployment/DEPLOYMENT.md](deployment/DEPLOYMENT.md)

---

## 📞 Need Help?

If you can't find what you're looking for:

1. Check the [Architecture Overview](architecture/ARCHITECTURE.md) for system design questions
2. Review the [Quick Start Guide](development/QUICK_START.md) for setup issues
3. Consult the [Deployment Troubleshooting](deployment/VERCEL_DEPLOYMENT_DIAGNOSIS.md) for production issues
4. Look at the [Refactoring History](refactoring-history/) to understand architectural decisions

---

**Last Updated**: 2025-10-21  
**Documentation Version**: 1.0.0

