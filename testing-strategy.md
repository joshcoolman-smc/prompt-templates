# Testing Strategy Guidelines

## Overview

This document outlines comprehensive testing strategies for Next.js applications using TypeScript, with **Test-Driven Development (TDD)** as the primary approach for all feature development.

## TDD-First Development (Primary AI Approach)

### ⚡ Start Every Feature with Tests

**Rule: Always write tests BEFORE implementation.** This is the default development pattern for AI-assisted development.

### TDD Cycle for New Features

```bash
# 1. Create test files FIRST
mkdir -p __tests__/features/auth
touch __tests__/features/auth/auth-service.test.ts
touch __tests__/features/auth/login-form.test.tsx

# 2. Write comprehensive failing tests
npm test -- --testPathPattern=auth  # Verify they fail properly

# 3. Implement minimal code to make tests pass
# 4. Refactor while keeping tests green
# 5. Repeat cycle for each component/service
```

### Benefits of TDD-First Approach

1. **Clear Success Criteria** - Tests define exactly what "done" means
2. **Better Design** - Forces you to think about interfaces first
3. **Immediate Feedback** - Red/Green cycle provides instant validation
4. **Documentation** - Tests serve as living documentation
5. **AI-Friendly** - Provides concrete targets for implementation

### TDD Implementation Pattern

```typescript
// STEP 1: Write failing test (RED)
describe('AuthService', () => {
  it('should login user with valid credentials', async () => {
    const authService = new AuthService();
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });
});

// STEP 2: Run test - it should FAIL
// npm test -- --testPathPattern=auth-service

// STEP 3: Write minimal implementation (GREEN)
// STEP 4: Refactor while keeping tests green
```

## Testing Philosophy

### Testing Pyramid

**Unit Tests (70%)** - Test individual functions, components, and modules
**Integration Tests (20%)** - Test interactions between components and services
**End-to-End Tests (10%)** - Test complete user workflows

### Core Testing Principles

1. **Write Tests First** - TDD is the default approach, not optional
2. **Test Behavior, Not Implementation** - Focus on what the code does, not how it does it
3. **Keep Tests Simple** - Each test should verify one specific behavior
4. **Maintain Test Independence** - Tests should not depend on each other
5. **Test Edge Cases** - Include error conditions and boundary cases

## Testing Stack

### Core Testing Libraries

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "playwright": "^1.40.0",
    "msw": "^2.0.0",
    "vitest": "^1.0.0"
  }
}
```

### Test Configuration

```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/app/layout.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

```typescript
// jest.setup.js
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Unit Testing

### Testing Utilities and Services

```typescript
// __tests__/lib/utils.test.ts
import { formatDate, validateEmail, calculateAge } from '@/lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      expect(formatDate(date)).toBe('December 25, 2023');
    });

    it('handles invalid dates', () => {
      expect(() => formatDate(new Date('invalid'))).toThrow('Invalid date');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('calculateAge', () => {
    it('calculates age correctly', () => {
      const birthDate = new Date('1990-01-01');
      const referenceDate = new Date('2023-01-01');
      expect(calculateAge(birthDate, referenceDate)).toBe(33);
    });

    it('handles future birth dates', () => {
      const birthDate = new Date('2030-01-01');
      const referenceDate = new Date('2023-01-01');
      expect(calculateAge(birthDate, referenceDate)).toBe(0);
    });
  });
});
```

### Testing Services with Mocking

```typescript
// __tests__/features/users/service/user-service.test.ts
import { UserServiceImpl } from '@/features/users/service/user-service';
import { UserRepository } from '@/features/users/repository/user-repository';
import { PostRepository } from '@/features/posts/repository/post-repository';
import { NotFoundError } from '@/lib/errors';

