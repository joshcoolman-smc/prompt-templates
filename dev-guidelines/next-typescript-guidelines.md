# Next.js 15 with TypeScript Guidelines

This guide provides best practices for developing applications with Next.js 15, TypeScript, and related tools like Supabase. It emphasizes the feature module pattern for clean, maintainable code organization.

## Table of Contents

- [Project Structure](#project-structure)
- [Feature Module Pattern](#feature-module-pattern)
- [TypeScript Best Practices](#typescript-best-practices)
- [Next.js 15 Specifics](#nextjs-15-specifics)
- [Supabase Integration](#supabase-integration)
- [Form Handling](#form-handling)
- [Authentication](#authentication)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Testing Strategy](#testing-strategy)

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── (auth)/         # Auth-related routes (grouped)
│   │   ├── admin/          # Admin routes (role-protected)
│   │   └── [feature]/      # Feature-specific routes
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   └── [feature]/      # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── actions/        # Server actions
│   │   ├── db/             # Database operations
│   │   ├── utils/          # Utility functions
│   │   ├── validations/    # Validation schemas
│   │   └── types/          # TypeScript types
│   └── styles/             # Global styles
├── middleware.ts           # Next.js middleware
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## Feature Module Pattern

The feature module pattern organizes code by feature rather than technical role, promoting separation of concerns and improved maintainability.

### Key Principles

1. **Feature-based organization**: Group all related code (components, actions, types) by feature
2. **Clear boundaries**: Each feature should have minimal dependencies on other features
3. **Consistent interfaces**: Use consistent patterns for inputs/outputs between features
4. **Feature isolation**: Changes to one feature should rarely impact others

### Implementation

For a feature called "schedule":

```
src/
├── app/
│   └── schedule/           # Route for schedule feature
│       ├── page.tsx        # Main page component
│       ├── [id]/           # Dynamic route
│       │   └── page.tsx    # Item detail page
│       └── layout.tsx      # Layout for schedule pages
├── components/
│   └── schedule/           # All schedule-related components
│       ├── schedule-grid.tsx
│       ├── week-navigation.tsx
│       ├── level-filter.tsx
│       └── class-card.tsx
├── lib/
│   ├── actions/
│   │   └── schedule-actions.ts  # Server actions for schedule
│   ├── db/
│   │   └── schedule-queries.ts  # DB operations for schedule
│   └── validations/
│       └── schedule-schemas.ts  # Zod schemas for schedule
```

### Component Separation

1. **Server vs Client Components**:
   - Create separate files for client and server components
   - Always put `'use client'` at the top of client component files
   - Default to server components unless client functionality is needed

```typescript
// schedule-client.tsx
'use client'

import { useState } from 'react'
// Client-side logic here

// schedule-server.tsx
import { db } from '@/lib/db'
// Server-side logic here
```

2. **Shared State**:
   - Use context for shared state within a feature
   - Keep contexts scoped to specific features when possible

## TypeScript Best Practices

### Type Definitions

1. **Centralized Types**:
   - Define database and shared types in `/lib/types/`
   - Keep feature-specific types close to the feature

```typescript
// /lib/types/database.types.ts - Shared database types
export interface User {
  id: string
  email: string
  name: string | null
}

// /components/schedule/types.ts - Feature-specific types
import type { User } from '@/lib/types/database.types'

export interface ScheduleItem {
  id: string
  title: string
  instructor: Pick<User, 'id' | 'name'>
  // ...
}
```

2. **Using Type Guards**:
   - Implement proper runtime type checks
   - Use type predicates for custom type guards

```typescript
function isScheduleItem(item: unknown): item is ScheduleItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'title' in item
  )
}
```

3. **Proper Nullable Types**:
   - Be explicit about nullable vs optional values
   - Use `null` for intentionally empty values, `undefined` for unset values

```typescript
interface Profile {
  id: string
  email: string
  bio: string | null    // Explicitly empty
  lastLogin?: Date      // May not be set
}
```

### Zod Schema Patterns

[Zod](https://github.com/colinhacks/zod) is recommended for runtime type validation:

1. **Base Schemas**:
   - Define base schemas without refinements
   - Add refinements as separate chained operations

```typescript
// Base schema definition
const baseUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['user', 'admin']),
})

// Add refinements separately
const createUserSchema = baseUserSchema
  .refine(
    (data) => data.name.length >= 2,
    { message: 'Name must be at least 2 characters', path: ['name'] }
  )
```

2. **Schema Composition**:
   - Use composition to build on existing schemas
   - Leverage object spreading instead of `.extend()`

```typescript
// Using object spreading for better type inference
const userWithIdSchema = z.object({
  ...baseUserSchema.shape,
  id: z.string().uuid(),
  createdAt: z.date(),
})

// Response schemas
const userResponseSchema = z.object({
  data: userWithIdSchema,
  status: z.number(),
})
```

3. **Form Validation**:
   - Define dedicated schemas for form validation
   - Add specific error messages for form fields

```typescript
export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
```

## Next.js 15 Specifics

### Page Props Handling

Next.js 15 requires specific handling for page props with the App Router:

1. **Type Definition**:

```typescript
import type { PageProps } from 'next'

export default function MyPage(props: PageProps) {
  const { params, searchParams } = props
  // ...
}
```

2. **Safe Parameter Access**:

```typescript
// Safely access search params with type checking
const value = typeof searchParams.param === 'string' 
  ? searchParams.param 
  : defaultValue
```

3. **Handling Promise and Non-Promise Types**:

Define utility types and functions:

```typescript
// In src/lib/types/next-types.ts
export type SafeParams<T> = T | Promise<T> | undefined

export async function safelyAwaitParam<T>(param: SafeParams<T>): Promise<T | undefined> {
  if (!param) return undefined
  return param instanceof Promise ? await param : param
}

// Usage in page component
export default async function FeaturePage(props: PageProps) {
  const params = await safelyAwaitParam(props.searchParams) || {}
  // Now use params safely
}
```

4. **Custom Type Definitions**:

Create custom type definitions in `/src/types/next.d.ts`:

```typescript
declare module 'next' {
  export interface PageProps {
    params?: any
    searchParams?: any
  }
}
```

### Server Actions

1. **Type-Safe Server Actions**:

```typescript
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const inputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

type ActionResult = 
  | { success: true; data: any }
  | { success: false; error: string }

export async function createItem(formData: FormData): Promise<ActionResult> {
  const rawData = Object.fromEntries(formData.entries())
  
  try {
    const data = inputSchema.parse(rawData)
    // Process data...
    revalidatePath('/items')
    return { success: true, data: { id: '123' } }
  } catch (error) {
    return { success: false, error: 'Invalid data' }
  }
}

// Wrapper for form actions
export async function createItemAction(formData: FormData) {
  await createItem(formData)
}
```

2. **Component Integration**:

```tsx
'use client'

import { createItemAction } from '@/lib/actions/item-actions'

export function ItemForm() {
  return (
    <form action={createItemAction}>
      <input name="title" required />
      <textarea name="description" />
      <button type="submit">Create</button>
    </form>
  )
}
```

## Supabase Integration

### Configuration

1. **Client Setup**:

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

2. **Server Setup**:

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set(name, value, options)
        },
        remove(name, options) {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )
}
```

3. **Middleware Integration**:

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  await supabase.auth.getSession()
  
  // Optional: Protect routes
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
}
```

### Authentication

1. **Server Actions for Auth**:

```typescript
// src/lib/auth/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
```

2. **Auth Components**:

```tsx
// src/components/auth/login-form.tsx
'use client'

import { login } from '@/lib/auth/actions'

export function LoginForm() {
  return (
    <form action={login}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Database Operations

1. **Type-Safe Queries**:

```typescript
// src/lib/db/items.ts
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Item = Database['public']['Tables']['items']['Row']

export async function getItems() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching items:', error)
    return { data: null, error }
  }
  
  return { data: data as Item[], error: null }
}

export async function getItemById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error(`Error fetching item ${id}:`, error)
    return { data: null, error }
  }
  
  return { data: data as Item, error: null }
}
```

## Form Handling

1. **Form Actions With Validation**:

```typescript
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
})

