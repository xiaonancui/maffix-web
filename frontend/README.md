# TenTenTen Frontend

This is the frontend application for TenTenTen, a gamified task platform built with Next.js 14, Refine, and TypeScript.

## Features

- **Next.js 14** with App Router
- **Refine** for data-intensive admin interfaces
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Ant Design** for UI components
- **NextAuth.js** for authentication
- **Supabase** integration ready
- **ESLint & Prettier** for code quality

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Update the environment variables in `.env.local` with your actual values.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # User dashboard pages
│   ├── admin/          # Admin panel pages
│   ├── auth/           # Authentication pages
│   └── api/            # API routes
├── components/         # Reusable UI components
├── lib/               # Utility functions and configurations
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Environment Variables

See `.env.example` for all required environment variables.

## Authentication

The app supports multiple authentication methods:

- Email/Password
- Google OAuth
- GitHub OAuth
- Discord OAuth

## Admin Panel

Users with admin role can access the admin panel at `/admin` with features for:

- User management
- Task management
- Prize management
- Banner management
- System analytics

## Development

### Code Style

- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use Tailwind CSS for styling
- Follow the established component patterns

### Adding New Pages

1. Create page component in appropriate `app/` directory
2. Add route to navigation if needed
3. Update types if new data structures are introduced
4. Add proper error handling and loading states

## Deployment

The app is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is proprietary and confidential.
