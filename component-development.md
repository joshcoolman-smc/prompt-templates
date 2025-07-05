# Component Development Guidelines

## Overview

This document provides guidelines for developing React components in Next.js applications using TypeScript and Tailwind CSS v4, focusing on reusability, accessibility, and maintainability.

## Component Architecture

### Component Types

**1. UI Components** - Basic building blocks (buttons, inputs, cards)
**2. Layout Components** - Structural elements (headers, sidebars, containers)
**3. Feature Components** - Business logic components (user profiles, dashboards)
**4. Page Components** - Top-level page components

### Component Organization

```
components/
├── ui/                    # Basic UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── index.ts          # Barrel export
├── layout/               # Layout components
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
└── providers/            # Context providers
    ├── theme-provider.tsx
    └── auth-provider.tsx

features/[feature]/
└── components/           # Feature-specific components
    ├── UserProfile.tsx
    ├── UserSettings.tsx
    └── index.ts
```

## Component Patterns

### Container vs Presentational Components

**Container Components** - Handle data fetching and state management:

```typescript
// features/users/components/UserProfileContainer.tsx
import { useUserWithPosts } from '../hooks/use-user-with-posts';
import { UserProfile } from './UserProfile';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

interface UserProfileContainerProps {
  userId: string;
}

export function UserProfileContainer({ userId }: UserProfileContainerProps) {
  const { data: user, isLoading, error, refetch } = useUserWithPosts(userId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return <UserProfile user={user} />;
}
```

**Presentational Components** - Focus on UI rendering:

```typescript
// features/users/components/UserProfile.tsx
import { UserWithPosts } from '../types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserProfileProps {
  user: UserWithPosts;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-200" />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
            {user.role}
          </Badge>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
        {user.posts.length === 0 ? (
          <p className="text-gray-500">No posts yet</p>
        ) : (
          <div className="space-y-2">
            {user.posts.slice(0, 3).map(post => (
              <div key={post.id} className="p-3 bg-gray-50 rounded">
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
```

### Compound Components

Create flexible, composable components:

```typescript
// components/ui/card.tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

// Usage
export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
      </CardContent>
    </Card>
  );
}
```

## TypeScript Patterns

### Props Interface Definition

Always define explicit props interfaces:

```typescript
// Good: Explicit interface
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant, 
  size, 
  disabled = false, 
  loading = false, 
  children, 
  onClick 
}: ButtonProps) {
  // Component implementation
}

// Better: Extend HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ 
  variant, 
  size, 
  loading = false, 
  className,
  disabled,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'border border-gray-300 bg-white hover:bg-gray-50': variant === 'outline',
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
```

### Generic Components

Create reusable components with generics:

```typescript
// components/ui/data-table.tsx
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "border border-gray-200 px-4 py-2 text-left font-medium",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={cn(
                "hover:bg-gray-50",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="border border-gray-200 px-4 py-2"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Usage
const userColumns: Column<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    render: (value) => (
      <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
];

export function UserTable({ users }: { users: User[] }) {
  return (
    <DataTable
      data={users}
      columns={userColumns}
      onRowClick={(user) => console.log('User clicked:', user)}
      emptyMessage="No users found"
    />
  );
}
```

## Performance Optimization

### Memoization

Use React.memo for expensive components:

```typescript
// components/ui/user-card.tsx
import React from 'react';
import { User } from '@/types';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export const UserCard = React.memo(function UserCard({
  user,
  onEdit,
  onDelete,
}: UserCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      <div className="mt-3 flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(user)}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
});
```

### Callback Optimization

Use useCallback for stable references:

```typescript
// features/users/components/UserList.tsx
import { useCallback, useMemo } from 'react';
import { UserCard } from '@/components/ui/user-card';

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserList({ users, onEditUser, onDeleteUser }: UserListProps) {
  // Memoize expensive computations
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleEditUser = useCallback((user: User) => {
    onEditUser(user);
  }, [onEditUser]);

  const handleDeleteUser = useCallback((user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      onDeleteUser(user);
    }
  }, [onDeleteUser]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedUsers.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      ))}
    </div>
  );
}
```

## Form Components

### Controlled Components

Create reusable form components:

```typescript
// components/ui/form-input.tsx
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  helperText,
  required,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${props.id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Usage in forms
export function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form className="space-y-4">
      <FormInput
        id="name"
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        required
      />
      <FormInput
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
        required
      />
    </form>
  );
}
```

### Form Validation

Integrate with form libraries:

```typescript
// components/ui/form-field.tsx
import { useFormContext } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  children: React.ReactElement;
  required?: boolean;
}

export function FormField({ name, label, children, required }: FormFieldProps) {
  const { formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {React.cloneElement(children, {
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': error ? `${name}-error` : undefined,
      })}
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
```

## Accessibility Guidelines

### Semantic HTML

Use proper semantic elements:

```typescript
// components/ui/modal.tsx
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black backdrop:opacity-50 rounded-lg p-6 max-w-md w-full"
      onClose={onClose}
    >
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>
      <div>{children}</div>
    </dialog>
  );
}
```

### Keyboard Navigation

Implement proper keyboard support:

```typescript
// components/ui/dropdown.tsx
import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    value: string;
    onClick: () => void;
  }>;
}

export function Dropdown({ trigger, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setActiveIndex(prev => 
            prev < items.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setActiveIndex(prev => 
            prev > 0 ? prev - 1 : items.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (activeIndex >= 0) {
            items[activeIndex].onClick();
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, items]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>
      
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={item.value}
              className={cn(
                "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100",
                activeIndex === index && "bg-gray-100"
              )}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              role="menuitem"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Tailwind CSS Best Practices

### Design System Integration

Create consistent design tokens:

```typescript
// lib/design-tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      500: '#6b7280',
      600: '#4b5563',
      900: '#111827',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  typography: {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  },
} as const;

// Usage in components
export function Button({ variant, size, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Responsive Design

Implement mobile-first responsive design:

```typescript
// components/layout/responsive-grid.tsx
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gridClasses = cn(
    'grid',
    {
      'gap-2': gap === 'sm',
      'gap-4': gap === 'md',
      'gap-6': gap === 'lg',
    },
    columns.sm && `grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}
```

## Testing Components

### Component Testing Setup

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button variant="primary" size="md">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        Click me
      </Button>
    );
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(
      <Button variant="primary" size="md" loading>
        Click me
      </Button>
    );
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

This guide provides comprehensive patterns for building maintainable, accessible, and performant React components in Next.js applications.