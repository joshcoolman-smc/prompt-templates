# Next.js Supabase Authentication Setup

This system prompt will guide you through implementing a complete Supabase authentication system with cookie-based sessions and route protection.

## Prerequisites

- Next.js 13+ app router project
- Supabase project with credentials in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

## Implementation Requirements

### 1. Install Dependencies
Install the required packages:
```bash
pnpm add @supabase/supabase-js @supabase/ssr zod
```

### 2. Supabase Configuration
Create these files with proper TypeScript types and error handling:

- `/src/lib/supabase/client.ts` - Browser client using `createBrowserClient`
- `/src/lib/supabase/server.ts` - Server client with cookie handling using `createServerClient`
- `/src/lib/supabase/middleware.ts` - Session update utilities for middleware

### 3. Middleware Setup
Create `/middleware.ts` at project root:
- Import and use the Supabase middleware utilities
- Protect `/dashboard` routes (redirect unauthenticated users to `/`)
- Configure matcher to exclude static files and images
- Handle session refresh automatically

### 4. Authentication Actions
Create `/src/lib/auth/actions.ts` with server actions:
- `login(formData)` function with Zod validation for email/password
- `logout()` function with session cleanup
- Proper error handling and redirects using `revalidatePath` and `redirect`
- Form validation schema using Zod (email validation, 6+ character password)

### 5. API Routes
Create `/src/app/api/auth/callback/route.ts`:
- Handle OAuth callback and code exchange
- Support for `next` parameter for redirect after auth
- Proper error handling and redirect to error page

### 6. Login Component
Create `/src/components/LoginForm.tsx`:
- Client component with controlled form inputs
- Zod validation on both client and server side
- Loading states and error handling (field-specific + global errors)
- Form submission using server actions
- Accessible form design

### 7. Page Updates
Update these pages:

**`/src/app/page.tsx`:**
- Check authentication status server-side
- Redirect authenticated users to `/dashboard`
- Replace any boilerplate with login interface
- Use the LoginForm component

**`/src/app/dashboard/page.tsx`:**
- Add server-side authentication check
- Redirect unauthenticated users to `/`

### 8. Dashboard Integration
Add logout functionality:
- Create `/src/app/dashboard/components/LogoutButton.tsx`
- Integrate logout button into dashboard header/navigation
- Handle loading states during logout

### 9. Error Handling
Create `/src/app/auth/auth-code-error/page.tsx`:
- Display error message for failed authentication
- Provide link back to login page

## Key Security Considerations

1. **Server-Side Validation**: Always validate on both client and server
2. **Proper Redirects**: Use Next.js `redirect()` and `revalidatePath()`
3. **Cookie Security**: Let Supabase SSR handle secure cookie management
4. **Route Protection**: Use middleware for automatic route protection
5. **Error Handling**: Never expose sensitive information in error messages

## Testing Checklist

After implementation, verify:
- [ ] Unauthenticated users are redirected to login
- [ ] Login form validates email and password properly
- [ ] Successful login redirects to dashboard
- [ ] Failed login shows appropriate error messages
- [ ] Logout works and redirects to login
- [ ] Protected routes are actually protected
- [ ] Session persists across browser refreshes

## Best Practices

1. **Component Organization**: Keep auth components in `/src/components/` or feature folders
2. **Type Safety**: Use TypeScript throughout with proper Supabase types
3. **Error Boundaries**: Handle all error states gracefully
4. **Loading States**: Provide feedback during async operations
5. **Accessibility**: Ensure forms are accessible with proper labels and ARIA attributes
6. **Performance**: Use server components where possible, client components only when needed

This setup provides production-ready authentication with proper security, error handling, and user experience following modern Next.js and Supabase best practices.