# TenTenTen Web

[![CI/CD Pipeline](https://github.com/xiaonancui/tententen-web/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/xiaonancui/tententen-web/actions/workflows/ci.yml)
[![Code Quality](https://github.com/xiaonancui/tententen-web/workflows/Code%20Quality%20Checks/badge.svg)](https://github.com/xiaonancui/tententen-web/actions/workflows/code-quality.yml)
[![Security Checks](https://github.com/xiaonancui/tententen-web/workflows/Security%20Checks/badge.svg)](https://github.com/xiaonancui/tententen-web/actions/workflows/security.yml)

An independent musician fan engagement platform that revolutionizes how artists
connect with audience through gamified experiences and meaningful
interactions.

## 🎵 Vision

TenTenTen Web empowers independent musicians to build stronger relationships
with their fans through an innovative platform that combines task-based
engagement, gamification elements, and reward systems. Our goal is to create a
sustainable ecosystem where artists can monetize their creativity while
providing fans with unique, interactive experiences.

## 🚀 MVP Goals

### Core Features

- **Task Submission System**: Fans complete artist-defined tasks to earn rewards
- **Gacha System**: Exciting randomized reward mechanism with collectible items
- **Diamond Economy**: Virtual currency system for platform transactions
- **Artist Dashboard**: Comprehensive tools for content and fan management
- **Fan Profiles**: Personalized spaces showcasing achievements and collections

### Key Objectives

- Enable artists to create and manage fan engagement tasks
- Implement secure payment processing for premium features
- Provide analytics and insights for artist growth
- Foster community building through interactive features
- Ensure scalable architecture for future expansion

## 🛠 Technology Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **Refine**: Admin panel and CRUD operations framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **NextAuth.js**: Authentication and session management

### Backend

- **NestJS**: Scalable Node.js framework
- **TypeScript**: End-to-end type safety
- **Prisma**: Database ORM and migrations
- **JWT**: Secure authentication tokens
- **Klarna**: Payment processing integration

### Database & Services

- **Supabase**: PostgreSQL database with real-time features
- **Vercel**: Frontend deployment and hosting
- **Railway**: Backend API deployment
- **GitHub**: Version control and CI/CD

## 📁 Project Structure

```
tententen-web/
├── frontend/          # Next.js + Refine application
├── backend/           # NestJS API server
├── ARCHITECTURE.md    # Detailed technical documentation
├── README.md         # This file
└── package.json      # Workspace configuration
```

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Git for version control
- Supabase account for database

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tententen-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy environment templates
   cp .env.example .env.local
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env.local
   ```

4. **Configure environment variables**
   - Update database connection strings
   - Add authentication secrets
   - Configure payment provider credentials
   - Set API endpoints

5. **Start development servers**

   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start individually
   npm run dev:frontend
   npm run dev:backend
   ```

### Environment Variables

Environment variables are loaded from specific locations:

- **Frontend**: Loads from `frontend/.env.local` (Next.js conventions)
- **Backend**: Loads from `backend/.env.local` (NestJS dotenv config)
- **Root**: `.env.local` is a template only and not read by either app unless
  explicitly configured

See the `.env.example` files in the root, frontend, and backend directories for
required environment variables. Key variables include:

- Database connection (Supabase)
- Authentication secrets (NextAuth.js)
- Payment integration (Klarna)
- API endpoints and CORS settings

## 🚀 Deployment

### Frontend (Vercel)

- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- Custom domain support

### Backend (Railway)

- Containerized deployment
- Environment variables managed in Railway
- Automatic SSL and scaling

### Database (Supabase)

- Managed PostgreSQL instance
- Real-time subscriptions
- Built-in authentication support

## 📚 Documentation

For detailed technical information, architecture decisions, and development
guidelines, see:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and technical
  details
- Frontend documentation (coming in subsequent phases)
- Backend API documentation (coming in subsequent phases)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Update documentation for new features

## 🔧 CI/CD & Code Quality

This project uses comprehensive GitHub Actions workflows to ensure code quality and security:

### Automated Checks

- **Code Quality**: ESLint, Prettier, TypeScript type checking
- **Security**: Dependency audits, vulnerability scanning, secret detection
- **Testing**: Automated test execution for frontend and backend
- **Build Verification**: Ensures all components build successfully

### Pre-commit Hooks

- Automatic code formatting with Prettier
- Linting with ESLint
- Type checking with TypeScript

### Branch Protection

- All changes require Pull Request reviews
- Status checks must pass before merging
- Automated dependency updates via Dependabot

For detailed information, see [GitHub Actions Documentation](docs/GITHUB_ACTIONS.md).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for
details.

## 🎯 Roadmap

- **Phase 1**: Project foundation and architecture setup
- **Phase 2**: Frontend application with Refine integration
- **Phase 3**: Backend API with authentication and database
- **Phase 4**: Payment integration and advanced features
- **Phase 5**: Testing, optimization, and deployment

---

Built with ❤️ for independent musicians and their fans.