// Mock repositories
const mockUserRepository: jest.Mocked<UserRepository> = {
  getUserById: jest.fn(),
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

const mockPostRepository: jest.Mocked<PostRepository> = {
  getPostsByUserId: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

describe('UserService', () => {
  let userService: UserServiceImpl;

  beforeEach(() => {
    userService = new UserServiceImpl(mockUserRepository, mockPostRepository);
    jest.clearAllMocks();
  });

  describe('getUserWithPosts', () => {
    it('returns user with posts when user exists', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user' as const,
        status: 'active' as const,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const mockPosts = [
        { id: '1', title: 'Post 1', userId: '1' },
        { id: '2', title: 'Post 2', userId: '1' },
      ];

      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockPostRepository.getPostsByUserId.mockResolvedValue(mockPosts);

      const result = await userService.getUserWithPosts('1');

      expect(result).toEqual({ ...mockUser, posts: mockPosts });
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith('1');
      expect(mockPostRepository.getPostsByUserId).toHaveBeenCalledWith('1');
    });

    it('throws NotFoundError when user does not exist', async () => {
      mockUserRepository.getUserById.mockResolvedValue(null);

      await expect(userService.getUserWithPosts('nonexistent'))
        .rejects
        .toThrow(NotFoundError);

      expect(mockUserRepository.getUserById).toHaveBeenCalledWith('nonexistent');
      expect(mockPostRepository.getPostsByUserId).not.toHaveBeenCalled();
    });

    it('handles repository errors gracefully', async () => {
      mockUserRepository.getUserById.mockRejectedValue(new Error('Database error'));

      await expect(userService.getUserWithPosts('1'))
        .rejects
        .toThrow('Failed to fetch user with posts');
    });
  });

  describe('promoteToAdmin', () => {
    it('promotes user to admin role', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user' as const,
        status: 'active' as const,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const promotedUser = { ...mockUser, role: 'admin' as const };

      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue(promotedUser);

      const result = await userService.promoteToAdmin('1');

      expect(result).toEqual(promotedUser);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith('1', { role: 'admin' });
    });

    it('returns user unchanged if already admin', async () => {
      const mockAdminUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin' as const,
        status: 'active' as const,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockUserRepository.getUserById.mockResolvedValue(mockAdminUser);

      const result = await userService.promoteToAdmin('1');

      expect(result).toEqual(mockAdminUser);
      expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    });
  });
});
```

## Component Testing

### Testing Presentational Components

```typescript
// __tests__/components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text and variant', () => {
    render(
      <Button variant="primary" size="md">
        Click me
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // Primary variant class
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(
      <Button variant="primary" size="md" loading>
        Submit
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    
    // Check for loading spinner
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('applies disabled state', () => {
    render(
      <Button variant="primary" size="md" disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });

  it('forwards HTML attributes', () => {
    render(
      <Button variant="primary" size="md" data-testid="custom-button">
        Test
      </Button>
    );

    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
  });
});
```

### Testing Container Components

```typescript
// __tests__/features/users/components/UserProfileContainer.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfileContainer } from '@/features/users/components/UserProfileContainer';
import { useUserWithPosts } from '@/features/users/hooks/use-user-with-posts';

// Mock the hook
jest.mock('@/features/users/hooks/use-user-with-posts');

const mockUseUserWithPosts = useUserWithPosts as jest.MockedFunction<typeof useUserWithPosts>;

describe('UserProfileContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    mockUseUserWithPosts.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<UserProfileContainer userId="1" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state with retry option', () => {
    const mockRefetch = jest.fn();
    mockUseUserWithPosts.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch user'),
      refetch: mockRefetch,
    });

    render(<UserProfileContainer userId="1" />);

    expect(screen.getByText('Failed to fetch user')).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);
    
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders user profile when data is available', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user' as const,
      status: 'active' as const,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      posts: [
        { id: '1', title: 'Test Post', excerpt: 'Test excerpt' },
      ],
    };

    mockUseUserWithPosts.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<UserProfileContainer userId="1" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
  });

  it('shows not found message when user does not exist', () => {
    mockUseUserWithPosts.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<UserProfileContainer userId="nonexistent" />);

    expect(screen.getByText('User not found')).toBeInTheDocument();
  });
});
```

### Testing Forms

```typescript
// __tests__/features/users/components/UserForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from '@/features/users/components/UserForm';

describe('UserForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<UserForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText('Email *');
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText('Name *'), 'John Doe');
    await user.type(screen.getByLabelText('Email *'), 'john@example.com');
    await user.selectOptions(screen.getByLabelText('Role'), 'admin');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
      });
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} loading />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });

  it('populates form when editing existing user', () => {
    const existingUser = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'user' as const,
    };

    render(<UserForm onSubmit={mockOnSubmit} initialData={existingUser} />);

    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user')).toBeInTheDocument();
  });
});
```

## Integration Testing

### Testing API Routes

```typescript
// __tests__/api/users.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/users/route';
import { UserRepository } from '@/features/users/repository/user-repository';

