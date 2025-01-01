# Better Auth Prompt Template

## Installation

```bash
npm install better-auth
```

### Environment Variables
Create a `.env` file with:

```env
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

### Basic Setup
Create an auth instance:

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // Configuration options
});
```

## Core Features

### Email & Password Authentication
Enable in config:

```typescript
emailAndPassword: {
  enabled: true,
  autoSignIn: true
}
```

Sign up example:

```typescript
await authClient.signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe"
});
```

Sign in example:

```typescript
await authClient.signIn.email({
  email: "user@example.com",
  password: "securepassword"
});
```

### Social Authentication
Configure Google provider:

```typescript
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }
}
```

Sign in with Google:

```typescript
await authClient.signIn.social({
  provider: "google"
});
```

### Session Management
Default session configuration:

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7, // 7 days
  updateAge: 60 * 60 * 24 // 1 day
}
```

Get current session:

```typescript
const session = await authClient.getSession();
```

Revoke sessions:

```typescript
// Revoke specific session
await authClient.revokeSession({ token: "session-token" });

// Revoke all other sessions
await authClient.revokeOtherSessions();

// Revoke all sessions
await authClient.revokeSessions();
```

## Advanced Configuration

### Database Options
Supported databases:

```typescript
database: {
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL
    })
  }),
  type: "postgres"
}
```

### Rate Limiting
Default rate limiting:

```typescript
rateLimit: {
  enabled: true,
  window: 10, // seconds
  max: 100 // requests
}
```

### Security Options
Advanced security settings:

```typescript
advanced: {
  useSecureCookies: true,
  disableCSRFCheck: false,
  ipAddress: {
    disableIpTracking: false
  }
}
```

### Hooks
Example database hooks:

```typescript
databaseHooks: {
  user: {
    create: {
      before: async (user) => {
        // Pre-create logic
      },
      after: async (user) => {
        // Post-create logic
      }
    }
  }
}
```

## Plugins
Example two-factor authentication plugin:

```typescript
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [twoFactor()]
});
```

Client-side plugin setup:

```typescript
import { twoFactorClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  plugins: [twoFactorClient({
    twoFactorPage: "/two-factor"
  })]
});
```

## Error Handling
Custom error handling:

```typescript
onAPIError: {
  throw: false,
  onError: (error, ctx) => {
    // Custom error handling
  }
}
```

## Best Practices
1. Always use secure cookies in production
2. Implement rate limiting for authentication endpoints
3. Use environment variables for sensitive configuration
4. Regularly rotate your secret key
5. Implement proper session expiration policies
