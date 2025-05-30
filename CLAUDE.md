# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a collection of AI prompt templates for building React/TypeScript web applications. The repository serves as a comprehensive guide system for AI assistants to help developers build modern websites and applications using established patterns and methodologies.

## Key Architecture Patterns

### Repository-Service-Hooks Pattern
- **Repository Layer**: Data access and API interactions
- **Service Layer**: Business logic and data transformation  
- **Hooks Layer**: React state management and component integration
- Organize by feature domain, not technical file types

### Interactive Building Methodology
The flagship approach uses human-in-the-loop development:
1. AI examines templates and asks specific questions about user preferences
2. AI implements components based on approved answers
3. Human reviews and approves before proceeding to next phase
4. Process continues systematically through all development phases

## Primary Workflows

### Website Building Blocks (`/website-building-blocks/`)
Use this for complete website projects following the phased approach:
- **Phase 1**: Foundation (Vite React setup, project structure)
- **Phase 2**: Design System (colors, typography, spacing)
- **Phase 3**: Core Components (UI elements, forms, navigation)
- **Phase 4**: Page Templates (complete pages and layouts)

Always follow the interactive workflow defined in `interactive-workflow.md` and use the controller pattern from `interactive-controller.md`.

### Next.js Projects (`/next-js/`)
For Next.js 13+ applications, reference:
- `nextjs-feature-module.md` for feature organization
- `nextjs-supabase-auth.md` for authentication setups
- Framework-specific patterns using App Router and Server Actions

### Development Guidelines (`/dev-guidelines/`)
Core coding standards and architecture patterns:
- `feature-guidelines-react-ts.md`: Complete feature module structure
- `react-component-guide.md`: Component development patterns
- `next-typescript-guidelines.md`: Next.js specific guidelines

## Technology Stack Standards

### Required Technologies
- **React**: 18/19 with TypeScript
- **Styling**: Tailwind CSS with systematic design tokens
- **Validation**: Zod for type-safe data validation
- **Build Tools**: Vite (preferred) or Next.js 13+

### Code Quality
- Use ESLint and Prettier configurations when available
- Implement proper TypeScript typing throughout
- Follow component composition patterns
- Use custom hooks for state management logic

## Design System Principles

Reference `modernist-design-guidelines.md` for:
- Swiss modernist-inspired design approach
- Systematic color palettes and typography scales
- Grid-based layouts and consistent spacing
- Accessibility-first component design

## Important Development Notes

### Always Ask Before Proceeding
When using the interactive building approach, always:
- Ask specific questions about user preferences
- Wait for approval before implementing each phase
- Confirm design decisions and technical choices
- Get feedback on component implementations

### Feature Organization
Structure new features using the Repository-Service-Hooks pattern:
```
src/
  features/
    feature-name/
      components/
      hooks/
      services/
      repositories/
      types/
```

### Component Development
- Create reusable, composable components
- Use TypeScript interfaces for all props
- Implement proper error boundaries and loading states
- Follow the design system tokens consistently

## Testing and Quality Assurance

When available, run quality checks:
- Type checking: Look for `tsc --noEmit` or similar commands
- Linting: Check for ESLint configuration and run linting
- Testing: Use the testing framework already established in the project

Always verify implementations work correctly before marking tasks complete.