// Mock the repository
jest.mock('@/features/users/repository/user-repository');

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('returns list of users', async () => {
      const mockUsers = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
      ];

      (UserRepository.prototype.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockUsers);
    });

    it('handles repository errors', async () => {
      (UserRepository.prototype.getUsers as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Internal server error',
      });
    });
  });

  describe('POST /api/users', () => {
    it('creates a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
      };

      const createdUser = {
        id: '3',
        ...newUser,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      (UserRepository.prototype.createUser as jest.Mock).mockResolvedValue(createdUser);

      const { req, res } = createMocks({
        method: 'POST',
        body: newUser,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual(createdUser);
    });

    it('validates request body', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: '',
          email: 'invalid-email',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Validation failed',
        fieldErrors: {
          name: ['Name is required'],
          email: ['Please enter a valid email address'],
        },
      });
    });
  });
});
```

### Testing with MSW (Mock Service Worker)

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
      ])
    );
  }),

  rest.post('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '3',
        name: 'New User',
        email: 'new@example.com',
      })
    );
  }),

  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    if (id === '404') {
      return res(ctx.status(404));
    }
    
    return res(
      ctx.json({
        id,
        name: 'John Doe',
        email: 'john@example.com',
      })
    );
  }),
];
```

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## End-to-End Testing

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// e2e/user-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/users');
  });

  test('displays user list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Users');
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(2);
  });

  test('creates new user', async ({ page }) => {
    await page.click('[data-testid="add-user-button"]');
    
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.selectOption('[data-testid="role-select"]', 'user');
    
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('.success-message')).toContainText('User created successfully');
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(3);
  });

  test('validates form fields', async ({ page }) => {
    await page.click('[data-testid="add-user-button"]');
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('.error-message')).toContainText('Name is required');
    await expect(page.locator('.error-message')).toContainText('Email is required');
  });

  test('edits existing user', async ({ page }) => {
    await page.click('[data-testid="user-card"]:first-child [data-testid="edit-button"]');
    
    await page.fill('[data-testid="name-input"]', 'Updated Name');
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('.success-message')).toContainText('User updated successfully');
    await expect(page.locator('[data-testid="user-card"]:first-child')).toContainText('Updated Name');
  });

  test('deletes user with confirmation', async ({ page }) => {
    const initialCount = await page.locator('[data-testid="user-card"]').count();
    
    await page.click('[data-testid="user-card"]:first-child [data-testid="delete-button"]');
    
    // Handle confirmation dialog
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });
    
    await page.click('[data-testid="confirm-delete"]');
    
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(initialCount - 1);
  });
});
```

## Test Data Management

### Factory Functions

```typescript
// __tests__/factories/user-factory.ts
import { User } from '@/features/users/types';

export function createUser(overrides?: Partial<User>): User {
  return {
    id: `user-${Math.random().toString(36).substring(2, 9)}`,
    name: `Test User ${Math.floor(Math.random() * 1000)}`,
    email: `test${Math.floor(Math.random() * 1000)}@example.com`,
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createUsers(count: number, overrides?: Partial<User>): User[] {
  return Array.from({ length: count }, () => createUser(overrides));
}

export function createAdminUser(overrides?: Partial<User>): User {
  return createUser({ role: 'admin', ...overrides });
}
```

### Database Seeding for Tests

```typescript
// __tests__/setup/database.ts
import { PrismaClient } from '@prisma/client';
import { createUsers } from '../factories/user-factory';

const prisma = new PrismaClient();

export async function seedTestDatabase() {
  // Clear existing data
  await prisma.user.deleteMany();
  
  // Create test users
  const users = createUsers(10);
  await prisma.user.createMany({ data: users });
  
  // Create admin user
  const adminUser = createAdminUser({ email: 'admin@example.com' });
  await prisma.user.create({ data: adminUser });
}

export async function cleanupTestDatabase() {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
}
```

## Performance Testing

### Testing Component Performance

```typescript
// __tests__/performance/component-performance.test.tsx
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { UserList } from '@/features/users/components/UserList';
import { createUsers } from '../factories/user-factory';

describe('UserList Performance', () => {
  it('renders large user list within performance threshold', () => {
    const users = createUsers(1000);
    
    const startTime = performance.now();
    render(<UserList users={users} />);
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(100); // Should render within 100ms
  });
});
```

## Testing Guidelines

### Best Practices

1. **Test File Organization**
   - Mirror src directory structure in __tests__
   - Use descriptive test names
   - Group related tests with describe blocks

2. **Test Data**
   - Use factories for consistent test data
   - Create minimal test data for each test
   - Clean up after each test

3. **Assertions**
   - Use specific assertions
   - Test one thing per test
   - Include both positive and negative test cases

4. **Mocking**
   - Mock external dependencies
   - Use MSW for API mocking
   - Mock at the right level (service vs repository)

5. **Async Testing**
   - Use waitFor for async operations
   - Handle loading states
   - Test error conditions

### Common Patterns

```typescript
// Testing hooks
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/use-counter';

test('useCounter hook', () => {
  const { result } = renderHook(() => useCounter(0));
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

```typescript
// Testing with React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '@/features/users/hooks/use-users';

test('useUsers hook', async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useUsers(), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toHaveLength(2);
});
```

This comprehensive testing strategy ensures reliable, maintainable applications with high test coverage and confidence in code quality.