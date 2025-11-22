# 📚 Maffix Web Documentation Index

Welcome to the Maffix Web documentation! This index provides a comprehensive guide to all available documentation organized by category.

## 📖 Table of Contents

- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Development](#-development)
- [Admin Panel](#-admin-panel)
- [RBAC (Role-Based Access Control)](#-rbac-role-based-access-control)
- [Design Specifications](#-design-specifications)
- [Task Plans & Summaries](#-task-plans--summaries)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Refactoring History](#-refactoring-history)
- [Archive](#-archive)

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

## 🛡️ Admin Panel

Documentation for the admin panel features and implementation.

### Admin Features
- **[Enhanced Visual Differentiation Implementation](admin/ENHANCED_VISUAL_DIFFERENTIATION_IMPLEMENTATION.md)**
  Technical documentation for the admin panel visual design system, including:
  - Red gradient header and borders
  - Admin badges and indicators
  - Dark theme with red accents
  - Enhanced visual hierarchy
  - Implementation details for all admin pages

### Admin Design
- **[Admin Visual Design Specification](design/ADMIN_VISUAL_DESIGN_SPEC.md)**
  Comprehensive design specification for the admin panel visual system.

---

## 🔐 RBAC (Role-Based Access Control)

Complete documentation for the Role-Based Access Control implementation.

### Quick References
- **[RBAC Quick Reference](rbac/RBAC_QUICK_REFERENCE.md)**
  Quick reference guide for RBAC implementation, including:
  - Protected routes and middleware
  - API endpoint authorization
  - Role-based UI components
  - Common patterns and examples

- **[RBAC README](rbac/RBAC_README.md)**
  Overview of the RBAC system and how to use it.

### Comprehensive Documentation
- **[RBAC Executive Summary](rbac/RBAC_EXECUTIVE_SUMMARY.md)**
  High-level overview of the RBAC implementation, goals, and outcomes.

- **[RBAC Specification](rbac/RBAC_SPECIFICATION.md)**
  Detailed technical specification of the RBAC system, including:
  - Role definitions (USER, ADMIN, ARTIST)
  - Permission model
  - Authorization flow
  - Security considerations

- **[RBAC Presentation](rbac/RBAC_PRESENTATION.md)**
  Presentation-style overview of the RBAC system for stakeholders.

- **[RBAC Visual Guide](rbac/RBAC_VISUAL_GUIDE.md)**
  Visual guide showing RBAC in action with screenshots and examples.

### Implementation & Testing
- **[RBAC Task List](rbac/RBAC_TASK_LIST.md)**
  Complete task breakdown for RBAC implementation.

- **[RBAC Testing](rbac/RBAC_TESTING.md)**
  Testing strategy and test cases for RBAC functionality.

- **[RBAC Test Results](rbac/RBAC_TEST_RESULTS.md)**
  Results from RBAC testing, including coverage and issues found.

---

## 🎨 Design Specifications

Design documentation and visual guidelines.

### Admin Panel Design
- **[Admin Visual Design Specification](design/ADMIN_VISUAL_DESIGN_SPEC.md)**
  Comprehensive design specification for the admin panel, including:
  - Color palette (red gradient theme)
  - Typography and spacing
  - Component styling
  - Visual differentiation from user interface
  - Responsive design guidelines
  - Accessibility considerations

---

## 📋 Task Plans & Summaries

Project task plans, completion summaries, and progress tracking.

### Current Tasks
- **[Admin Improvements Task Plan](tasks/ADMIN_IMPROVEMENTS_TASK_PLAN.md)**
  Comprehensive task plan for admin panel improvements, including:
  - Issue 1: Header Color Differentiation (DEFERRED)
  - Issue 2: Admin Layout Design (2 tasks, 8-12 hours)
  - Issue 3: Missing CRUD Operations (12 tasks, 15-20 hours)
  - Issue 4: Store Visibility Logic (2 tasks, 30-60 minutes)
  - Total: 17 tasks, 26-36 hours

- **[Admin Improvements Summary](tasks/ADMIN_IMPROVEMENTS_SUMMARY.md)**
  Executive summary of the admin improvements task plan.

### Completed Tasks
- **[Bug Fixes Task Plan](tasks/BUG_FIXES_TASK_PLAN.md)**
  Task plan for bug fixes and UI improvements (completed).

- **[Bug Fixes Completion Summary](tasks/BUG_FIXES_COMPLETION_SUMMARY.md)**
  Summary of completed bug fixes, including:
  - Admin panel header color fix
  - Store links visibility verification
  - Mission details page dark theme
  - Transactions page dark theme
  - Enhanced visual differentiation

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

## 📦 Archive

Historical documentation from completed projects and older implementations.

### Completed Projects
- **[Project Completion Report](archive/PROJECT_COMPLETION_REPORT.md)**
  Final report for the initial MVP development phase.

- **[Phase 3 Complete](archive/PHASE_3_COMPLETE.md)**
  Summary of Phase 3 completion.

- **[Production Fixes Summary](archive/PRODUCTION_FIXES_SUMMARY.md)**
  Summary of production bug fixes and improvements.

### Feature-Specific Documentation
- **[Gacha Fix Summary](archive/GACHA_FIX_SUMMARY.md)**
  Documentation of gacha system fixes and improvements.

- **[Gacha Quick Test](archive/GACHA_QUICK_TEST.md)**
  Quick testing guide for the gacha system.

- **[Marketing Pages Final Report](archive/MARKETING_PAGES_FINAL_REPORT.md)**
  Final report on marketing pages implementation.

- **[Marketing Pages Summary](archive/MARKETING_PAGES_SUMMARY.md)**
  Summary of marketing pages features.

- **[UI Enhancement Report](archive/UI_ENHANCEMENT_REPORT.md)**
  Report on UI enhancements and improvements.

- **[Visual Improvements Summary](archive/VISUAL_IMPROVEMENTS_SUMMARY.md)**
  Summary of visual design improvements.

### Testing & Troubleshooting
- **[Quick Test Guide](archive/QUICK_TEST_GUIDE.md)**
  Quick testing guide for various features.

- **[Dev Server Troubleshooting](archive/DEV_SERVER_TROUBLESHOOTING.md)**
  Troubleshooting guide for development server issues.

### Historical Task Breakdowns
- **[Maffix MVP Development Task Breakdown (2025-10-22)](archive/Maffix_MVP_Development_Task_Breakdown__2025-10-22T08-54-50.md)**
  Original MVP development task breakdown from October 2025.

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
- **RBAC Quick Reference**: [rbac/RBAC_QUICK_REFERENCE.md](rbac/RBAC_QUICK_REFERENCE.md)
- **Admin Visual Design**: [design/ADMIN_VISUAL_DESIGN_SPEC.md](design/ADMIN_VISUAL_DESIGN_SPEC.md)
- **Current Task Plan**: [tasks/ADMIN_IMPROVEMENTS_TASK_PLAN.md](tasks/ADMIN_IMPROVEMENTS_TASK_PLAN.md)
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

**Last Updated**: 2025-11-21
**Documentation Version**: 2.0.0
**Major Update**: Added Admin Panel, RBAC, Design Specifications, Task Plans, and Archive sections

