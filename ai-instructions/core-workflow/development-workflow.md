# Development Workflow Guidelines

## Overview

This document outlines the development processes, documentation standards, and quality assurance practices for Next.js TypeScript projects, ensuring consistency and maintainability across the development lifecycle.

## Project Documentation Standards

### Root README.md Requirements

Every project must maintain an up-to-date README.md with the following structure:

```markdown
# Project Name

## Overview
A concise description of what the application does and its purpose.

## Core Features
- Feature 1: Brief description
- Feature 2: Brief description
- Feature 3: Brief description

## Tech Stack
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (Authentication & Database)
- [Other major libraries]

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation
\`\`\`bash
git clone [repository-url]
cd [project-name]
pnpm install
\`\`\`

### Environment Setup
\`\`\`bash
cp .env.example .env.local
# Configure your environment variables
\`\`\`

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

### Development
\`\`\`bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linting
pnpm type-check   # Run TypeScript checks
pnpm test         # Run tests
\`\`\`

## Project Structure
Brief overview of the codebase organization following the feature module pattern.

## Deployment
Instructions for deploying to your hosting platform (Vercel, Netlify, etc.).

## Contributing
Guidelines for contributing to the project.
```

### Feature Documentation Standards

Each feature module should include a README.md that documents:

```markdown
# Feature Name

## Purpose
Explains what problem this feature solves and its importance to the application.

## Functionality
Describes what this feature does from both user and technical perspectives.

## Architecture
Explains the structure of this feature:
- Repository layer: Data access and API interactions
- Service layer: Business logic and data transformation
- Hook layer: React state management
- Component layer: UI presentation

## Key Components
- `ComponentA`: Handles XYZ functionality
- `ComponentB`: Manages ABC state
- `ServiceA`: Provides data processing for DEF

## API Endpoints
- `GET /api/feature/endpoint`: Description
- `POST /api/feature/endpoint`: Description

## Testing
- Unit tests: Location and coverage
- Integration tests: Key scenarios tested
- E2E tests: User workflows covered

## Known Limitations
- Current limitations or technical debt
- Planned improvements

## Related Features
- Dependencies on other features
- Integration points
```

## Git Workflow

### Branch Naming Conventions

```bash
# Feature branches
feature/user-authentication
feature/dashboard-analytics

# Bug fixes
fix/login-validation-error
fix/dashboard-loading-state

# Hotfixes
hotfix/security-patch
hotfix/critical-bug

# Chores/maintenance
chore/update-dependencies
chore/cleanup-unused-code
```

### Commit Message Format

Use conventional commits for consistent history:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add password reset functionality
fix(dashboard): resolve user data loading issue
docs(readme): update installation instructions
refactor(utils): simplify date formatting functions
test(auth): add login form validation tests
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Development and Testing**
   - Start with Test-Driven Development (write tests first)
   - Implement feature following architecture guidelines
   - Update documentation throughout development
   - Run linting and type checking continuously

3. **Feature Completion Checklist**

   **⚠️ CRITICAL RULE: A feature is NOT complete until ALL of these pass:**

   ### ✅ Development Phase
   - [ ] Tests written first using TDD approach
   - [ ] All tests pass locally (`npm test`)
   - [ ] Code follows Repository-Service-Hooks architecture
   - [ ] Linting passes throughout development (`npm run lint`)

   ### ✅ Pre-Commit Phase (MANDATORY)
   - [ ] **🚨 Production build succeeds locally** (`npm run build`)
   - [ ] No TypeScript errors (`npm run type-check`)
   - [ ] Final lint check passes (`npm run lint:fix`)
   - [ ] All tests still pass after final changes (`npm test`)
   - [ ] Manual testing completed in development mode

   ### ✅ Ready for PR
   - [ ] Feature branch is clean and up to date
   - [ ] **Production build verified successful** (critical for Vercel deployment)
   - [ ] Documentation updated (README, feature docs)
   - [ ] No console errors or warnings

   **🔥 CRITICAL: If `npm run build` fails locally, it WILL fail on Vercel. Fix all build issues before creating PR.**

4. **Create Pull Request**
   - Use descriptive title and clear description
   - Reference related issues
   - Include screenshots for UI changes
   - Add testing instructions

5. **Code Review Requirements**
   - At least one approval required
   - All automated checks must pass
   - Address all review feedback

## Code Review Guidelines

### Review Criteria Checklist

#### **Code Quality & Style**
- [ ] **Readability**: Code is clear and easy to understand
- [ ] **Naming**: Variables, functions, and components are well-named
- [ ] **Organization**: Code is logically structured following feature module pattern
- [ ] **Consistency**: Follows established project patterns and conventions
- [ ] **Comments**: Complex logic is properly documented

#### **TypeScript & React Best Practices**
- [ ] **Component Design**: Components are focused and single-purpose
- [ ] **Hooks Usage**: React hooks are used correctly and efficiently
- [ ] **Props & Types**: All props properly typed with interfaces
- [ ] **State Management**: State is handled appropriately (local vs global)
- [ ] **Performance**: Unnecessary re-renders are avoided with proper memoization

#### **Architecture Compliance**
- [ ] **Feature Module Pattern**: Follows Repository-Service-Hooks architecture
- [ ] **Separation of Concerns**: Clear boundaries between data, business logic, and UI
- [ ] **Import Organization**: Consistent import structure and path aliases
- [ ] **Error Handling**: Proper error boundaries and user feedback

#### **Security & Performance**
- [ ] **Input Validation**: User input is properly validated and sanitized
- [ ] **API Security**: API calls are secure and authenticated
- [ ] **Performance**: No performance red flags (large bundles, blocking operations)
- [ ] **Accessibility**: Components follow a11y best practices

