# Website Building Blocks

A phased approach to building a complete React website interactively with AI assistance.

## Introduction

This repository contains a collection of templates and guides designed for AI-assisted interactive website building. Starting with a base Vite React + TypeScript + Tailwind setup, these templates guide you through creating a professional website with continuous human feedback at each stage.

## How It Works

1. **You create** a standard Vite React app with TypeScript and Tailwind CSS
2. **AI examines** these templates to understand the building process
3. **You interact** through a series of questions about your requirements
4. **AI implements** each component based on your answers
5. **You review** and approve before moving to the next stage
6. **The process continues** until your complete website is built

## Getting Started

See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed instructions on setting up your environment and beginning the interactive building process.

## Phase Overview

### Phase 1: Project Structure & Navigation
Establishes folder organization and creates a responsive navigation component with dropdowns.

### Phase 2: Design System
Creates your color palette, typography settings, and spacing rules to ensure visual consistency.

### Phase 3: Core Components
Builds essential UI components like headers, cards, buttons and forms that will be used throughout the site.

### Phase 4: Page Templates
Combines the core components to create complete, functional page layouts like home, about, services, etc.

## Key Features

- **Interactive Approach**: Human-in-the-loop workflow ensures the website meets your exact requirements
- **Checkpoint System**: Clear approval gates between phases give you complete control
- **Domain-Based Architecture**: Organized by feature for easier understanding and maintenance
- **Progressive Implementation**: Builds systematically from foundation to complete pages
- **Responsive Design**: Mobile-first approach throughout all components
- **TypeScript Integration**: Includes proper typing for all components
- **Accessibility Focus**: ARIA attributes and keyboard navigation included

## Interactive Building Workflow

The [interactive-workflow.md](./interactive-workflow.md) document outlines the specific questions and approval steps for each phase of the website building process.

## Project Structure

The recommended structure for your project:

```
src/
├── features/           # Domain-specific features
│   ├── home/           # Home page feature
│   ├── about/          # About feature
│   └── [other-features]/
├── components/         # Shared components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── styles/             # Global styles and theme
├── utils/              # Helper functions
└── types/              # TypeScript type definitions
```

## License

This collection of templates is provided under the MIT License. You are free to use, modify, and distribute them for personal or commercial projects.