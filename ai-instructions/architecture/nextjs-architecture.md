# Next.js Architecture Guidelines

## Project Structure

This document outlines the architectural patterns and project organization for Next.js 13+ applications using TypeScript and Tailwind CSS v4.

## Core Principles

- **Feature-based organization**: Group related functionality together
- **Clear separation of concerns**: Separate data access, business logic, and UI
- **Type safety throughout**: Explicit TypeScript typing for all interfaces
- **Consistent import patterns**: Use path aliases and consistent import ordering

## Directory Structure

```
src/
├── app/                     # Next.js App Router pages and layouts
│   ├── (auth)/             # Route groups for auth pages
│   ├── dashboard/          # Dashboard pages
│   ├── globals.css         # Global styles with Tailwind imports
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page
├── components/             # Shared/reusable components
│   ├── ui/                 # Basic UI components (buttons, inputs, etc.)
│   └── layout/             # Layout components (header, footer, etc.)
├── features/               # Feature modules (main organization pattern)
│   └── [feature-name]/     # Individual feature directory
│       ├── components/     # Feature-specific components
│       ├── hooks/          # Feature-specific React hooks
│       ├── repository/     # Data access layer
│       ├── service/        # Business logic layer
│       ├── types/          # TypeScript types and interfaces
│       └── utils/          # Helper functions
├── lib/                    # Shared utilities and configurations
│   ├── auth/              # Authentication utilities
│   ├── database/          # Database configuration
│   └── utils/             # General utility functions
└── types/                 # Global TypeScript types
```

## Feature Module Pattern

### Repository-Service-Hooks Architecture

This three-layer pattern ensures clean separation of concerns:

**Repository Layer**: Data access and API interactions
**Service Layer**: Business logic and data transformation
**Hooks Layer**: React state management and component integration

### Repository Layer

Repositories handle all data access, hiding implementation details:

```typescript
// features/users/repository/user-repository.ts
import { User } from '../types';

export interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, 'id'>): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export class ApiUserRepository implements UserRepository {
  private async fetchWithValidation<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getUsers(): Promise<User[]> {
    return this.fetchWithValidation<User[]>('/api/users');
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.fetchWithValidation<User>(`/api/users/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.fetchWithValidation<User>('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  }
}
```

### Service Layer

Services contain business logic and can combine multiple repositories:

```typescript
// features/users/service/user-service.ts
import { UserRepository } from '../repository/user-repository';
import { PostRepository } from '../../posts/repository/post-repository';
import { User, UserWithPosts } from '../types';

export interface UserService {
  getUserWithPosts(userId: string): Promise<UserWithPosts>;
  promoteToAdmin(userId: string): Promise<User>;
  deactivateUser(userId: string): Promise<void>;
}

export class UserServiceImpl implements UserService {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository
  ) {}

  async getUserWithPosts(userId: string): Promise<UserWithPosts> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const posts = await this.postRepository.getPostsByUserId(userId);
    return { ...user, posts };
  }

  async promoteToAdmin(userId: string): Promise<User> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    if (user.role === 'admin') {
      return user; // Already an admin
    }
    
    return this.userRepository.updateUser(userId, { role: 'admin' });
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    await this.userRepository.updateUser(userId, { 
      status: 'inactive',
      deactivatedAt: new Date().toISOString()
    });
  }
}
```

### Hooks Layer

Custom hooks manage React state and connect components to services:

```typescript
// features/users/hooks/use-user-with-posts.ts
import { useState, useEffect } from 'react';
import { UserService } from '../service/user-service';
import { UserWithPosts } from '../types';

interface UseUserWithPostsResult {
  data: UserWithPosts | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUserWithPosts(
  userId: string,
  userService: UserService
): UseUserWithPostsResult {
  const [data, setData] = useState<UserWithPosts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await userService.getUserWithPosts(userId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
```

## Dependency Injection

Use dependency injection to make components testable and flexible:

```typescript
// lib/services/service-container.ts
import { UserRepository, ApiUserRepository } from '@/features/users/repository/user-repository';
import { UserService, UserServiceImpl } from '@/features/users/service/user-service';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private userRepository: UserRepository;
  private userService: UserService;

  private constructor() {
    // Initialize repositories
    this.userRepository = new ApiUserRepository();
    
    // Initialize services with dependencies
    this.userService = new UserServiceImpl(this.userRepository);
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  getUserService(): UserService {
    return this.userService;
  }
}

// Hook for accessing services
export function useUserService(): UserService {
  return ServiceContainer.getInstance().getUserService();
}
```

## TypeScript Configuration

### Path Aliases

Configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### Import Organization

Organize imports consistently:

```typescript
// 1. External packages
import React, { useState, useEffect } from 'react';
import { z } from 'zod';

// 2. Internal path aliases
import { Button } from '@/components/ui/button';
import { useUserService } from '@/lib/services/service-container';

// 3. Relative imports (same feature only)
import { UserSchema } from '../types';
import { useUserWithPosts } from '../hooks/use-user-with-posts';
```

## Type Safety Guidelines

### Interface Definitions

Define explicit interfaces for all data structures:

```typescript
// features/users/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  deactivatedAt?: string;
}

export interface UserWithPosts extends User {
  posts: Post[];
}

export interface CreateUserRequest {
  email: string;
  name: string;
  role?: User['role'];
}

export interface UpdateUserRequest {
  name?: string;
  role?: User['role'];
  status?: User['status'];
}
```

### Runtime Validation

Use Zod for runtime validation at application boundaries:

```typescript
// features/users/types/user-schema.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'user', 'guest']),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deactivatedAt: z.string().datetime().optional(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'user', 'guest']).optional(),
});