#### **Testing & Documentation**
- [ ] **Test Coverage**: New functionality is properly tested
- [ ] **Documentation**: README files and code comments are updated
- [ ] **Error Scenarios**: Edge cases and error conditions are handled

### Review Process

**For Reviewers:**
1. Check out the branch locally for complex changes
2. Test the functionality in development environment
3. Provide specific, actionable feedback
4. Suggest improvements rather than just pointing out problems
5. Approve only when all criteria are met

**For Authors:**
1. Respond to all review comments
2. Make requested changes or provide justification
3. Update tests if implementation changes
4. Re-request review after addressing feedback

## Production Build Debugging

### Build Failure Troubleshooting

When `npm run build` fails, follow this systematic debugging approach:

#### 1. Common Build Issues

**TypeScript Errors:**
```bash
# Check for type errors first
npm run type-check

# Common fixes:
# - Add missing type declarations
# - Fix import/export issues
# - Resolve any/unknown type issues
```

**Import/Export Errors:**
```bash
# Check for circular dependencies
npm run build 2>&1 | grep -i "circular"

# Common fixes:
# - Fix circular imports between modules
# - Ensure proper barrel exports
# - Check default vs named export consistency
```

**Environment Variable Issues:**
```bash
# Verify all required env vars are defined
# Check .env.example vs .env.local

# Common fixes:
# - Add missing NEXT_PUBLIC_ prefix for client-side vars
# - Ensure all required variables are documented
```

#### 2. Build Debugging Commands

```bash
# Verbose build output
npm run build -- --debug

# Build with bundle analysis
npm run build:analyze

# Clear Next.js cache if build seems stuck
rm -rf .next
npm run build

# Check for large bundle issues
npm run build && npx bundlephobia
```

#### 3. Systematic Fix Approach

1. **Clear Cache and Reinstall**
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Isolate the Issue**
   ```bash
   # Test type checking separately
   npm run type-check
   
   # Test linting separately
   npm run lint
   
   # Test individual page builds by temporarily removing routes
   ```

3. **Check Recent Changes**
   ```bash
   # See what changed since last successful build
   git diff HEAD~1
   
   # Test build on previous commit
   git stash
   npm run build
   git stash pop
   ```

#### 4. AI Debugging Pattern

When AI encounters build failures:

1. **Read the error message carefully** - Next.js provides detailed error info
2. **Fix one error at a time** - Don't try to fix multiple issues simultaneously
3. **Test after each fix** - Run `npm run build` after each change
4. **Keep trying until success** - Build must pass before feature is complete

### Build Success Validation

```bash
# Full validation sequence
npm run lint:fix
npm run type-check
npm test
npm run build

# All commands must exit with code 0
echo "Build validation complete - ready for PR"
```

## Quality Assurance

### Automated Checks

Configure these checks to run on every PR:

```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "next build",
    "build:analyze": "ANALYZE=true next build"
  }
}
```

### Pre-commit Hooks

Set up Husky for automated quality checks:

```json
{
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  }
}
```

```json
// .lintstagedrc.json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run linting
        run: pnpm lint
      
      - name: Run type checking
        run: pnpm type-check
      
      - name: Run tests
        run: pnpm test --coverage
      
      - name: Build application
        run: pnpm build
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## Development Environment Setup

### Required Tools

```bash
# Node.js version management
nvm install 18
nvm use 18

# Package manager
npm install -g pnpm

# Development tools
pnpm add -D eslint prettier typescript @types/node
```

### VS Code Configuration

Recommended extensions:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- TypeScript Importer
- Tailwind CSS IntelliSense
- GitLens

Workspace settings:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Environment Variables Management

```bash
# .env.example (commit to repository)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# .env.local (local development, not committed)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_KEY=your-service-key-for-admin-operations
```

## Error Handling Standards

### Error Reporting

Implement consistent error logging:

```typescript
// lib/error-reporting.ts
export function reportError(error: Error, context?: Record<string, any>) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    console.error('Context:', context);
  }
  
  // Report to external service in production
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (Sentry, LogRocket, etc.)
  }
}
```

### User-Facing Error Messages

```typescript
// lib/error-messages.ts
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  UNAUTHORIZED: 'You need to be logged in to access this feature.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
} as const;
```

## Performance Monitoring

### Core Web Vitals

Monitor and optimize for:
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Bundle Analysis

Regular bundle size monitoring:

```bash
# Analyze bundle size
pnpm build:analyze

# Check for large dependencies
npx bundlephobia <package-name>
```

### Performance Budget

Set performance budgets in `next.config.js`:

```javascript
module.exports = {
  experimental: {
    bundlePagesRouterDependencies: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.commons.maxSize = 244000;
    }
    return config;
  },
};
```

## Release Process

### Versioning Strategy

Use semantic versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Checklist

Pre-release:
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Performance regression testing completed

Release:
- [ ] Create release tag
- [ ] Deploy to staging environment
- [ ] Run automated tests on staging
- [ ] Deploy to production
- [ ] Monitor for errors post-deployment

Post-release:
- [ ] Verify deployment successful
- [ ] Check error reporting for issues
- [ ] Monitor performance metrics
- [ ] Update team on release status

## Team Communication

### Documentation Updates

All code changes must include corresponding documentation updates:
- README files for feature changes
- API documentation for endpoint changes
- Architecture documents for structural changes

### Knowledge Sharing

Regular practices:
- Code review discussions for learning
- Architecture decision records (ADRs)
- Team retrospectives after major features
- Documentation of lessons learned

This workflow ensures consistent, high-quality development practices across the entire project lifecycle.