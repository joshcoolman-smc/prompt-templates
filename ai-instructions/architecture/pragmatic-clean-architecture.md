# Pragmatic Clean Architecture for Next.js

A simplified, practical approach to organizing Next.js applications using feature modules, interface-driven design, and clear separation of concerns.

## Core Philosophy

**Organize by feature, not by technical type.** Group everything related to a feature together rather than scattering repositories, services, and components across different directories.

**Use interfaces to define contracts, implementations to fulfill them.** This enables flexibility, testability, and clear architectural boundaries without over-engineering.

## Feature Module Pattern

Each feature is self-contained with clear layers:

```
features/
  user-management/
    components/      # React UI components
    hooks/           # React state & integration
    services/        # Business logic
    repositories/    # Data access
    types/           # TypeScript definitions
```

## Three-Layer Architecture

### 1. Repository Layer (Data Access)

**Purpose:** Abstract away data sources (APIs, databases, local storage)

**Pattern:** Interface defines the contract, class implements it

```typescript
// Define what data operations are available
interface UserRepository {
  findById(id: string): Promise<User | null>
  findAll(): Promise<User[]>
  save(user: User): Promise<User>
}

// Implement how to actually get the data
class ApiUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    // Fetch from API
  }
}
```

**Key Points:**
- Repositories only handle data access, no business logic
- Components never call repositories directly
- Easy to swap implementations (API → Mock → Database)

### 2. Service Layer (Business Logic)

**Purpose:** Orchestrate business rules, coordinate multiple repositories

**Pattern:** Interface for behavior, implementation for logic

```typescript
// Define business capabilities
interface UserService {
  getUserProfile(id: string): Promise<UserProfile>
  promoteToAdmin(id: string): Promise<void>
}

// Implement business rules
class UserServiceImpl implements UserService {
  constructor(
    private userRepo: UserRepository,
    private activityRepo: ActivityRepository
  ) {}

  async getUserProfile(id: string): Promise<UserProfile> {
    const user = await this.userRepo.findById(id)
    const recentActivity = await this.activityRepo.getRecent(id)
    // Combine and transform data according to business rules
    return buildProfile(user, recentActivity)
  }
}
```

**Key Points:**
- Services contain business logic and data transformation
- Can combine multiple repositories
- Components never contain business logic
- Injected with their dependencies (repositories)

### 3. Hooks Layer (React Integration)

**Purpose:** Connect React components to services, manage UI state

**Pattern:** Custom hooks that encapsulate service calls and state

```typescript
interface UseUserProfileResult {
  profile: UserProfile | null
  isLoading: boolean
  error: Error | null
  refresh: () => void
}

function useUserProfile(userId: string, service: UserService): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Handle loading, errors, state updates
  // Call the service
  // Return consistent shape
}
```

**Key Points:**
- Hooks manage React-specific concerns (state, effects, lifecycle)
- Service is passed in as a parameter (dependency injection)
- Components stay simple and focused on UI

## Interface-Implementation Pattern

### Why Interfaces?

**Flexibility:** Swap implementations without changing consuming code
**Testability:** Easy to create mock implementations
**Clarity:** Contract is explicit and documented
**TypeScript:** Catch errors at compile time

### The Pattern

```typescript
// 1. Define the interface (what can be done)
interface PaymentProcessor {
  processPayment(amount: number): Promise<PaymentResult>
  refund(transactionId: string): Promise<void>
}

// 2. Create implementation (how it's done)
class StripePaymentProcessor implements PaymentProcessor {
  // Implementation details
}

// 3. Alternative implementation
class MockPaymentProcessor implements PaymentProcessor {
  // Test implementation
}

// 4. Components depend on interface, not implementation
function usePayment(processor: PaymentProcessor) {
  // Works with any implementation
}
```

### When to Use

- **Repositories:** Always use interfaces (data access will vary)
- **Services:** Use interfaces when business logic may have variants
- **Utilities:** Usually don't need interfaces (pure functions)

## Dependency Injection

### Simple Service Container

Centralize how services are created and wired together:

