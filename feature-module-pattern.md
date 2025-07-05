# React TypeScript Feature Guidelines

## Project Architecture

This document outlines the technical guidelines, code organization, and type safety requirements for React/TypeScript projects. These guidelines are framework-agnostic and can be applied to any modern React-based setup.

## Feature Module Pattern

Organize code using the feature module pattern to maintain clear separation of concerns and improve maintainability:

```
features/[feature-name]/
├── components/  # UI components specific to this feature
├── hooks/       # Custom React hooks for the feature
├── repository/  # Data access layer
├── service/     # Business logic
├── types/       # TypeScript interfaces, types, and enums
└── utils/       # Helper functions and utilities
```

## Type Safety Guidelines

### TypeScript Best Practices

- Use explicit typing rather than relying on type inference for function parameters and return types
- Define interfaces for props, state, and API responses
- Avoid using `any` type - use `unknown` with type guards when type is truly uncertain
- Use union types for values with a fixed set of possibilities
- Leverage discriminated unions for complex state management
- Utilize TypeScript's utility types (Partial, Pick, Omit, etc.) when appropriate

### Type Safety with External Data

- Define interfaces for all API responses
- Use Zod for runtime validation of external data:
  ```typescript
  // Example Zod schema
  const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["admin", "user", "guest"])
  });
  
  // Type inference from schema
  type User = z.infer<typeof UserSchema>;
  ```

- Validate all data at application boundaries (API calls, local storage, etc.)

## Repository-Service-Hooks Pattern

### Repository Layer

Repositories are responsible for data access, hiding the implementation details of data fetching:

```typescript
// Example repository interface
interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, "id">): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

// Implementation
class ApiUserRepository implements UserRepository {
  // Implementation using fetch/axios/etc.
}

// Mock implementation for development/testing
class MockUserRepository implements UserRepository {
  // Implementation using local data
}
```

### Service Layer

Services contain business logic and can combine data from multiple repositories:

```typescript
interface UserService {
  getUserWithPosts(userId: string): Promise<UserWithPosts>;
  promoteToAdmin(userId: string): Promise<User>;
}

class UserServiceImpl implements UserService {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository
  ) {}

  async getUserWithPosts(userId: string): Promise<UserWithPosts> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    const posts = await this.postRepository.getPostsByUserId(userId);
    return { ...user, posts };
  }

  async promoteToAdmin(userId: string): Promise<User> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    return this.userRepository.updateUser(userId, { role: "admin" });
  }
}
```

### Hook Layer

Custom hooks connect React components to services, managing loading states and errors:

```typescript
function useUserWithPosts(userId: string) {
  const userService = useUserService();
  const [data, setData] = useState<UserWithPosts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    userService.getUserWithPosts(userId)
      .then(result => {
        if (isMounted) {
          setData(result);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
          setData(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId, userService]);

  return { data, isLoading, error };
}
```

## Component Structure

Organize components to maintain proper separation of concerns:

### Container Components
- Connect to data sources via hooks
- Manage state and side effects
- Pass data and callbacks to presentational components
- Don't include complex markup or styles

### Presentational Components
- Receive data and callbacks via props
- Focus on rendering UI and handling user interaction
- Should be mostly pure/stateless
- Easily testable in isolation

### Example Component Organization:

```typescript
// Container component
function UserProfileContainer({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUserWithPosts(userId);
  const { updateProfile } = useProfileActions();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound resource="User" />;

  return (
    <UserProfile 
      user={user} 
      onUpdateProfile={updateProfile} 
    />
  );
}

// Presentational component
function UserProfile({ 
  user, 
  onUpdateProfile 
}: { 
  user: UserWithPosts; 
  onUpdateProfile: (updates: Partial<User>) => void;
}) {
  // Rendering logic only
  return (
    <div>
      <h1>{user.name}</h1>
      {/* ... other UI elements */}
    </div>
  );
}
```

## Mock Data

Generate realistic mock data for development and testing:

- Create a comprehensive set of mock data for each entity
- Store mock data in the feature's `repository/mocks` or `utils/mocks` folder
- Use factories to generate dynamic mock data with reasonable variations:

```typescript
// User factory
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: `user-${Math.random().toString(36).substring(2, 9)}`,
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    role: "user",
    ...overrides
  };
}

// Generate multiple users
function createMockUsers(count: number): User[] {
  return Array.from({ length: count }, () => createMockUser());
}
```

## Error Handling

Implement consistent error handling throughout the application:

- Define custom error types for different error categories
- Handle errors at appropriate levels in the application
- Provide meaningful error messages for users
- Log errors for debugging and monitoring

```typescript
// Custom error types
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Error handling in repository
async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response.status,
        await response.json().catch(() => null)
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Network error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
```

## Testing Strategy

Include a comprehensive testing strategy:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test complete user flows

Use test-driven development when appropriate:
1. Write a failing test
2. Implement the minimum code to make the test pass
3. Refactor while keeping tests passing

## Import Guidelines

Organize imports consistently:

- Use path aliases for imports to avoid deep relative paths
- Configure path aliases in `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["*"],
        "@features/*": ["features/*"],
        "@components/*": ["components/*"],
        "@hooks/*": ["hooks/*"],
        "@utils/*": ["utils/*"]
      }
    }
  }
  ```

- Organize imports in the following order:
  1. External packages
  2. Aliased internal imports
  3. Relative imports (only for files in the same feature)

- Example:
  ```typescript
  // External packages
  import React, { useState, useEffect } from 'react';
  import { z } from 'zod';
  
  // Aliased internal imports
  import { Button } from '@components/ui/button';
  import { useToast } from '@hooks/use-toast';
  
  // Relative imports (same feature)
  import { UserSchema } from '../types';
  import { useUserService } from '../hooks/use-user-service';
  ```

## Version Control Guidelines

- Use descriptive commit messages
- Create feature branches for new work
- Keep pull requests focused and reasonably sized
- Review all code changes before merging

## Documentation

Code should be self-documenting where possible, with additional documentation for complex logic:

- Use JSDoc comments for public APIs and complex functions
- Include examples for non-obvious usage
- Document known limitations and edge cases

```typescript
/**
 * Retrieves user data and merges it with related posts
 * 
 * @param userId - The unique identifier of the user
 * @returns Promise resolving to user with their posts
 * @throws {NotFoundError} When user does not exist
 * @throws {ApiError} When API request fails
 * 
 * @example
 * ```ts
 * const { data } = await getUserWithPosts('user-123');
 * console.log(data.posts.length);
 * ```
 */
async function getUserWithPosts(userId: string): Promise<UserWithPosts> {
  // Implementation
}
```

## Performance Considerations

Include guidelines for performance optimization:

- Memoize expensive calculations with `useMemo`
- Prevent unnecessary re-renders with `React.memo` and `useCallback`
- Implement virtualization for long lists
- Use code splitting to reduce initial bundle size
- Optimize asset loading and management

```typescript
// Example of proper memoization
function ExpensiveComponent({ data, onItemClick }: Props) {
  // Memoize expensive calculation
  const processedData = useMemo(() => {
    return data.map(item => expensiveProcess(item));
  }, [data]);
  
  // Memoize callback to prevent unnecessary re-renders
  const handleItemClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <ul>
      {processedData.map(item => (
        <li key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// Prevent re-renders when props don't change
export default React.memo(ExpensiveComponent);
```

---

