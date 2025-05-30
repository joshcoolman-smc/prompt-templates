# Development Guidelines

## Core Architecture Principles

This project follows a **Visual-to-Code Mapping Architecture** that creates clear separation between business logic, UI components, and page routing. The architecture emphasizes maintainability, testability, and scalability.

## Directory Structure

```
├── features/                    # Business logic and domain-specific code
│   ├── [domain]/
│   │   ├── domain/             # Types, interfaces, business rules
│   │   ├── repositories/       # Data access layer
│   │   ├── services/           # Business logic layer
│   │   └── hooks/              # React hooks for state management
│   └── shared/
│       └── components/         # Shared UI components
├── app/                        # Next.js App Router pages and layouts
│   ├── [route]/
│   │   ├── components/         # Route-specific client components
│   │   └── page.tsx           # Server component (imports display component)
│   ├── components/            # App-level components
│   └── globals.css
└── dev-guidelines.md          # This file
```

## Display Component Pattern

### Core Principle
**Never use `'use client'` in page.tsx files.** Instead, create dedicated display components for client-side logic.

### Implementation
1. **Page Components (Server)**: `page.tsx` files remain server components
2. **Display Components (Client)**: Handle all client-side logic and UI rendering
3. **Clean Imports**: Pages simply import and render their display component

### Example Structure
```typescript
// app/example/page.tsx (Server Component)
import { ExampleDisplay } from "./components/ExampleDisplay"

export default function ExamplePage() {
  return <ExampleDisplay />
}

// app/example/components/ExampleDisplay.tsx (Client Component)
"use client"

export function ExampleDisplay() {
  // All client-side logic here
  return <div>...</div>
}
```

### Benefits
- **Server-First**: Leverages Next.js server components by default
- **Flexibility**: Easy to add client-side features without refactoring pages
- **Performance**: Clear server/client boundaries for optimal rendering
- **Maintainability**: Consistent pattern across all routes

## Feature Organization

### Domain-Driven Structure
Each feature follows a layered architecture:

```
features/[domain]/
├── domain/          # Pure business logic
│   └── Types.ts     # Interfaces, types, enums
├── repositories/    # Data access
│   └── Repository.ts
├── services/        # Business logic
│   └── Service.ts
└── hooks/          # React integration
    └── useFeature.ts
```

### Layer Responsibilities

#### Domain Layer
- **Purpose**: Define business entities, rules, and types
- **Dependencies**: None (pure TypeScript)
- **Example**: `TaskTypes.ts`, `UserTypes.ts`

#### Repository Layer
- **Purpose**: Data access and persistence
- **Dependencies**: Domain types only
- **Example**: API calls, local storage, database operations

#### Service Layer
- **Purpose**: Business logic and orchestration
- **Dependencies**: Domain types, repositories
- **Example**: Validation, data transformation, business rules

#### Hook Layer
- **Purpose**: React state management and UI integration
- **Dependencies**: Services, React
- **Example**: `useTasks()`, `useAuth()`

## Component Guidelines

### Naming Conventions
- **Pages**: `page.tsx` (Next.js convention)
- **Display Components**: `[Feature]Display.tsx`
- **UI Components**: `[ComponentName].tsx` (PascalCase)
- **Hooks**: `use[FeatureName].ts`
- **Types**: `[Domain]Types.ts`

### File Organization
- **Route-specific components**: `app/[route]/components/`
- **Shared components**: `features/shared/components/`
- **Business logic**: `features/[domain]/`

### Component Patterns

#### Display Components
```typescript
"use client"

import { useFeature } from "@/features/[domain]/hooks/useFeature"
import { Navigation } from "@/features/shared/components/Navigation"

export function FeatureDisplay() {
  const { data, loading, actions } = useFeature()
  
  return (
    <div>
      <Navigation />
      {/* Feature-specific UI */}
    </div>
  )
}
```

#### Custom Hooks
```typescript
"use client"

import { useState, useEffect } from "react"
import { FeatureService } from "../services/FeatureService"
import { FeatureRepository } from "../repositories/FeatureRepository"

const repository = new FeatureRepository()
const service = new FeatureService(repository)

export function useFeature() {
  const [state, setState] = useState(initialState)
  
  // Business logic integration
  
  return {
    // State
    data: state.data,
    loading: state.loading,
    
    // Actions
    createItem: async (data) => { /* ... */ },
    updateItem: async (id, data) => { /* ... */ },
    deleteItem: async (id) => { /* ... */ },
  }
}
```

## Best Practices

### Code Organization
1. **Single Responsibility**: Each file has one clear purpose
2. **Dependency Direction**: Always import from lower layers
3. **Type Safety**: Use TypeScript interfaces for all data structures
4. **Consistent Patterns**: Follow established conventions across features

### Performance
1. **Server Components**: Use by default for pages
2. **Client Components**: Only when necessary for interactivity
3. **Code Splitting**: Leverage Next.js automatic splitting
4. **Image Optimization**: Use Next.js Image component

### Maintainability
1. **Clear Boundaries**: Separate business logic from UI
2. **Testable Code**: Pure functions in services and repositories
3. **Consistent Naming**: Follow established conventions
4. **Documentation**: Comment complex business logic

### Development Workflow
1. **Start with Types**: Define interfaces in domain layer
2. **Build Repository**: Implement data access
3. **Create Service**: Add business logic
4. **Develop Hook**: Integrate with React
5. **Build Display**: Create UI component
6. **Connect Page**: Import display component

## Error Handling

### Repository Layer
```typescript
async getAllItems(): Promise<Item[]> {
  try {
    // Data access logic
    return items
  } catch (error) {
    console.error("Failed to fetch items:", error)
    throw error
  }
}
```

### Hook Layer
```typescript
const [error, setError] = useState<string | null>(null)

const createItem = async (data: CreateItemRequest) => {
  try {
    setError(null)
    const item = await service.createItem(data)
    // Update state
  } catch (error) {
    setError("Failed to create item")
    console.error(error)
  }
}
```

## Testing Strategy

### Unit Tests
- **Domain Logic**: Test types and business rules
- **Services**: Test business logic with mocked repositories
- **Repositories**: Test data access with mocked APIs

### Integration Tests
- **Hooks**: Test React integration with mocked services
- **Components**: Test UI behavior with mocked hooks

### E2E Tests
- **User Flows**: Test complete feature workflows
- **Page Navigation**: Test routing and display components

## Migration Guidelines

### Adding New Features
1. Create feature directory structure
2. Define domain types
3. Implement repository
4. Build service layer
5. Create React hook
6. Develop display component
7. Connect to page route

### Refactoring Existing Code
1. Extract business logic to services
2. Move data access to repositories
3. Create custom hooks for React integration
4. Convert pages to display component pattern
5. Update imports and dependencies

This architecture ensures scalable, maintainable code that separates concerns and follows Next.js best practices while maintaining a consistent development experience.
