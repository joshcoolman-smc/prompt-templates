# Next.js State Management Instructions

## Core Principle
**You do NOT need a state management library for most use cases.** Break state into different concerns and use specialized tools for each.

---

## State Categories & Solutions

### 1. Remote State (Data from APIs/Backend)
**Problem:** Fetching, caching, error handling, loading states, deduplication, invalidation

**Solution:** Use **TanStack Query** (React Query)

```typescript
function Component() {
  const { isPending, error, data } = useQuery({
    queryKey: ['my-data'],
    queryFn: () => fetch('https://my-url/data').then((res) => res.json()),
  });

  if (isPending) return 'Loading...';
  if (error) return 'Oops, something went wrong';
  
  return // render data
}
```

**Benefits:**
- Automatic caching and deduplication
- Built-in loading/error states
- Prefetching support
- Optimistic updates
- Pagination
- Automatic retries

**When to use:** ANY data from external sources (REST APIs, databases, etc.)

---

### 2. URL State (Query Parameters)
**Problem:** Syncing URL query params with component state

**Solution:** Use **nuqs** library

```typescript
import { useQueryState, parseAsInteger } from 'nuqs';

export function MyApp() {
  // Simple string param
  const [step, setStep] = useQueryState('onboarding');
  
  // Typed param with default
  const [tab, setTab] = useQueryState('tab', parseAsInteger.withDefault(1));

  return (
    <>
      <button onClick={() => setStep('step2')}>Next Step</button>
      <button onClick={() => setTab(2)}>Second tab</button>
    </>
  );
}
```

**When to use:** 
- Tab states
- Filter states
- Search parameters
- Pagination
- Any UI state that should be shareable via URL

---

### 3. Local State
**Problem:** Component-specific state that doesn't need sharing

**Solution:** Use React's **useState** or **useReducer**

```typescript
export function CreateIssueComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Dialog</button>
      {isOpen && <CreateIssueDialog onClose={() => setIsOpen(false)} />}
    </>
  );
}
```

**When to use:**
- Modal/dialog open/closed states
- Dropdown states
- Tooltip visibility
- Form input values (before submission)
- Any state contained within a single component tree

---

### 4. Shared State
**Problem:** State needed across multiple unrelated components

#### Option A: Props Drilling (Simple Cases)
Use when sharing between parent/child up to 3 levels deep.

#### Option B: Context (2-3 Shared States)
Use for 1-2 app-wide states like theme or auth.

```typescript
const SidebarContext = React.createContext({
  isSidebarOpen: false,
  toggleSidebar: () => {},
});

const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
    }),
    [isSidebarOpen],
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
```

**Context Limitations:**
- Causes "Provider Hell" with 3+ providers
- All Context consumers re-render on any value change
- Not scalable beyond 2-3 shared states

#### Option C: Zustand (3+ Shared States)
Use when Context becomes unwieldy.

```typescript
import create from 'zustand';

const useSidebarStore = create((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

// Usage in any component
function Component() {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  return <button onClick={toggleSidebar}>Toggle</button>;
}
```

**Zustand Benefits:**
- No providers needed
- No unnecessary re-renders (only updates components using changed state)
- Simple, intuitive API
- Works with React 18+, SSR, RSC

---

## Decision Tree

```
Is it data from an API/backend?
├─ YES → Use TanStack Query
└─ NO ↓

Is it URL query parameter state?
├─ YES → Use nuqs
└─ NO ↓

Is it local to a single component?
├─ YES → Use useState/useReducer
└─ NO ↓

Is it shared between components?
├─ Shared between parent/child (≤3 levels) → Props drilling
├─ 1-2 app-wide states → Context
└─ 3+ complex shared states → Zustand
```

---

## Default Tech Stack

For most Next.js applications:
1. **TanStack Query** - All remote data
2. **nuqs** - URL query parameters  
3. **useState/useReducer** - Local state
4. **Zustand** - Complex shared state (when needed)

---

## What NOT to Do

❌ **Don't use Redux/Redux Toolkit** unless:
- You need highly structured, opinionated patterns
- Advanced debugging with Redux DevTools is critical
- Working in large organization requiring strict consistency

❌ **Don't use Context for everything**
- Maximum 2-3 Context providers
- Split into smaller concerns rather than one mega-Context

❌ **Don't use signals/observables** (MobX, etc.)
- Not aligned with React's declarative model
- Steep learning curve
- Mental model conflicts with React

❌ **Don't use state machines** (XState) unless:
- Building extremely complex UI (Figma-level)
- Explicit need for formal state machine patterns

---

## Migration Strategy

If migrating from Redux:
1. **First:** Move all API calls to TanStack Query (~80% of Redux code)
2. **Second:** Move URL params to nuqs
3. **Third:** Convert local state to useState
4. **Last:** Evaluate if remaining shared state needs Zustand or Context

---

## Performance Considerations

- **TanStack Query:** Handles caching/deduplication automatically
- **nuqs:** No performance concerns
- **Context:** Every consumer re-renders on ANY value change
- **Zustand:** Only re-renders components using changed state slices

---

## Key Principles

1. **Simplicity first** - Use the simplest solution that works
2. **Separation of concerns** - Different state types need different solutions
3. **No premature optimization** - But measure if you suspect issues
4. **Aligned with React** - Hooks-based, declarative, unidirectional data flow
5. **~90% of state doesn't need a "state management library"**