export async function createPost(formData: FormData) {
  // 1. Extract data
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
  }
  
  // 2. Validate data
  const result = formSchema.safeParse(rawData)
  if (!result.success) {
    // Return validation errors
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }
  
  // 3. Insert into database
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .insert(result.data)
    .select('id')
    .single()
  
  if (error) {
    return {
      success: false,
      errors: { form: 'Failed to create post' },
    }
  }
  
  // 4. Revalidate cache and return result
  revalidatePath('/posts')
  return { success: true, data }
}
```

2. **React Hook Form Integration**:

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormState } from 'react-dom'
import { createPost } from '@/lib/actions/post-actions'

const formSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
})

type FormValues = z.infer<typeof formSchema>

export function PostForm() {
  const [state, formAction] = useFormState(createPost, { success: false, errors: {} })
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })
  
  return (
    <form action={formAction}>
      <div>
        <label>Title</label>
        <input name="title" />
        {state.errors?.title && <p className="text-red-500">{state.errors.title[0]}</p>}
      </div>
      
      <div>
        <label>Content</label>
        <textarea name="content" />
        {state.errors?.content && <p className="text-red-500">{state.errors.content[0]}</p>}
      </div>
      
      <button type="submit">Create Post</button>
    </form>
  )
}
```

## Error Handling