```typescript
class ServiceContainer {
  private static instance: ServiceContainer

  private userService: UserService

  private constructor() {
    // Wire up dependencies
    const userRepo = new ApiUserRepository()
    const activityRepo = new ApiActivityRepository()

    this.userService = new UserServiceImpl(userRepo, activityRepo)
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ServiceContainer()
    }
    return this.instance
  }

  getUserService(): UserService {
    return this.userService
  }
}
```

### Using in Components

```typescript
function UserProfile({ userId }: Props) {
  const userService = ServiceContainer.getInstance().getUserService()
  const { profile, isLoading } = useUserProfile(userId, userService)

  // Render UI
}
```

**Benefits:**
- Single place to configure dependencies
- Easy to swap implementations
- Testable (can provide different container for tests)

## TypeScript Patterns

### Type Definitions

Keep types close to their feature:

```typescript
// features/user-management/types/user.ts
export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

export interface UserProfile extends User {
  activityScore: number
  lastActive: Date
}

// Input types for creation/updates
export type CreateUserInput = Omit<User, 'id'>
export type UpdateUserInput = Partial<User>
```

### Runtime Validation with Zod

Validate at boundaries (API responses, form inputs):

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'user'])
})

// Use for validation
const user = UserSchema.parse(apiResponse)

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>
```

## Next.js Integration

### Server vs Client Components

**Server Components (default):**
- Page routes (always)
- Data fetching
- Authentication checks
- SEO-critical content

**Client Components (`'use client'`):**
- Interactivity and state
- Event handlers
- Browser APIs

### Page Component Pattern

```typescript
// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  // Server-side data fetching
  const users = await fetchUsers()

  // Pass to client component for interactivity
  return <UserList initialUsers={users} />
}

// components/UserList.tsx (Client Component)
'use client'

export function UserList({ initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers)
  // Interactive state management
}
```

### Server Actions for Mutations

```typescript
// features/users/actions.ts
'use server'

export async function createUser(formData: FormData) {
  // Validate
  // Call service
  // Revalidate
  // Return result or error
}
```

## Practical Guidelines

### Start Simple

Begin with basic structure, add complexity only when needed:
1. Create feature directory
2. Add types
3. Add repository if needed
4. Add service if there's business logic
5. Add hooks for React integration
6. Build components

### When to Add Each Layer

**Repository:**
- When you need to fetch or persist data
- When you might swap data sources

**Service:**
- When you have business logic beyond CRUD
- When combining multiple data sources
- When transforming data for specific use cases

**Hooks:**
- When components need to interact with services
- When sharing state logic across components

### Keep It Pragmatic

Don't over-engineer:
- Simple CRUD? Repository + hook might be enough
- Complex business rules? Add service layer
- Pure UI component? No need for any of this

## Example: Complete Feature

```typescript
// types/
export interface Todo {
  id: string
  text: string
  completed: boolean
}

// repositories/
interface TodoRepository {
  getAll(): Promise<Todo[]>
  save(todo: Todo): Promise<Todo>
}

class ApiTodoRepository implements TodoRepository {
  // Fetch from API
}

// services/
interface TodoService {
  getIncompleteTodos(): Promise<Todo[]>
  completeTodo(id: string): Promise<void>
}

class TodoServiceImpl implements TodoService {
  constructor(private repo: TodoRepository) {}

  async getIncompleteTodos(): Promise<Todo[]> {
    const all = await this.repo.getAll()
    return all.filter(t => !t.completed)
  }
}

// hooks/
function useTodos(service: TodoService) {
  // State management
  // Call service
  // Return data
}

// components/
function TodoList() {
  const service = useServiceContainer().getTodoService()
  const { todos, complete } = useTodos(service)

  // Render
}
```

## Key Takeaways

1. **Feature modules keep related code together**
2. **Interfaces define contracts, implementations fulfill them**
3. **Three layers: Repository (data), Service (logic), Hooks (React)**
4. **Dependency injection through simple service container**
5. **TypeScript for type safety, Zod for runtime validation**
6. **Server Components for pages, Client Components for interactivity**
7. **Keep it pragmatic - add complexity only when needed**

This architecture scales from simple to complex while maintaining clarity and testability.
