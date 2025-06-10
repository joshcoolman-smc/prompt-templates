Apply these principles to any React/TypeScript application regardless of specific requirements or domain.

### Visual-to-Code Mapping
- **One-to-One Relationship**: What users see on screen should directly map to filesystem location
- **No Mental Translation**: Developers should instantly know where to find code for any UI element
- **Feature Isolation**: Business domains are completely self-contained

### Component Ownership
- **Page-Centric UI**: Each route owns its complete visual experience
- **Component-Free Features**: Business logic layers contain no UI components
- **Localized Components**: UI components live with the pages that use them

## Recommended Folder Structure

```
src/
├── features/                          # Pure business logic (framework agnostic)
│   ├── [business-domain]/
│   │   ├── types/                     # Domain entities and interfaces
│   │   │   └── [Entity]Types.ts
│   │   ├── repositories/              # Data access layer
│   │   │   └── [Entity]Repository.ts
│   │   ├── services/                  # Business logic layer
│   │   │   └── [Entity]Service.ts
│   │   └── hooks/                     # React state management
│   │       └── use[Entity].ts
│   └── shared/                        # Cross-domain utilities
│       ├── types/
│       ├── utils/
│       └── hooks/
├── pages/                             # Route components (Next.js) or
├── routes/                            # Route components (React Router)
│   └── [page-path]/
│       ├── components/                # Route-specific components only
│       │   ├── [ComponentName].tsx
│       │   └── [AnotherComponent].tsx
│       ├── hooks/                     # Route-specific hooks (optional)
│       │   └── use[PageName].ts
│       ├── [sub-section]/             # Nested routes/tabs
│       │   ├── components/
│       │   └── index.tsx
│       └── index.tsx                  # Main route component
└── shared/                            # Global shared resources
    ├── components/                    # Truly reusable UI components
    ├── hooks/
    ├── utils/
    └── types/
```

## Decision Framework

### Where Does This Code Go?

1. **Is this business logic or data management?**
   - YES → `features/[business-domain]/`
   - Includes: Domain types, API calls, business rules, data hooks

2. **Is this UI specific to one route/page?**
   - YES → `routes/[page-path]/components/`
   - Includes: Page layouts, forms, route-specific interactive elements

3. **Is this truly shared across multiple routes?**
   - YES → `shared/components/` (use sparingly)
   - Includes: Generic reusable components

### Data Flow Patterns

```typescript
// Standard pattern (direct service calls)
Component → useBusinessLogic() → Service → Repository → API/Database

// External services pattern (when server processing required)
Component → useBusinessLogic() → /api/endpoint → External Service
```

## Development Patterns

### 1. Define Domain Types
```typescript
// features/[business-domain]/types/[Entity]Types.ts
export interface EntityType {
  id: string
  // ... entity properties
}

export interface CreateEntityRequest {
  // ... creation properties
}

export type EntityStatus = 'active' | 'inactive' | 'pending'
```

### 2. Create Repository Interface
```typescript
// features/[business-domain]/repositories/[Entity]Repository.ts
export interface EntityRepository {
  findById(id: string): Promise<EntityType | null>
  findAll(filters?: FilterType): Promise<EntityType[]>
  create(data: CreateEntityRequest): Promise<EntityType>
  update(id: string, data: UpdateEntityRequest): Promise<EntityType>
  delete(id: string): Promise<void>
}
```

### 3. Implement Business Service
```typescript
// features/[business-domain]/services/[Entity]Service.ts
export class EntityService {
  constructor(private repository: EntityRepository) {}

  async getEntityById(id: string): Promise<EntityType | null> {
    return this.repository.findById(id)
  }

  async createEntity(data: CreateEntityRequest): Promise<EntityType> {
    // Business logic, validation, etc.
    return this.repository.create(data)
  }
}
```

### 4. Create React Hook
```typescript
// features/[business-domain]/hooks/use[Entity].ts
export function useEntity() {
  const [data, setData] = useState<EntityType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const service = useMemo(() => new EntityService(new EntityRepositoryImpl()), [])

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await service.getAllEntities()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [service])

  const createItem = useCallback(async (item: CreateEntityRequest) => {
    const newItem = await service.createEntity(item)
    setData(prev => [...prev, newItem])
    return newItem
  }, [service])

  return {
    data,
    loading,
    error,
    loadData,
    createItem,
    // ... other operations
  }
}
```

## Route Organization Patterns

### Simple Route Structure
```
routes/page-name/
├── components/
│   ├── PageHeader.tsx
│   ├── PageContent.tsx
│   └── PageFooter.tsx
└── index.tsx
```

### Complex Route with Sections
```
routes/complex-page/
├── components/                    # Shared page components
│   ├── PageLayout.tsx
│   ├── Navigation.tsx
│   └── PageHeader.tsx
├── section-one/                   # Sub-section
│   ├── components/
│   └── index.tsx
├── section-two/                   # Sub-section
│   ├── components/
│   │   ├── SectionTable.tsx
│   │   └── SectionForm.tsx
│   └── index.tsx
└── index.tsx                      # Main page route
```

## Communication Template

When requesting new features or pages, use this template:

```
Route: [page-path]
Description: [purpose and functionality]
User Access: [access requirements]
Layout Type: [simple | sectioned | other]

Required Business Logic:
- [business-domain]: [operations needed]
- [another-domain]: [operations needed]

Page Sections (if applicable):
- [section-name]: [what it displays/does]
- [another-section]: [what it displays/does]

Components Needed:
- [ComponentName]: [purpose and behavior]
- [AnotherComponent]: [purpose and behavior]

Data Source: [mock | API | database]
```

## Best Practices

### DO ✅
- Keep business logic in features, UI logic in routes
- Make each feature completely self-contained
- Use direct service calls for internal operations
- Create route-specific components within route folders
- Follow consistent naming conventions
- Write TypeScript interfaces for all data structures

### DON'T ❌
- Put UI components in feature folders
- Create shared components until you have 3+ actual use cases
- Make routes depend on other routes (only on features)
- Put business logic directly in React components
- Create API endpoints for simple CRUD operations
- Mix concerns between layers

## Framework-Specific Adaptations

### Next.js App Router
- Use `app/` directory instead of `routes/`
- Add `page.tsx`, `layout.tsx`, `loading.tsx` as needed
- API routes in `app/api/` for server-side operations only

### React Router
- Use `routes/` directory structure as shown
- Implement route configuration in main router setup
- Handle nested routing with outlet components

### Vite/Create React App
- Use `routes/` or `pages/` directory
- Configure routing with React Router
- Handle build configuration for path resolution

## Quick Reference

**Adding business domain?** → Create `features/[business-domain]/` with types → repository → service → hook
**Adding new page?** → Create `routes/[page-path]/` with components specific to that route
**Adding page section?** → Create `routes/[page-path]/[section]/` subdirectory
**Finding page code?** → Look in `routes/[page-path]/`
**Finding business logic?** → Look in `features/[business-domain]/`
**Need shared component?** → Verify 3+ use cases, then add to `shared/components/`

This structure ensures predictable code organization and maintainable architecture regardless of application complexity or specific requirements.
