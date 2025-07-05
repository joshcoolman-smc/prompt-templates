# Authentication Guide

## Overview

This guide provides comprehensive authentication implementation for Next.js applications using Supabase, covering setup, security patterns, and best practices for production-ready authentication systems.

## Prerequisites

- Next.js 13+ with App Router
- TypeScript configuration
- Supabase project with credentials

## Environment Setup

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

```bash
pnpm add @supabase/supabase-js @supabase/ssr zod
```

⚠️ **Important**: If you're migrating from an older Supabase setup, note that `@supabase/auth-helpers` is now **deprecated**. Use `@supabase/ssr` for all new projects and consider migrating existing projects to the new SSR package for better security and performance.

## Supabase Configuration

### Browser Client

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
```

### Server Client

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting errors in Server Components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal errors in Server Components
          }
        },
      },
    }
  );
};
```

### Middleware Configuration

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
};
```

## Middleware Setup

```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // The updateSession function handles session refresh and user validation
  // It automatically calls supabase.auth.getUser() to revalidate tokens
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## Route Protection Patterns

### Server Component Protection (Recommended)

```typescript
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();
  
  // CRITICAL: Always use getUser() in server components for security
  // Never trust getSession() as cookies can be spoofed
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  );
}
```

### Layout Protection

```typescript
// app/dashboard/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="dashboard-layout">
      <nav>Dashboard Navigation</nav>
      {children}
    </div>
  );
}
```

### API Route Protection

```typescript
// app/api/protected/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Protected API logic here
  return NextResponse.json({ message: 'Success', userId: user.id });
}
```

### Security Best Practices

⚠️ **Critical Security Rules:**

1. **Never use `getSession()` in server-side code** - cookies can be spoofed
2. **Always use `getUser()` for authentication checks** - revalidates tokens server-side  
3. **Protect at the layout level** for efficient route protection
4. **Use Server Components for auth checks** whenever possible
5. **Validate auth in API routes** before processing requests

## Authentication Types

```typescript
// src/lib/auth/types.ts
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthError | null;
}
```

## Validation Schemas

```typescript
// src/lib/auth/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
```

## Authentication Service

```typescript
// src/lib/auth/auth-service.ts
import { createClient } from '@/lib/supabase/client';
import { AuthUser, LoginCredentials, RegisterCredentials } from './types';

export class AuthService {
  private supabase = createClient();

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Authentication failed');
    }

    return this.transformUser(data.user);
  }

  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    const { data, error } = await this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Registration failed');
    }

    return this.transformUser(data.user);
  }

  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }

    return user ? this.transformUser(user) : null;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async resendConfirmation(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  private transformUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      avatar: user.user_metadata?.avatar_url,
      role: user.user_metadata?.role || 'user',
      emailVerified: user.email_confirmed_at != null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}

export const authService = new AuthService();
```

## Server Actions

```typescript
// src/lib/auth/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema, resetPasswordSchema } from './schemas';

export async function loginAction(formData: FormData) {
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validationResult = loginSchema.safeParse(credentials);
  
  if (!validationResult.success) {
    return {
      error: 'Validation failed',
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  
  try {
    const { error } = await supabase.auth.signInWithPassword(validationResult.data);
    
    if (error) {
      return {
        error: error.message,
      };
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
  } catch (error) {
    return {
      error: 'An unexpected error occurred',
    };
  }
}

export async function registerAction(formData: FormData) {
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    name: formData.get('name') as string,
  };

  const validationResult = registerSchema.safeParse(credentials);
  
  if (!validationResult.success) {
    return {
      error: 'Validation failed',
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  
  try {
    const { error } = await supabase.auth.signUp({
      email: validationResult.data.email,
      password: validationResult.data.password,
      options: {
        data: {
          name: validationResult.data.name,
        },
      },
    });
    
    if (error) {
      return {
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Registration successful! Please check your email for verification.',
    };
  } catch (error) {
    return {
      error: 'An unexpected error occurred',
    };
  }
}

export async function logoutAction() {
  const supabase = createClient();
  
  try {
    await supabase.auth.signOut();
    revalidatePath('/');
    redirect('/');
  } catch (error) {
    return {
      error: 'Failed to logout',
    };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;
  
  const validationResult = resetPasswordSchema.safeParse({ email });
  
  if (!validationResult.success) {
    return {
      error: 'Please enter a valid email address',
    };
  }

  const supabase = createClient();
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });
    
    if (error) {
      return {
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.',
    };
  } catch (error) {
    return {
      error: 'Failed to send reset email',
    };
  }
}
```

## Authentication Hook