1. **Global Error Boundary**:

```tsx
// src/app/error.tsx
'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

2. **Not Found Page**:

```tsx
// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Not Found</h2>
      <p>Could not find the requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

3. **Feature-specific Error Handling**:

```tsx
// src/app/[feature]/error.tsx
'use client'

export default function FeatureError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="feature-error">
      <h3>Error in Feature</h3>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )
}
```

## Performance Optimization

1. **Route Segmentation**:
   - Use route groups `(group)/` for logical organization
   - Implement parallel routes with `@slot` for independent loading

2. **Loading States**:
   - Create `loading.tsx` files for route segments
   - Use Suspense boundaries for granular loading

```tsx
// src/app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <div className="loading-spinner">Loading dashboard...</div>
}
```

3. **Streaming with Suspense**:

```tsx
// src/app/dashboard/page.tsx
import { Suspense } from 'react'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { LatestOrders } from '@/components/dashboard/latest-orders'

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <Suspense fallback={<div>Loading chart...</div>}>
        <RevenueChart />
      </Suspense>
      
      <Suspense fallback={<div>Loading orders...</div>}>
        <LatestOrders />
      </Suspense>
    </div>
  )
}
```

4. **Optimistic Updates**:

```tsx
'use client'

import { experimental_useOptimistic as useOptimistic } from 'react'
import { likePost } from '@/lib/actions/post-actions'

export function LikeButton({ postId, likes }: { postId: string; likes: number }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state) => state + 1
  )
  
  async function handleLike() {
    addOptimisticLike()
    await likePost(postId)
  }
  
  return (
    <button onClick={handleLike}>
      Like ({optimisticLikes})
    </button>
  )
}
```

## Testing Strategy

1. **Unit Testing**:
   - Test individual functions and components in isolation
   - Use Jest and React Testing Library

```typescript
// src/lib/utils.test.ts
import { formatDate } from './utils'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-01-15T12:00:00Z')
    expect(formatDate(date)).toBe('Jan 15, 2023')
  })
})
```

2. **Component Testing**:

```tsx
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
  
  it('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

3. **Integration Testing**:
   - Test multiple components working together
   - Mock external dependencies

4. **E2E Testing**:
   - Use Playwright or Cypress
   - Test complete user flows

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can log in', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  // Verify redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toHaveText('Dashboard')
})
```

## Accessibility

1. **Use Semantic HTML**:
   - Choose appropriate elements (`<button>`, `<a>`, etc.)
   - Maintain correct heading hierarchy

2. **ARIA Attributes**:
   - Add when necessary but prefer correct HTML semantics
   - Use `aria-live` for dynamic content

3. **Keyboard Navigation**:
   - Ensure all interactive elements are keyboard accessible
   - Maintain proper focus management

4. **Color Contrast**:
   - Meet WCAG AA standards (4.5:1 for normal text)
   - Don't rely solely on color to convey information

## Deployment Considerations

1. **Environment Configuration**:
   - Use `.env.local` for local development
   - Set up proper environment variables in production

2. **Build Optimization**:
   - Optimize images and assets
   - Enable tree-shaking and code splitting

3. **Monitoring**:
   - Implement error tracking (Sentry, etc.)
   - Set up performance monitoring

4. **CI/CD**:
   - Automate testing in CI pipelines
   - Set up deploy previews for PRs
