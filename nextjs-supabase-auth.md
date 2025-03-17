# Supabase Authentication Implementation Guide for Next.js

This guide provides a high-level overview for implementing Supabase authentication in a Next.js application with App Router. It focuses on architecture and key concepts rather than detailed implementation.

## Prerequisites

- A Next.js project with App Router
- Shadcn/UI components installed
- Tailwind CSS configured

## 1. Environment and Package Setup

1. Install the required Supabase SSR package:
   ```bash
   pnpm add @supabase/ssr
   ```

2. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## 2. Directory Structure

Create the following directory structure:

```
src/
├── app/
│   ├── (auth)/                # Auth-related routes
│   │   ├── _components/       # Auth components
│   │   ├── _supabase/         # Supabase client setup
│   │   └── login/             # Login page
│   └── dashboard/             # Protected route example
├── components/
│   ├── auth/                  # Auth-related components
│   ├── ui/                    # UI components (shadcn)
│   └── [other components]     # Navigation, etc.
└── lib/
    └── [utility functions]    # Helper functions
```

## 3. Authentication Components

### Supabase Client Setup

You'll need to create two client implementations:

1. **Browser Client** (`src/app/(auth)/_supabase/client.ts`):
   - Create a browser client using `createBrowserClient` from `@supabase/ssr`
   - Used in client components for auth operations

2. **Server Client** (`src/app/(auth)/_supabase/server.ts`):
   - Create a server client using `createServerClient` from `@supabase/ssr`
   - Handle cookie management for server components
   - Implement proper error handling for cookie operations

### Middleware Setup

1. **Middleware Handler** (`src/app/(auth)/_supabase/middleware.ts`):
   - Create a handler that updates the session using `createServerClient`
   - Manage cookies in the request/response cycle

2. **Root Middleware** (`middleware.ts`):
   - Import and use the middleware handler
   - Configure appropriate matchers to exclude static files

### Auth Components

1. **Login Form** (Client Component):
   - Create a form with email and password inputs
   - Handle form submission with server actions
   - Display error messages from URL parameters

2. **Auth Navigation Items** (Client Component):
   - Show login/logout buttons based on authentication state
   - Implement logout functionality with proper router handling

3. **Protected Routes**:
   - Check authentication status using `supabase.auth.getUser()`
   - Redirect to login page if not authenticated

4. **Configuration Validation**:
   - Create utility to check if Supabase credentials are configured
   - Provide fallback UI when credentials are missing

## 4. Critical Implementation Details

### Authentication Flow

1. **Login Process**:
   - User submits credentials via form
   - Server action validates input and calls `supabase.auth.signInWithPassword()`
   - On success, redirect to dashboard; on failure, redirect to login with error message

2. **Session Management**:
   - Middleware refreshes the session on each request
   - Server components check authentication with `supabase.auth.getUser()`
   - Client components handle UI state based on authentication status

3. **Logout Process**:
   - Call `supabase.auth.signOut()` from client component
   - Refresh router and redirect to home page

### Important Considerations

1. **searchParams Handling**:
   - In Next.js, `searchParams` may be a Promise in some versions
   - Always await `searchParams` before accessing its properties:
   ```typescript
   const resolvedParams = await Promise.resolve(searchParams);
   ```

2. **Cookie Management**:
   - Server components cannot modify cookies directly
   - Expect and handle cookie-related errors in server components
   - Use middleware for reliable cookie management

3. **Security Best Practices**:
   - Always use `supabase.auth.getUser()` instead of `getSession()` for better security
   - Validate environment variables before using them
   - Implement proper error handling for authentication operations

4. **Type Safety**:
   - Use `unknown` instead of `any` for error handling to improve type safety
   - Add proper type checking before accessing properties on unknown objects
   - Example for error handling:
   ```typescript
   try {
     // Authentication code
   } catch (error: unknown) {
     // Type-safe error handling
     console.error("Authentication error:", error);
   }
   ```

5. **Redirect Error Handling**:
   - Next.js uses errors internally to handle redirects
   - These errors will show up in the console if not properly handled
   - Implement proper error handling to filter out redirect errors:
   ```typescript
   try {
     // Check if user is authenticated
     if (data?.user) {
       redirect("/dashboard");
     }
   } catch (error: unknown) {
     // Only log errors that aren't redirect errors
     if (error && typeof error === "object" && "digest" in error &&
         typeof (error as { digest: string }).digest === "string" &&
         (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")) {
       // Redirect errors are expected and can be safely ignored
     } else {
       console.error("Error checking authentication:", error);
     }
   }
   ```

## 5. Testing and Validation

1. **Environment Setup**:
   - Create a Supabase project and configure authentication
   - Add test users in the Supabase dashboard
   - Configure environment variables

2. **Authentication Flow Testing**:
   - Test login with valid credentials
   - Test login with invalid credentials
   - Verify protected routes redirect to login when not authenticated
   - Test logout functionality

3. **Edge Cases**:
   - Test behavior when Supabase credentials are missing
   - Verify error messages are displayed correctly
   - Check session persistence across page refreshes

## 6. Troubleshooting

### Common Issues

1. **Cookie Setting Errors**:
   - Error: "Cookies can only be modified in a Server Action or Route Handler"
   - Solution: This is expected in server components; ensure middleware is handling session refresh

2. **searchParams Errors**:
   - Error: "Route '/login' used `searchParams.message`. `searchParams` should be awaited"
   - Solution: Use `await Promise.resolve(searchParams)` before accessing properties

3. **NEXT_REDIRECT Errors**:
   - Error: "Error checking authentication: Error: NEXT_REDIRECT"
   - Solution: This is expected behavior when redirecting in server components. Filter out these errors in catch blocks:
   ```typescript
   try {
     // Authentication code with redirect
   } catch (error: unknown) {
     // Check if it's a redirect error before logging
     if (!(error && typeof error === "object" && "digest" in error &&
         typeof (error as { digest: string }).digest === "string" &&
         (error as { digest: string }).digest.startsWith("NEXT_REDIRECT"))) {
       console.error("Error:", error);
     }
   }
   ```

4. **Authentication Issues**:
   - Check Supabase URL and anon key are correctly set
   - Verify users exist in Supabase dashboard
   - Ensure middleware is correctly configured

5. **UI State Issues**:
   - Implement proper loading states during authentication
   - Handle router refresh after authentication state changes
   - Use appropriate error boundaries for authentication failures

## 7. Additional Features

Once basic authentication is working, consider implementing:

- Password reset functionality
- Email verification
- Sign-up page
- Social authentication providers
- User profile management