// Type inference from schema
export type User = z.infer<typeof UserSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
```

## Error Handling

### Custom Error Types

Define specific error types for different scenarios:

```typescript
// lib/errors/api-errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

### Error Handling in Services

Handle errors consistently across services:

```typescript
// features/users/service/user-service.ts
export class UserServiceImpl implements UserService {
  async getUserWithPosts(userId: string): Promise<UserWithPosts> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new NotFoundError('User', userId);
      }
      
      const posts = await this.postRepository.getPostsByUserId(userId);
      return { ...user, posts };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      throw new Error(
        `Failed to fetch user with posts: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
```

## Performance Considerations

### Lazy Loading

Implement lazy loading for feature modules:

```typescript
// app/dashboard/users/page.tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const UserManagement = lazy(() => import('@/features/users/components/UserManagement'));

export default function UsersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserManagement />
    </Suspense>
  );
}
```

### Service Memoization

Cache expensive service operations:

```typescript
// lib/cache/service-cache.ts
export class ServiceCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  async memoize<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    
    const result = await fn();
    this.cache.set(key, { data: result, timestamp: Date.now() });
    return result;
  }
}
```

## Next.js Specific Patterns

### Server Components vs Client Components

**Critical Rule: Page routes must ALWAYS be Server Components** - never add `'use client'` to page.tsx files.

Use Server Components by default, Client Components when needed:

```typescript
// app/users/page.tsx (Server Component)
import { UserList } from '@/features/users/components/UserList';
import { getUsersServerAction } from '@/features/users/actions/user-actions';

export default async function UsersPage() {
  const users = await getUsersServerAction();
  
  return (
    <div>
      <h1>Users</h1>
      <UserList users={users} />
    </div>
  );
}

// features/users/components/UserList.tsx (Client Component)
'use client';

import { useState } from 'react';
import { User } from '../types';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const [filter, setFilter] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <div>
      <input 
        type="text" 
        placeholder="Filter users..." 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredUsers.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Server Actions

Implement Server Actions for form handling:

```typescript
// features/users/actions/user-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateUserSchema } from '../types/user-schema';
import { ServiceContainer } from '@/lib/services/service-container';

export async function createUserAction(formData: FormData) {
  const userService = ServiceContainer.getInstance().getUserService();
  
  const formValues = {
    email: formData.get('email') as string,
    name: formData.get('name') as string,
    role: formData.get('role') as string || 'user',
  };
  
  const validationResult = CreateUserSchema.safeParse(formValues);
  
  if (!validationResult.success) {
    return {
      error: 'Validation failed',
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }
  
  try {
    await userService.createUser(validationResult.data);
    revalidatePath('/users');
    redirect('/users');
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
}
```

## Page vs Display Component Pattern

### Recommended Architecture for Pages

**Page Component (Server)**: Authentication, data fetching, business logic
**Display Component (Client)**: UI rendering, state management, interactivity

```typescript
// ✅ CORRECT: app/dashboard/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardDisplay } from '@/components/dashboard/DashboardDisplay';

export default async function DashboardPage() {
  // Server-side auth check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Server-side data fetching
  const dashboardData = await fetchDashboardData(user.id);

  // Pass to Client Component for interactivity
  return <DashboardDisplay user={user} data={dashboardData} />;
}

// ✅ CORRECT: components/dashboard/DashboardDisplay.tsx (Client Component)
'use client';

import { useState } from 'react';

export function DashboardDisplay({ user, data }) {
  const [activeTab, setActiveTab] = useState('overview');
  // All interactivity and state here
  
  return (
    <div>
      {/* Interactive UI */}
    </div>
  );
}
```

### Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Never put 'use client' on page routes
'use client';

export default function DashboardPage() {
  // This loses Server Component benefits:
  // - No server-side authentication
  // - No SEO optimization
  // - Larger bundle size
  // - Can't use async/await directly
}
```

### Benefits of This Pattern

**Server Component Pages:**
- Server-side authentication and redirects
- SEO optimization and faster initial loads
- Secure data fetching
- Smaller client bundles

**Client Component Displays:**
- Interactive state management
- Event handlers and user interactions
- Browser-only APIs
- Real-time updates

This architecture provides a solid foundation for scalable Next.js applications with clear separation of concerns, optimal performance, and maintainable code organization.