# Supabase Authentication Setup for Next.js

This guide walks through implementing Supabase authentication in a Next.js application with App Router. It follows the pattern used in the baseline project.

## Prerequisites

- A Next.js project with App Router
- Shadcn/UI components installed
- Tailwind CSS configured

## 1. Environment Setup

Create a `.env.local` file in your project root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 2. Install Required Dependencies

```bash
pnpm add @supabase/ssr
```

## 3. Directory Structure

Create the following directory structure:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── _components/
│   │   │   ├── login-form.tsx
│   │   │   └── submit-button.tsx
│   │   ├── _supabase/
│   │   │   ├── client.ts
│   │   │   ├── middleware.ts
│   │   │   └── server.ts
│   │   └── login/
│   │       └── page.tsx
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── auth/
│   │   └── check-supabase-config.tsx
│   ├── auth-nav-items.tsx
│   ├── global-nav.tsx
│   ├── missing-credentials.tsx
│   └── user-info.tsx
└── lib/
    └── supabase-utils.ts
```

## 4. Supabase Client Setup

### Browser Client (`src/app/(auth)/_supabase/client.ts`)

```typescript
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

### Server Client (`src/app/(auth)/_supabase/server.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return await cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
```

## 5. Middleware Setup

### Middleware Handler (`src/app/(auth)/_supabase/middleware.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

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
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
};
```

### Root Middleware (`middleware.ts`)

```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/app/(auth)/_supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## 6. Utility Functions

### Supabase Config Check (`src/lib/supabase-utils.ts`)

```typescript
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

## 7. Auth Components

### Config Check Component (`src/components/auth/check-supabase-config.tsx`)

```typescript
import { isSupabaseConfigured } from "@/lib/supabase-utils";
import { MissingCredentials } from "@/components/missing-credentials";
import { ReactNode } from "react";

interface CheckSupabaseConfigProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export async function CheckSupabaseConfig({
  children,
  fallback,
}: CheckSupabaseConfigProps) {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return fallback ?? <MissingCredentials />;
  }

  return children;
}
```

### Missing Credentials Component (`src/components/missing-credentials.tsx`)

```typescript
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code } from "lucide-react";

export function MissingCredentials() {
  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-6">
      <Alert variant="destructive">
        <Code className="h-4 w-4" />
        <AlertTitle>Missing Supabase Credentials</AlertTitle>
        <AlertDescription>
          Your application is not properly configured with Supabase credentials.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Setup Required</CardTitle>
          <CardDescription>
            Follow these steps to enable authentication in your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. Create a Supabase Project</h3>
            <p className="text-sm text-muted-foreground">
              Visit{" "}
              <a
                href="https://supabase.com"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                supabase.com
              </a>{" "}
              and create a new project
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">2. Configure Environment Variables</h3>
            <p className="text-sm text-muted-foreground">
              Create a{" "}
              <code className="px-1 py-0.5 bg-muted rounded">.env.local</code>{" "}
              file in your project root with:
            </p>
            <pre className="p-4 rounded bg-muted text-sm">
              <code>{`NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">3. Create Users</h3>
            <p className="text-sm text-muted-foreground">
              Go to Authentication &gt; Users in the Supabase dashboard to
              manually add users with email/password
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">4. Restart Your Application</h3>
            <p className="text-sm text-muted-foreground">
              After adding the environment variables, restart your Next.js
              development server
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Submit Button Component (`src/app/(auth)/_components/submit-button.tsx`)

```typescript
"use client";
import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText,
  className = "",
  ...props
}: Props) {
  const { pending, action } = useFormStatus();
  const isPending = pending && action === props.formAction;

  return (
    <Button {...props} type="submit" disabled={pending} className={className}>
      {isPending ? pendingText : children}
    </Button>
  );
}
```

### Login Form Component (`src/app/(auth)/_components/login-form.tsx`)

```typescript
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "./submit-button";

interface LoginFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  errorMessage?: string | null;
}

