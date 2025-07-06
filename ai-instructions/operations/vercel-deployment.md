# Vercel Deployment Guide

## Overview

This guide covers deployment workflows for Next.js applications using Vercel, including CI/CD automation, preview deployments, and environment management.

## Why Vercel for Next.js

### Key Benefits
- **Automatic CI/CD** - Deploy on every push to any branch
- **Preview Deployments** - Every branch gets its own URL for testing
- **Zero Configuration** - Works out of the box with Next.js
- **Edge Network** - Global CDN for optimal performance
- **Built-in Analytics** - Core Web Vitals monitoring

## Initial Setup

### 1. Vercel CLI Installation

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Link project to Vercel (run in project root)
vercel link
```

### 2. Project Configuration

```bash
# Initialize Vercel configuration
vercel

# Follow prompts:
# - Set up and deploy? [Y]
# - Which scope? [Your account/team]
# - Link to existing project? [N] (for new projects)
# - Project name? [your-project-name]
# - Directory? [./]
```

This creates a `.vercel` folder with project configuration.

### 3. Environment Variables Setup

```bash
# Add environment variables via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY

# Or add via Vercel dashboard:
# https://vercel.com/[username]/[project]/settings/environment-variables
```

## Deployment Workflows

### Automatic Branch Deployments

Every push to any branch automatically triggers a deployment:

```bash
# Create feature branch
git checkout -b feature/user-dashboard

# Make changes and commit
git add .
git commit -m "feat(dashboard): add user profile section"

# Push to trigger preview deployment
git push origin feature/user-dashboard

# Vercel automatically:
# 1. Detects the push
# 2. Runs build process
# 3. Creates preview URL
# 4. Comments on PR with deployment URL
```

### Production Deployments

```bash
# Deploy to production (main branch)
git checkout main
git merge feature/user-dashboard
git push origin main

# Vercel automatically:
# 1. Builds production version
# 2. Runs all checks
# 3. Deploys to production domain
# 4. Invalidates CDN cache
```

### Manual Deployments

```bash
# Deploy current directory to preview
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
vercel --target production
```

## Environment Management

### Environment Types

**Development** - Local `.env.local`
**Preview** - Feature branch deployments
**Production** - Main branch deployments

### Setting Environment Variables

#### Via CLI
```bash
# Add to all environments
vercel env add NEXT_PUBLIC_SITE_URL

# Add to specific environment
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview

# List all environment variables
vercel env ls

# Remove environment variable
vercel env rm NEXT_PUBLIC_SITE_URL
```

#### Via Dashboard
1. Go to project settings: `https://vercel.com/[username]/[project]/settings/environment-variables`
2. Add variables for each environment
3. Specify which environments each variable applies to

### Environment Variable Best Practices

```bash
# .env.example (commit to repo)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
SUPABASE_SERVICE_KEY=your_service_key_for_admin_operations

# .env.local (local development only, not committed)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_KEY=your-actual-service-key
```

## Preview Deployment Workflow

### Feature Development with Previews

```bash
# 1. Start feature development
git checkout -b feature/dark-mode
gh issue create --title "[FEATURE] Add dark mode toggle"

# 2. Develop with TDD
# Write tests first, implement feature

# 3. Push for preview deployment
git push origin feature/dark-mode

# 4. Vercel automatically creates preview URL
# Example: https://your-app-git-feature-dark-mode-username.vercel.app

# 5. Test on preview deployment
# - Verify feature works in production environment
# - Test with real data and external services
# - Check performance and Core Web Vitals

# 6. Share preview URL for review
# Add to PR description or GitHub issue
```

### PR Integration

Vercel automatically comments on PRs with deployment information:

```markdown
✅ Deploy Preview ready!

🔍 Inspect: https://vercel.com/username/project/deployments/abc123
✅ Preview: https://your-app-git-feature-dark-mode-username.vercel.app

Built with commit abc123
```

### Testing on Preview Deployments