```typescript
// src/lib/auth/use-auth.ts
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthUser, AuthState } from './types';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error);
          return;
        }

        setUser(session?.user ? transformUser(session.user) : null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ? transformUser(session.user) : null);
        setIsLoading(false);
        setError(null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const transformUser = (user: any): AuthUser => ({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email,
    avatar: user.user_metadata?.avatar_url,
    role: user.user_metadata?.role || 'user',
    emailVerified: user.email_confirmed_at != null,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  });

  const value = {
    user,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## Authentication Components

### Login Form

```typescript
// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const result = await loginAction(formData);
      
      if (result?.error) {
        setError(result.error);
        setFieldErrors(result.fieldErrors || {});
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          required
          error={fieldErrors.email?.[0]}
          disabled={isLoading}
        />
        
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          required
          error={fieldErrors.password?.[0]}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        Sign In
      </Button>
    </form>
  );
}
```

### Register Form

```typescript
// src/components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { registerAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    try {
      const result = await registerAction(formData);
      
      if (result?.error) {
        setError(result.error);
        setFieldErrors(result.fieldErrors || {});
      } else if (result?.success) {
        setSuccess(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Full Name"
          required
          error={fieldErrors.name?.[0]}
          disabled={isLoading}
        />
        
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          required
          error={fieldErrors.email?.[0]}
          disabled={isLoading}
        />
        
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          required
          error={fieldErrors.password?.[0]}
          disabled={isLoading}
        />
        
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          required
          error={fieldErrors.confirmPassword?.[0]}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
          {success}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        Create Account
      </Button>
    </form>
  );
}
```

### Protected Route Component

```typescript
// src/components/auth/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/lib/auth/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
      return;
    }

    if (requiredRole && user && user.role !== requiredRole && user.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }
  }, [user, isLoading, requiredRole, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
```

## API Route Authentication

```typescript
// src/app/api/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (error) {
      console.error('Error exchanging code for session:', error);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
```

## Page Integration

### Login Page

```typescript
// src/app/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function HomePage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
```

### Dashboard Page

```typescript
// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <LogoutButton />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {user.user_metadata?.name || user.email}!
            </h2>
            <p className="text-gray-600">
              You are successfully authenticated and can access this protected dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## Security Best Practices

### Row Level Security (RLS)

```sql
-- Enable RLS on user profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Only admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
```

### Environment Variables Validation

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
```

### Session Management

```typescript
// src/lib/auth/session.ts
import { createClient } from '@/lib/supabase/server';

export async function getSession() {
  const supabase = createClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error.message);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Unexpected session error:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }
  
  return session;
}

export async function requireRole(role: string) {
  const session = await requireAuth();
  
  const userRole = session.user.user_metadata?.role || 'user';
  
  if (userRole !== role && userRole !== 'admin') {
    throw new Error(`Role ${role} required`);
  }
  
  return session;
}
```

## Error Handling

### Authentication Error Boundary

```typescript
// src/components/auth/AuthErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Authentication error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Authentication Error
            </h2>
            <p className="text-gray-600 mb-4">
              Something went wrong with authentication. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Testing Authentication

### Auth Service Tests

```typescript
// __tests__/lib/auth/auth-service.test.ts
import { AuthService } from '@/lib/auth/auth-service';
import { createClient } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client');

const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
  },
};

(createClient as jest.Mock).mockReturnValue(mockSupabase);

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('successfully logs in user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        emailVerified: false,
      });
    });

    it('throws error on failed login', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

## Additional Security Considerations

### Row Level Security (RLS)

Always implement Row Level Security for data protection:

```sql
-- Enable RLS on user profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Only admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
```

### Multi-Factor Authentication (MFA)

Consider implementing MFA for enhanced security:

```typescript
// Enable MFA for a user
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'Work Phone'
});

// Verify MFA challenge
const { data, error } = await supabase.auth.mfa.verify({
  factorId: 'factor-id',
  challengeId: 'challenge-id',
  code: '123456'
});
```

### Rate Limiting and Bot Protection

Configure rate limiting in your Supabase project settings:
- Auth rate limits for login attempts
- Email rate limits for magic links
- CAPTCHA protection for bot detection

## Migration Notes

### From @supabase/auth-helpers

If migrating from the deprecated `@supabase/auth-helpers`:

1. **Install new package**: Replace `@supabase/auth-helpers-nextjs` with `@supabase/ssr`
2. **Update client creation**: Use `createBrowserClient` and `createServerClient`
3. **Rewrite middleware**: Follow the new `updateSession` pattern
4. **Update auth checks**: Always use `getUser()` instead of `getSession()`
5. **Test thoroughly**: Verify all authentication flows work correctly

### Current Status (2024)

✅ **Up-to-date patterns using:**
- `@supabase/ssr` package (current recommended approach)
- Next.js 13+ App Router compatibility
- Secure cookie-based session management
- `getUser()` for server-side auth validation
- Proper middleware implementation for token refresh

⚠️ **Deprecated patterns to avoid:**
- `@supabase/auth-helpers` package
- `getSession()` in server-side code
- Client-side only authentication checks
- LocalStorage-based session management

This comprehensive authentication guide provides production-ready patterns for implementing secure authentication in Next.js applications with Supabase using the latest 2024 best practices.