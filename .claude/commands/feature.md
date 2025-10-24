---
description: Request a new feature following clean architecture patterns
---

I need you to implement a new feature: $ARGUMENTS

## Architecture Requirements

Use clean architecture with the feature module pattern:

**Feature Module Structure**
- Create in `features/[feature-name]/`
- Include: components/, repositories/, services/, hooks/, types/
- Keep all related code co-located in this single directory

**Three-Layer Pattern**

Repository Layer (Data Access):
- Define interface for data operations
- Implement concrete class
- Handle API calls, database queries, external data sources
- NO business logic here

Service Layer (Business Logic):
- Define interface for business capabilities
- Implement business rules and workflows
- Coordinate multiple repositories if needed
- NO UI framework code here
- Only add if there's logic beyond simple CRUD

Hooks Layer (React Integration):
- Custom hooks that call services
- Manage loading, error, and data state
- Handle React lifecycle and effects
- Services injected as parameters

**Component Pattern**

Page Component (Server Component):
- Keep in app/ directory
- NEVER add 'use client' to page.tsx
- Handle auth, data fetching, redirects
- Pass data to display component

Display Component (Client Component):
- Mark with 'use client'
- Receive data as props
- Handle interactivity and local state
- Event handlers and user interactions

**TypeScript & Validation**

- Define all types in feature's types/ directory
- Use Zod schemas for validation at boundaries (API responses, form inputs)
- Create specific error types for domain errors
- Use discriminated unions for state (loading | success | error)

**Dependency Injection**

- Use service container to wire dependencies
- Repositories and services injected via constructor
- Hooks receive services as parameters
- Makes testing easier

## Before You Start

Ask me clarifying questions about:
- Business requirements and edge cases
- Data that needs to be persisted
- Integration with existing features
- User workflows and interactions

## Implementation Steps

1. Define types and interfaces first
2. Create repository interface + implementation (if data access needed)
3. Create service interface + implementation (if business logic beyond CRUD)
4. Create custom hooks for React integration
5. Build page component (server) and display component (client)
6. Add tests for each layer

## Key Principles

- Organize by feature, not by technical file type
- Use interfaces to define contracts
- Dependencies flow inward (UI → Hooks → Services → Repositories)
- Keep pages as server components
- Add complexity only when needed
- Test each layer independently

Start by confirming you understand the feature, then ask your questions before implementing.
