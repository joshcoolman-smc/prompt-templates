# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains prompt templates for building a React website in a phased approach. It is structured as a collection of markdown files that outline steps to create various components and features for a React website, starting from the foundation and progressing through design system setup, core component implementation, and page templates.

## Development Commands

```bash
# Initialize a new Vite project with React and TypeScript
npm create vite@latest my-website -- --template react-ts

# Install core dependencies
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint prettier
npm install -D eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-prettier eslint-config-prettier
npm install -D vite-tsconfig-paths

# Configure Tailwind CSS
npx tailwindcss init -p

# Development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Linting
npm run lint

# Format code
npm run format
```

## Project Structure

The website components follow this organization pattern:

```
src/
├── assets/              # Images, fonts, static files
├── components/
│   ├── ui/              # Base UI components
│   └── [feature]/       # Feature-specific components
├── hooks/               # Custom React hooks
├── layouts/             # Page layout templates
├── pages/               # Route-based page components
├── styles/              # Global styles and theme
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## Architecture Guidelines

1. **Component Composition**: Build complex components from simpler ones following the component composition pattern.

2. **Design System**: Use the established color palette, typography system, and spacing rules from phase-2-design-system consistently across all components.

3. **TypeScript**: Use proper typing for all components and functions. Ensure props have appropriate interfaces or types.

4. **Responsive Design**: All components should be responsive and work well on mobile, tablet, and desktop viewports.

5. **Accessibility**: Follow accessibility best practices by including proper ARIA attributes and ensuring keyboard navigation works correctly.

6. **Component Dependencies**: 
   - Header and Footer components depend on Button component and Color System
   - Card components depend on Typography, Colors, and Spacing
   - Page templates depend on Header, Footer, and other core components

## Implementation Strategy

When implementing features from the prompt templates:

1. Start with understanding the component requirements
2. Create the necessary files and type definitions
3. Implement base functionality before adding more complex features
4. Test the component at different viewport sizes
5. Verify accessibility compliance
6. Document usage examples

## Color System

The color system includes:
- Primary brand color with 9 shades (50-900)
- Secondary color with 9 shades
- 1-2 accent colors with appropriate shades
- Grayscale range (50-900)
- Semantic colors (success, warning, error, info)

Colors are implemented in the Tailwind CSS configuration.

## Core Components

Key components include:
- Header with mobile and desktop navigation
- Card component system with multiple variants
- Button system
- Form elements
- Modal system

Each component should follow the established patterns and be composed of smaller, reusable parts.