export function LoginForm({ onSubmit, errorMessage }: LoginFormProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center pt-24">
      <div className="w-full max-w-md space-y-6">
        <Card className="border bg-zinc-50 dark:bg-zinc-700">
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-black dark:text-zinc-200"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="border-zinc-500 bg-zinc-50/5 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 placeholder:text-zinc-700 dark:placeholder:text-zinc-400 py-5 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-zinc-900 dark:text-zinc-300"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    className="border-zinc-500 bg-zinc-50/5 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 placeholder:text-zinc-700 dark:placeholder:text-zinc-400 py-5 px-4"
                  />
                </div>

                <SubmitButton
                  formAction={onSubmit}
                  pendingText="Signing in..."
                  className="w-full bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Sign in
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>

        {errorMessage && (
          <Alert
            variant="destructive"
            className="bg-red-950/20 border-red-900/20"
          >
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <Button
            variant="link"
            asChild
            className="text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## 8. Auth Pages

### Login Page (`src/app/(auth)/login/page.tsx`)

```typescript
import { createClient } from "@/app/(auth)/_supabase/server";
import { redirect } from "next/navigation";
import { CheckSupabaseConfig } from "@/components/auth/check-supabase-config";
import { LoginForm } from "../_components/login-form";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <CheckSupabaseConfig>
      <LoginContent searchParams={searchParams} />
    </CheckSupabaseConfig>
  );
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();

  // Check if user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return redirect("/login?message=Please provide both email and password");
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    return redirect("/dashboard");
  };

  const resolvedParams = await searchParams;
  const message = resolvedParams?.message
    ? Array.isArray(resolvedParams.message)
      ? resolvedParams.message[0]
      : resolvedParams.message
    : null;

  return <LoginForm onSubmit={signIn} errorMessage={message} />;
}
```

## 9. Protected Routes

### Dashboard Page (`src/app/dashboard/page.tsx`)

```typescript
import { createClient } from "@/app/(auth)/_supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login?message=Please sign in to access the dashboard");
  }

  return (
    <div className="p-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          Dashboard
          <span className="block text-sm font-normal text-slate-500">
            (Protected Route)
          </span>
        </h1>
      </div>
    </div>
  );
}
```

## 10. Navigation Components

### User Info Component (`src/components/user-info.tsx`)

```typescript
"use client";

interface UserInfoProps {
  email: string | null;
}

export function UserInfo({ email }: UserInfoProps) {
  if (!email) return null;

  return <p className="text-xs text-muted-foreground">{email}</p>;
}
```

### Auth Nav Items Component (`src/components/auth-nav-items.tsx`)

```typescript
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/app/(auth)/_supabase/client";

interface AuthNavItemsProps {
  email: string | null;
  isAuthenticated: boolean;
}

export function AuthNavItems({ email, isAuthenticated }: AuthNavItemsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      // Ensure router refresh completes before navigation
      await Promise.all([
        new Promise((resolve) => {
          router.refresh();
          // Give the refresh some time to complete
          setTimeout(resolve, 100);
        }),
      ]);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <Button
          variant="ghost"
          className={
            pathname === "/dashboard" ? "underline underline-offset-4" : ""
          }
          asChild
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoading}
          className="disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Signing out..." : "Logout"}
        </Button>
      </>
    );
  }

  return (
    <Button variant="ghost" asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}
```

### Global Nav Component (`src/components/global-nav.tsx`)

```typescript
import { createClient } from "@/app/(auth)/_supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthNavItems } from "@/components/auth-nav-items";
import { UserInfo } from "@/components/user-info";
import { CheckSupabaseConfig } from "@/components/auth/check-supabase-config";
import Link from "next/link";

function GlobalNavContent({
  isAuthenticated,
  email,
}: {
  isAuthenticated: boolean;
  email: string | null;
}) {
  return (
    <nav className="flex justify-between items-center p-4 bg-zinc-200 dark:bg-zinc-900">
      <div>
        <Link
          href="/"
          className="text-zinc-900 dark:text-zinc-300 text-2xl font-bold hover:opacity-80"
        >
          Baseline
        </Link>
        <UserInfo email={email} />
      </div>
      <div className="flex items-center gap-4">
        <AuthNavItems isAuthenticated={isAuthenticated} email={email} />
        <ThemeToggle />
      </div>
    </nav>
  );
}

function GlobalNavFallback() {
  return (
    <nav className="flex justify-between items-center p-4 bg-zinc-200 dark:bg-zinc-900">
      <div>
        <Link
          href="/"
          className="text-zinc-900 dark:text-zinc-300 text-2xl font-bold hover:opacity-80"
        >
          Baseline
        </Link>
        <UserInfo email={null} />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </nav>
  );
}

export async function GlobalNav() {
  return (
    <CheckSupabaseConfig fallback={<GlobalNavFallback />}>
      <GlobalNavServer />
    </CheckSupabaseConfig>
  );
}

async function GlobalNavServer() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = !!session;
  const email = session?.user?.email ?? null;

  return <GlobalNavContent isAuthenticated={isAuthenticated} email={email} />;
}
```

## 11. Supabase Project Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Set up authentication:
   - Go to Authentication > Settings
   - Configure Email provider settings
   - Set up redirect URLs (e.g., http://localhost:3000/auth/callback)
3. Create users:
   - Go to Authentication > Users
   - Add users manually or enable sign-up in your app

## 12. Testing Authentication

1. Start your Next.js development server
2. Navigate to `/login`
3. Enter credentials for a user you created in Supabase
4. Upon successful login, you should be redirected to `/dashboard`
5. Test the logout functionality from the navigation bar

## Additional Features to Implement

- Password reset functionality
- Email verification
- Sign-up page
- Social authentication providers
- User profile management


