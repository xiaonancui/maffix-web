# 🚀 Vercel Deployment Guide

This guide explains how to deploy the Maffix Web application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Code should be pushed to GitHub
3. **Database**: PostgreSQL database (Supabase recommended)

## 🔧 Environment Variables

Configure these environment variables in your Vercel project settings:

### Required Variables
```
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=your_postgresql_connection_string
```

### Optional OAuth Variables
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

## 🚀 Deployment Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `xiaonancui/maffix-web`

2. **Configure Project**
   - Framework Preset: **Next.js**
   - Root Directory: **Leave empty** (monorepo auto-detected)
   - Build Command: `cd apps/web && npm run build`
   - Output Directory: `apps/web/.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set up environment variables
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails with Font Errors**
   - ✅ Fixed: Removed Google Fonts import that was causing network issues

2. **Database Connection Errors**
   - ✅ Fixed: Added dynamic imports and build-time checks
   - Ensure `DATABASE_URL` is set in Vercel environment variables

3. **TypeScript Errors**
   - ✅ Fixed: All TypeScript errors resolved
   - Build includes type checking

4. **API Routes Timeout**
   - ✅ Fixed: Added 30-second timeout configuration for API routes

### Build Configuration

The project uses these key files for Vercel deployment:

- `vercel.json`: Deployment configuration
- `.vercelignore`: Files to exclude from deployment
- `apps/web/next.config.js`: Next.js configuration
- `apps/web/package.json`: Build scripts and dependencies

### Monorepo Structure

```
maffix-web/
├── apps/
│   └── web/          # Next.js application (deployed)
├── packages/         # Shared packages (not deployed)
├── docs/            # Documentation (not deployed)
└── vercel.json      # Deployment configuration
```

## 📊 Deployment Status

- ✅ **Build Process**: Fixed and tested locally
- ✅ **TypeScript**: All errors resolved
- ✅ **Database**: Dynamic imports implemented
- ✅ **Fonts**: Removed problematic Google Fonts
- ✅ **Configuration**: Optimized for Vercel

## 🎯 Next Steps After Deployment

1. **Test the Application**
   - Visit your Vercel URL
   - Test login with test accounts
   - Verify all pages load correctly

2. **Set Up Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain

3. **Monitor Performance**
   - Use Vercel Analytics
   - Check function logs for any issues

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
