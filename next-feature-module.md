# Visual-to-Code Mapping Architecture

## Core Philosophy

**One-to-One Relationship**: What users see maps directly to filesystem location.
**Component-Free Features**: Features contain only business logic. UI components live with pages.
**Page-Centric Organization**: Routes own their complete UI experience.

## Folder Structure

```
src/
├── features/                          # Business logic only
│   ├── [feature-name]/
│   │   ├── domain/[FeatureName]Types.ts
│   │   ├── repositories/[FeatureName]Repository.ts
│   │   ├── services/[FeatureName]Service.ts
│   │   └── hooks/use[FeatureName].ts
│   └── shared/
└── app/                               # Next.js App Router
    ├── api/                           # Only for external services/file processing
    │   └── [feature-name]/route.ts
    └── [route-name]/                  # Visual page
        ├── components/                # Page-specific components only
        ├── [sub-route]/               # Nested routes
        ├── layout.tsx
        └── page.tsx
```

## Decision Tree

**Business logic/data?** → `features/[feature-name]/`
**UI for specific page?** → `app/[route-name]/components/`
**Shared across routes?** → `shared/` (use sparingly)

## Data Flow

```
// Standard (90% of cases)
Component → useFeature() → Service → Repository → Database

// External services only
Component → useFeature() → /api/feature → External API
```

## API Routes: Only When Required

Use API routes only for:
- External API calls requiring server-side secrets
- File processing/uploads
- Webhooks

## Feature Creation Pattern

1. **Domain types** (`domain/`)
2. **Data access** (`repositories/`)
3. **Business logic** (`services/`)
4. **React hook** (`hooks/`) - calls service directly or API route if needed

## Page Creation Pattern

**Simple pages:**
```
app/[page]/
├── components/
└── page.tsx
```

**Complex pages:**
```
app/[page]/
├── components/           # Shared page components
├── (tab1)/              # Default tab
├── [tab2]/              # Additional tabs
├── layout.tsx           # Tab navigation
└── page.tsx
```

## Key Rules

✅ Pages compose from features, never from other pages
✅ Components belong with the pages that use them
✅ Direct service calls unless external APIs involved
✅ One business domain = one feature folder

❌ Don't put UI components in features
❌ Don't create shared components prematurely
❌ Don't use API routes for internal CRUD operations
