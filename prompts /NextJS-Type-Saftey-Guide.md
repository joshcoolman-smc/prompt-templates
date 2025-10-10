# TypeScript Type Safety Guide

A comprehensive guide to writing type-safe TypeScript code, distilled from real-world debugging and production build fixes.

## Table of Contents

1. [Error Handling](#error-handling)
2. [Next.js 15+ Route Handlers](#nextjs-15-route-handlers)
3. [Null and Undefined Handling](#null-and-undefined-handling)
4. [Dynamic Imports and Type Inference](#dynamic-imports-and-type-inference)
5. [API Response Types](#api-response-types)
6. [Database Type Mapping](#database-type-mapping)
7. [ESLint Configuration](#eslint-configuration)

---

## Error Handling

### ❌ BAD: Using `any` type in catch blocks

```typescript
try {
  await someOperation();
} catch (error: any) {
  console.error(error.message);
}
```

### ✅ GOOD: Proper error type assertion

```typescript
try {
  await someOperation();
} catch (err) {
  const error = err as Error;
  console.error(error.message);
}
```

**Why:** TypeScript doesn't know what type will be thrown. Using `err as Error` is safer than `any` and communicates intent.

### ✅ ALTERNATIVE: Type guard for error handling

```typescript
try {
  await someOperation();
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error('Unknown error:', err);
  }
}
```

**When to use:** When you need to handle both Error objects and other thrown values.

---

## Next.js 15+ Route Handlers

### ❌ BAD: Next.js 14 style (synchronous params)

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const episode = await repository.findById(params.id);
}
```

### ✅ GOOD: Next.js 15 style (async params)

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const episode = await repository.findById(id);
}
```

**Why:** Next.js 15+ changed params to be async to support React Server Components properly.

**Rule:** Always `await params` at the start of the function and destructure immediately.

---

## Null and Undefined Handling

### ❌ BAD: Assuming non-null values

```typescript
<p>Published {new Date(episode.publishedAt).toLocaleDateString()}</p>
```

### ✅ GOOD: Guard against null/undefined

```typescript
{episode.publishedAt && (
  <p>Published {new Date(episode.publishedAt).toLocaleDateString()}</p>
)}
```

### ❌ BAD: Using `null` where `undefined` is expected

```typescript
const updatedEpisode = await repository.update(id, {
  youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || null, // Type error!
});
```

### ✅ GOOD: Use `undefined` for optional properties

```typescript
const updatedEpisode = await repository.update(id, {
  youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || undefined,
});
```

**Why:** TypeScript distinguishes between `null` and `undefined`. Optional properties expect `undefined`, not `null`.

### Handling Optional Input Properties

```typescript
// ❌ BAD: Direct assignment of optional properties
const newEpisode: Episode = {
  youtubeVideoId: input.youtubeVideoId, // Type error if optional
};

// ✅ GOOD: Provide defaults for optional properties
const newEpisode: Episode = {
  youtubeVideoId: input.youtubeVideoId || null,
  hosts: input.hosts || [],
  description: input.description || '',
};
```

### Sorting with Nullable Dates

```typescript
// ❌ BAD: Assuming dates are never null
episodes.sort((a, b) =>
  b.publishedAt.getTime() - a.publishedAt.getTime()
);

// ✅ GOOD: Handle null dates in sort
episodes.sort((a, b) => {
  if (!a.publishedAt || !b.publishedAt) return 0;
  return b.publishedAt.getTime() - a.publishedAt.getTime();
});
```

---

## Dynamic Imports and Type Inference

### ❌ BAD: Untyped dynamic imports

```typescript
let sql: any = null;
async function getSQL() {
  const { sql: neonSQL } = await import('@/lib/db');
  sql = neonSQL;
  return sql;
}
```

### ✅ ACCEPTABLE: Explicit `any` with ESLint disable

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sql: any = null;
async function getSQL() {
  if (!sql) {
    const { sql: neonSQL } = await import('@/lib/db');
    sql = neonSQL;
  }
  return sql;
}
```

**Why:** Some dynamic imports (like Neon's tagged template SQL) don't have exportable types. Using `any` with an ESLint disable comment is acceptable when properly documented.

### ✅ ALTERNATIVE: Type inference from usage

```typescript
type NeonSQL = typeof import('@/lib/db').sql;
let sql: NeonSQL | null = null;
```

**Note:** This may not work if the library doesn't export types properly. Falls back to the `any` approach above.

### Client-Side Dynamic Imports

```typescript
// ❌ BAD: Using require() without ESLint disable
if (typeof window !== 'undefined') {
  const { apiRepository } = require('./api.repository');
  return apiRepository;
}

// ✅ GOOD: Disable ESLint for require in appropriate contexts
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { apiRepository } = require('./api.repository');
  return apiRepository;
}
```

**Why:** `require()` is sometimes necessary for avoiding circular dependencies, but should be marked explicitly.

---

## API Response Types

### Define Explicit Types for API Data

```typescript
// ❌ BAD: Using `any` for external API responses
const videos = data.items?.map((item: any) => ({
  id: item.id,
  title: item.snippet.title,
}));

// ✅ GOOD: Define interfaces for API responses
interface YouTubeAPIItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      default?: { url: string };
    };
    channelId: string;
  };
  contentDetails: {
    duration: string;
  };
}

const videos = data.items?.map((item: YouTubeAPIItem) => ({
  id: item.id,
  title: item.snippet.title,
}));
```

### Partial Type Inference for Search Results

```typescript
// ✅ GOOD: Inline type for simple transformations
const videoIds = searchData.items?.map(
  (item: { id: { videoId: string } }) => item.id.videoId
) || [];
```

**When to use:** For simple, one-off type definitions that don't need reuse.

---

## Database Type Mapping

### Separate Database and Domain Types

```typescript
// Database schema type (snake_case, nullable strings, etc.)
interface DbEpisode {
  id: string;
  youtube_video_id: string | null;
  youtube_channel_id: string | null;
  published_at: string | null;
  duration_seconds: number | null;
  chapters: unknown[]; // JSON column
  created_at: string;
  updated_at: string;
}

// Domain type (camelCase, Date objects, typed arrays, etc.)
interface Episode {
  id: string;
  youtubeVideoId: string | null;
  youtubeChannelId: string | null;
  publishedAt: Date | null;
  durationSeconds: number | null;
  chapters: Chapter[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Type-Safe Mapping Function

```typescript
function mapDbToEpisode(db: DbEpisode): Episode {
  return {
    id: db.id,
    youtubeVideoId: db.youtube_video_id,
    youtubeChannelId: db.youtube_channel_id,
    publishedAt: db.published_at ? new Date(db.published_at) : null,
    durationSeconds: db.duration_seconds,
    chapters: db.chapters as Chapter[], // Cast JSON columns
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}
```

**Key principles:**
- Database types use `string` for dates (ISO format)
- Domain types use `Date` objects
- Database types use `unknown[]` for JSON columns
- Domain types use specific array types (cast with `as`)
- Mapping functions handle all conversions explicitly

---

## ESLint Configuration

### Unused Variables with Underscore Prefix

```typescript
// ✅ GOOD: Prefix intentionally unused parameters with underscore
async function createEpisode(_input: CreateInput) {
  throw new Error('Not yet implemented');
}

async function updateEpisode(_id: string, _input: UpdateInput) {
  throw new Error('Not yet implemented');
}
```

**Why:** ESLint allows underscore-prefixed variables to be unused. This is useful for placeholder implementations or required function signatures.

### Disabling Rules with Comments

```typescript
// ✅ GOOD: Disable specific rules when absolutely necessary
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dynamicModule: any = null;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { module } = require('./dynamic-module');
```

**Rules for disabling:**
1. Only disable on specific lines (prefer `eslint-disable-next-line` over `eslint-disable`)
2. Always add a comment explaining why
3. Use the most specific rule name possible
4. Consider if there's a better way to solve the problem

---

## Common Patterns and Solutions

### Pattern: Conditional Property Assignment

```typescript
// ❌ BAD: Might assign undefined properties
const update = {
  title: input.title,
  description: input.description,
};

// ✅ GOOD: Only include defined properties
const update: Partial<Episode> = {};
if (input.title !== undefined) update.title = input.title;
if (input.description !== undefined) update.description = input.description;

// ✅ ALTERNATIVE: Use object spreading with conditional
const update = {
  ...(input.title !== undefined && { title: input.title }),
  ...(input.description !== undefined && { description: input.description }),
};
```

### Pattern: Environment Variables

```typescript
// ❌ BAD: Assuming env vars exist
const channelId = process.env.YOUTUBE_CHANNEL_ID;

// ✅ GOOD: Provide fallbacks or throw explicitly
const channelId = process.env.YOUTUBE_CHANNEL_ID || undefined;

// ✅ ALTERNATIVE: Validate at startup
if (!process.env.YOUTUBE_CHANNEL_ID) {
  throw new Error('YOUTUBE_CHANNEL_ID environment variable is required');
}
const channelId = process.env.YOUTUBE_CHANNEL_ID;
```

### Pattern: Error Handling in Catch Blocks (Never Ignore)

```typescript
// ❌ BAD: Catching but not using error
try {
  await readFile(path);
} catch (error) {
  throw new Error('File not found');
}

// ✅ GOOD: Don't bind variable if not using
try {
  await readFile(path);
} catch {
  throw new Error('File not found');
}

// ✅ ALTERNATIVE: Use error information
try {
  await readFile(path);
} catch (err) {
  const error = err as Error;
  throw new Error(`File not found: ${error.message}`);
}
```

---

## Pre-Commit Checklist

Before committing TypeScript changes, always run:

```bash
pnpm build
```

This will:
- ✅ Type-check all files
- ✅ Run ESLint
- ✅ Ensure production build succeeds

**Never skip this step.** Type errors that pass in development may fail in production builds.

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| `error: any` in catch | `catch (err) { const error = err as Error; }` |
| Next.js 15 params | `{ params }: { params: Promise<{ id: string }> }` then `await params` |
| Nullable dates | Guard with `if (date) { ... }` or `date && ...` in JSX |
| `null` vs `undefined` | Use `undefined` for optional properties |
| External API types | Define interfaces, avoid `any` |
| JSON database columns | Use `unknown[]` then cast: `as MyType[]` |
| Dynamic imports | Use ESLint disable comment when necessary |
| Unused params | Prefix with underscore: `_param` |
| Env variables | Always provide fallback or validate |

---

## Common Type Errors and Fixes

### "Type 'null' is not assignable to type 'string | undefined'"

```typescript
// ❌ BAD
youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || null

// ✅ GOOD
youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || undefined
```

### "Route has an invalid export" (Next.js 15)

```typescript
// ❌ BAD (Next.js 14 style)
{ params }: { params: { id: string } }

// ✅ GOOD (Next.js 15 style)
{ params }: { params: Promise<{ id: string }> }
```

### "'property' is possibly 'null'"

```typescript
// ❌ BAD
const time = episode.publishedAt.getTime();

// ✅ GOOD
if (!episode.publishedAt) return 0;
const time = episode.publishedAt.getTime();

// ✅ ALTERNATIVE (JSX)
{episode.publishedAt && (
  <span>{episode.publishedAt.toLocaleDateString()}</span>
)}
```

### "Expected 0 type arguments, but got 1"

This happens with libraries like Neon that use tagged template syntax:

```typescript
// ❌ May not work with tagged templates
const rows = await db<DbEpisode[]>`SELECT * FROM episodes`;

// ✅ Use type assertion after query
const rows = await db`SELECT * FROM episodes` as DbEpisode[];

// ✅ Or disable type checking for that variable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sql: any = null;
```

---

## Summary

**Golden Rules:**
1. Never use `any` without an ESLint disable comment
2. Always handle `null` and `undefined` explicitly
3. Use type guards instead of type assertions when possible
4. Define interfaces for all external data (APIs, databases)
5. Run `pnpm build` before every commit
6. Prefer `undefined` over `null` for optional properties
7. Always `await params` in Next.js 15+ route handlers

Following these patterns will prevent 95% of production build type errors.
