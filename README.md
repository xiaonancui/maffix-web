# 🎵 Maffix Web - Independent Musician Fan Engagement Platform

A TikTok-exclusive fan engagement platform designed to increase musician visibility through gamified missions, virtual currency rewards, and prize draws.

## ✨ Features

- **User Authentication**: Email/password and TikTok OAuth login
- **Mission System**: Complete TikTok promotional missions (Follow, Like, Repost, Use Audio) to earn Diamonds
- **Gacha System**: Prize draw system with rarity tiers and SSR guarantee
- **Monetization**: Premium Packs with guaranteed merchandise and bonus draw tickets (Klarna integration)
- **Admin Panel**: Mission verification and management

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env

# Set up database
cd apps/web && npm run db:setup

# Start development server
cd ../.. && npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Test Accounts

- **User**: \`user@maffix.com\` / \`password123\`
- **Admin**: \`admin@maffix.com\` / \`password123\`

## 📚 Documentation

### Getting Started
- [Quick Start Guide](docs/development/QUICK_START.md) - Detailed setup instructions
- [Test Accounts Guide](docs/testing/TEST_ACCOUNTS_GUIDE.md) - Testing with pre-configured accounts

### Architecture & Development
- [Architecture Overview](docs/architecture/ARCHITECTURE.md) - System architecture and design decisions
- [Refactoring History](docs/refactoring-history/) - Complete refactoring documentation from NestJS to Next.js

### Deployment
- [Deployment Guide](docs/deployment/DEPLOYMENT.md) - Production deployment instructions
- [Vercel Setup](docs/deployment/VERCEL_SETUP.md) - Vercel-specific configuration
- [Supabase Setup](docs/deployment/SUPABASE_FIX_GUIDE.md) - Database configuration
- [GitHub Actions](docs/deployment/GITHUB_ACTIONS.md) - CI/CD pipeline

### Testing
- [Testing Guide](docs/testing/TESTING_GUIDE.md) - Comprehensive testing documentation
- [Test Summary](docs/testing/TEST_SUMMARY.md) - Test results and coverage

### Troubleshooting
- [Vercel Login Fix](docs/deployment/VERCEL_LOGIN_FIX.md) - Common login issues on Vercel
- [Deployment Diagnosis](docs/deployment/VERCEL_DEPLOYMENT_DIAGNOSIS.md) - Debugging deployment issues

📖 **[Complete Documentation Index](docs/README.md)**

## 🛠️ Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router, Server Components, API Routes)
- **Monorepo**: Turborepo
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **UI**: shadcn/ui + Tailwind CSS
- **Payments**: Klarna
- **Deployment**: Vercel

## 📦 Project Structure

\`\`\`
maffix-web/
├── apps/
│   └── web/              # Next.js application
│       ├── src/
│       │   ├── app/      # App Router pages and API routes
│       │   ├── components/
│       │   └── lib/
│       └── prisma/       # Database schema
├── docs/                 # Documentation
│   ├── architecture/
│   ├── deployment/
│   ├── development/
│   ├── testing/
│   └── refactoring-history/
└── packages/             # Shared packages
\`\`\`

## 🤝 Contributing

This is an MVP project. For development guidelines, see the [documentation](docs/README.md).

---

**Built with ❤️ for independent musicians and their fans**
