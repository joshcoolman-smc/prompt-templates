# Next.js Development Guidelines

## Overview

This repository contains comprehensive development guidelines for building Next.js applications with TypeScript, Tailwind CSS v4, and Supabase. These guidelines are designed to work seamlessly with AI-assisted development using Test-Driven Development and production-build validation workflows.

## 🤖 AI Development Approach

### Core Philosophy
- **Test-Driven Development First** - Always write tests before implementation
- **Production Build as Completion Gate** - Features aren't done until `npm run build` succeeds
- **Repository-Service-Hooks Architecture** - Consistent architectural patterns
- **GitHub Issues Integration** - CLI-driven project management
- **Vercel Preview Deployments** - Every branch gets automatic deployment

## 📚 Guidelines Structure

### **Architecture & Patterns**
- [`nextjs-architecture.md`](ai-instructions/architecture/nextjs-architecture.md) - Project structure, feature modules, and architectural patterns
- [`component-development.md`](ai-instructions/architecture/component-development.md) - React component patterns, UI development, and Tailwind integration
- [`authentication-guide.md`](ai-instructions/architecture/authentication-guide.md) - Complete Supabase authentication implementation

### **Development Workflow**
- [`ai-feature-development.md`](ai-instructions/core-workflow/ai-feature-development.md) - **🎯 START HERE** - Complete step-by-step AI workflow
- [`testing-strategy.md`](ai-instructions/core-workflow/testing-strategy.md) - TDD-first testing approaches and comprehensive test patterns
- [`development-workflow.md`](ai-instructions/core-workflow/development-workflow.md) - Git workflow, code review, and quality standards

### **Operations & Deployment**
- [`vercel-deployment.md`](ai-instructions/operations/vercel-deployment.md) - CI/CD, preview deployments, and production workflows
- [`github-issues-guide.md`](ai-instructions/operations/github-issues-guide.md) - CLI-based issue management and project tracking

## 🚀 Quick Start for AI

When starting any new feature, follow this sequence:

### 1. **Read the AI Workflow**
Start with [`ai-feature-development.md`](ai-instructions/core-workflow/ai-feature-development.md) for the complete step-by-step process.

### 2. **Create GitHub Issue**
```bash
gh issue create --title "[FEATURE] Feature description" --label "feature"
```

### 3. **Follow TDD Cycle**
```bash
# 1. Create feature branch
git checkout -b "feature/descriptive-name"

# 2. Set up feature structure
mkdir -p src/features/[feature-name]/{components,hooks,repository,service,types}
mkdir -p __tests__/features/[feature-name]

# 3. Write tests FIRST (they should fail)
npm test -- --testPathPattern=[feature-name]

# 4. Implement to make tests pass
# 5. Validate continuously
npm run lint:fix && npm run type-check && npm test
```

### 4. **Mandatory Completion Validation**
```bash
# CRITICAL: All must pass before PR
npm run lint:fix     # Fix linting issues
npm run type-check   # No TypeScript errors
npm test            # All tests pass
npm run build       # Production build succeeds
```

### 5. **Create PR with Preview**
```bash
gh pr create --title "feat(scope): description"
# Vercel automatically creates preview deployment
```

## 🏗️ Architecture Overview

### Feature Module Pattern
Every feature follows the Repository-Service-Hooks structure:

```
src/features/[feature-name]/
├── components/     # UI components
├── hooks/          # React state management
├── repository/     # Data access layer
├── service/        # Business logic
├── types/          # TypeScript definitions
└── utils/          # Helper functions
```

### Technology Stack
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Testing**: Jest + Testing Library + Playwright
- **Deployment**: Vercel with preview deployments

## ⚡ Critical Rules for AI

### 🚨 Non-Negotiable Requirements

1. **Write Tests First** - Every feature starts with failing tests
2. **Production Build Gate** - If `npm run build` fails, the feature is not complete
3. **Follow Architecture** - Use Repository-Service-Hooks pattern consistently
4. **Document Changes** - Update relevant README files and documentation
5. **Validate Continuously** - Run linting and type checking throughout development

### 🎯 Success Criteria

A feature is only complete when:
- [ ] Tests written first using TDD approach
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] **Production build succeeds** (`npm run build`)
- [ ] Preview deployment works correctly
- [ ] Documentation updated

## 🔍 Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production (CRITICAL validation)
npm run lint:fix     # Fix linting issues
npm run type-check   # Verify TypeScript
npm test            # Run test suite
```

### GitHub Integration
```bash
gh issue create     # Create new issue
gh issue list       # List open issues
gh pr create        # Create pull request
gh issue develop 42 # Create branch from issue
```

### Testing
```bash
npm test -- --watch                    # Watch mode for active development
npm test -- --testPathPattern=feature  # Run specific feature tests
npm test -- --coverage                 # Generate coverage report
```

## 📖 Detailed Workflows

### For New Features
1. Read [`ai-feature-development.md`](ai-instructions/core-workflow/ai-feature-development.md) for complete workflow
2. Reference [`nextjs-architecture.md`](ai-instructions/architecture/nextjs-architecture.md) for structure patterns
3. Use [`component-development.md`](ai-instructions/architecture/component-development.md) for UI implementation
4. Follow [`testing-strategy.md`](ai-instructions/core-workflow/testing-strategy.md) for TDD approach

### For Authentication
- Use [`authentication-guide.md`](ai-instructions/architecture/authentication-guide.md) for complete Supabase integration

### For Deployment Issues
- Reference [`vercel-deployment.md`](ai-instructions/operations/vercel-deployment.md) for troubleshooting

### For Project Management
- Use [`github-issues-guide.md`](ai-instructions/operations/github-issues-guide.md) for CLI-based issue management

## 🎓 Reference Materials

Additional resources are available in the [`ai-instructions/reference/`](ai-instructions/reference/) directory:
- [`modernist-design.md`](ai-instructions/reference/modernist-design.md) - Swiss modernist-inspired design system guidelines
- [`typography.md`](ai-instructions/reference/typography.md) - Typography showcase and 4pt grid system
- Technology-specific reference guides and patterns

## 🎯 Feature Examples

The [`feature-examples/`](feature-examples/) directory contains complete feature specifications that demonstrate the development workflow:
- [`apple-reminders.md`](feature-examples/apple-reminders.md) - Comprehensive reminders app with Supabase
- [`ideas-app.md`](feature-examples/ideas-app.md) - AI-powered idea capture and organization system
- [`inventory-management.md`](feature-examples/inventory-management.md) - E-commerce inventory dashboard
- [`kanban.md`](feature-examples/kanban.md) - Project management board for small teams
- [`homepage.md`](feature-examples/homepage.md) - Premium homepage design project
- [`slide-presentation.md`](feature-examples/slide-presentation.md) - Markdown-to-presentation converter

These examples follow the Repository-Service-Hooks architecture and Next.js development patterns outlined in this guide.

## 💡 Key Principles

### Test-Driven Development
- Write failing tests first to define success criteria
- Implement minimal code to make tests pass
- Refactor while keeping tests green
- Use tests as living documentation

### Production-First Mindset
- Local production builds must succeed before any PR
- If it doesn't build locally, it won't build on Vercel
- Address build issues immediately, not later
- Preview deployments validate real-world functionality

### Consistent Architecture
- Every feature follows the same structural patterns
- Repository layer handles data access
- Service layer contains business logic
- Hook layer manages React state
- Component layer focuses on UI presentation

This approach ensures reliable, maintainable, and scalable Next.js applications with comprehensive AI collaboration support.