```bash
# Common testing steps for preview deployments:

# 1. Functional testing
curl -I https://your-app-git-feature-dark-mode-username.vercel.app

# 2. Performance testing
npx lighthouse https://your-app-git-feature-dark-mode-username.vercel.app

# 3. API endpoint testing
curl https://your-app-git-feature-dark-mode-username.vercel.app/api/health

# 4. Database connectivity (if applicable)
# Test that preview deployment can connect to preview database
```

## Build Configuration

### Vercel Configuration File

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  }
}
```

### Build Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for Vercel
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer'))({
          enabled: true,
        })
      );
      return config;
    },
  }),
};

module.exports = nextConfig;
```

## Database and External Services

### Supabase Integration

```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_KEY=your-prod-service-key

# Preview environment variables (optional separate project)
NEXT_PUBLIC_SUPABASE_URL=https://your-preview-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-preview-anon-key
SUPABASE_SERVICE_KEY=your-preview-service-key
```

### Database Migration Strategy

```bash
# Option 1: Shared database for preview and production
# - Use Row Level Security (RLS) to isolate data
# - Add environment-specific prefixes to test data

# Option 2: Separate preview database
# - Create separate Supabase project for previews
# - Use database migrations for schema sync
# - Reset preview database periodically
```

## Monitoring and Analytics

### Vercel Analytics Integration

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Performance Monitoring

```bash
# Check Core Web Vitals for deployment
npx lighthouse https://your-app.vercel.app --view

# Monitor deployment status
vercel inspect https://your-app.vercel.app

# View deployment logs
vercel logs https://your-app.vercel.app
```

## Troubleshooting Deployments

### Common Deployment Issues

#### 1. Build Failures

```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Import/export issues
# - Large bundle size

# Debug locally first
npm run build
```

#### 2. Environment Variable Issues

```bash
# Verify variables are set correctly
vercel env ls

# Check if client-side variables have NEXT_PUBLIC_ prefix
# Server-side variables should NOT have this prefix
```

#### 3. Function Timeout Issues

```json
// vercel.json - Increase function timeout
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

#### 4. Large Bundle Size

```bash
# Analyze bundle size
npm run build:analyze

# Common fixes:
# - Code splitting with dynamic imports
# - Tree shaking unused code
# - Optimizing images and assets
```

### Debugging Commands

```bash
# View recent deployments
vercel ls

# Get deployment details
vercel inspect [deployment-url]

# View logs for specific deployment
vercel logs [deployment-url]

# Download deployment files
vercel download [deployment-url]

# Test deployment locally
vercel dev
```

## Advanced Vercel Features

### Edge Functions

```typescript
// app/api/edge-example/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({
      message: 'Hello from Edge Function',
      timestamp: new Date().toISOString(),
      region: process.env.VERCEL_REGION,
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
```

### Custom Domains

```bash
# Add custom domain via CLI
vercel domains add yourdomain.com

# Or via dashboard:
# Project Settings → Domains → Add Domain
```

### Deployment Protection

```json
// vercel.json - Password protect preview deployments
{
  "deploymentProtection": {
    "preview": {
      "password": "your-preview-password"
    }
  }
}
```

## CI/CD Best Practices

### Automated Quality Checks

```yaml
# .github/workflows/vercel.yml
name: Vercel Deployment
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run type check
        run: npm run type-check
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          scope: ${{ secrets.TEAM_ID }}
```

### Deployment Workflow Integration

1. **Feature Development**
   - Create feature branch
   - Develop with TDD approach
   - Push triggers preview deployment
   - Test on preview URL

2. **Code Review**
   - Create PR with preview deployment link
   - Review code and test functionality
   - Ensure production build succeeds locally

3. **Production Deployment**
   - Merge to main branch
   - Automatic production deployment
   - Monitor for errors and performance

This Vercel-focused deployment strategy provides reliable, automated deployments with comprehensive preview functionality for effective development workflows.