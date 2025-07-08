# Personal Blog Feature

## Overview
A simple markdown-based blog system for the personal website using current Next.js 14 best practices with Test-Driven Development approach. Posts are created directly in the repository as markdown files with static generation for optimal performance.

## Core Requirements

### Content Management
- Blog posts stored as markdown files in `/posts/` directory (project root)
- Filename becomes the slug for the post URL (e.g., `my-post.md` → `/blog/my-post`)
- Posts managed directly in repo (no CMS)
- Static generation at build time for performance

### Pages Structure
1. **Blog Index (`/blog`)** - Grid of post cards showing:
   - Title
   - Description/excerpt
   - Date
   - Ordered by most recent to oldest

2. **Individual Post (`/blog/[slug]`)** - Full markdown post display
   - Proper markdown rendering with syntax highlighting
   - SEO metadata generation
   - Simple back navigation to blog index

## Technical Implementation

### Dependencies (Best-in-Class 2024/2025)
```json
{
  "react-markdown": "^9.0.1",
  "remark-gfm": "^4.0.0",
  "rehype-highlight": "^7.0.0",
  "rehype-slug": "^6.0.0",
  "gray-matter": "^4.0.3",
  "highlight.js": "^11.9.0"
}
```

### Testing Dependencies
```json
{
  "vitest": "^1.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "jsdom": "^23.0.0"
}
```

### ⚠️ CRITICAL: Typography & Styling Setup

**Important**: Do NOT install `@tailwindcss/typography` plugin - it causes build conflicts with Tailwind CSS v4. Instead, use custom CSS classes as shown below.

#### Required CSS Configuration
Add to your `globals.css` file:

```css
/* Blog markdown styling */
.blog-content {
  @apply text-gray-300 leading-relaxed;
}

.blog-content h1 {
  @apply text-4xl font-bold text-white mb-6 mt-8 leading-tight;
}

.blog-content h2 {
  @apply text-3xl font-bold text-white mb-4 mt-8 leading-tight;
}

.blog-content h3 {
  @apply text-2xl font-bold text-white mb-3 mt-6 leading-tight;
}

.blog-content p {
  @apply text-gray-300 mb-4 leading-relaxed;
}

.blog-content ul {
  @apply list-disc list-outside ml-6 mb-4 text-gray-300;
}

.blog-content ol {
  @apply list-decimal list-outside ml-6 mb-4 text-gray-300;
}

.blog-content li {
  @apply mb-2 leading-relaxed;
}

.blog-content strong {
  @apply text-white font-semibold;
}

.blog-content code {
  @apply text-cyan-400 bg-gray-800 px-2 py-1 rounded text-sm font-mono;
}

.blog-content pre {
  @apply bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4 overflow-x-auto;
}

.blog-content pre code {
  @apply text-gray-200 bg-transparent p-0 text-sm;
}

.blog-content blockquote {
  @apply border-l-4 border-cyan-500 pl-4 py-2 mb-4 text-gray-300 italic bg-gray-800/30;
}

.blog-content a {
  @apply text-cyan-400 hover:text-cyan-300 transition-colors;
}

.blog-content a:hover {
  @apply underline;
}
```

#### MarkdownRenderer Component
```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import 'highlight.js/styles/github-dark.css'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="blog-content max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

### Feature Module Structure
```
src/features/blog/
├── components/
│   ├── MarkdownRenderer.tsx
│   ├── PostCard.tsx
│   └── PostList.tsx
├── repository/
│   ├── BlogRepository.ts          # File system operations
│   └── BlogRepository.test.ts
├── service/
│   ├── BlogService.ts             # Markdown parsing, frontmatter
│   └── BlogService.test.ts
├── types/
│   └── BlogTypes.ts               # BlogPost, PostMetadata interfaces
└── utils/
    ├── dateUtils.ts               # Date formatting
    └── slugUtils.ts               # Slug generation

src/app/blog/
├── page.tsx                       # Blog index with static generation
└── [slug]/
    └── page.tsx                   # Individual post with static params
```

### File Structure
```
/posts/                            # Markdown files (project root)
├── first-post.md
├── second-post.md
└── third-post.md
```

### Frontmatter Format
```yaml
---
title: "Post Title"
date: "2025-01-15"
excerpt: "Short description for post cards"
author: "Josh Coolman"
tags: ["nextjs", "markdown"]
---
```

## Test-Driven Development Implementation

### TDD Workflow (Red-Green-Refactor)
1. **Define Types First**: BlogPost, PostMetadata, BlogRepository interfaces
2. **Write Repository Tests**: File system operations, error handling
3. **Write Service Tests**: Markdown parsing, frontmatter validation
4. **Write Component Tests**: Rendering behavior, dark theme styling
5. **Write Integration Tests**: Full post rendering pipeline
6. **Implement Code**: Minimal code to pass tests at each layer
7. **Refactor**: Improve code quality while maintaining test coverage

### ⚠️ Testing Configuration

#### Vitest Setup (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
```

#### Test Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom'
```

#### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### Testing Requirements

#### Repository Layer Tests
- ✅ getAllPosts() returns posts with correct metadata
- ✅ getPostBySlug() returns post content for valid slug
- ✅ Error handling for missing files
- ✅ Error handling for invalid markdown
- ✅ File system path resolution
- ✅ Post sorting by date (most recent first)

#### Service Layer Tests  
- ✅ Markdown parsing with frontmatter extraction
- ✅ Frontmatter validation (required fields)
- ✅ Content processing and sanitization
- ✅ Date formatting and validation

#### Component Tests
- ✅ MarkdownRenderer renders content correctly
- ✅ PostCard displays metadata properly
- ✅ Dark theme styling compatibility
- ✅ Syntax highlighting works
- ✅ Navigation links function
- ✅ SEO metadata generation

### Quality Gates (Must Pass Before PR)
1. **Lint**: ESLint rules pass
2. **Type-check**: TypeScript compilation succeeds
3. **Test Suite**: All tests pass with adequate coverage
4. **Production Build**: `pnpm build` succeeds (critical for static generation)
5. **Manual Testing**: Verify markdown rendering and navigation

## Implementation Order (CRITICAL FOR SUCCESS)

Follow this exact sequence to avoid dependency issues:

### Phase 1: Setup & Dependencies
```bash
# 1. Install markdown processing dependencies
pnpm add react-markdown remark-gfm rehype-highlight rehype-slug gray-matter highlight.js

# 2. Install testing dependencies
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom

# 3. Update package.json scripts
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### Phase 2: Configuration Files
1. Create `vitest.config.ts`
2. Create `src/test/setup.ts`
3. Add CSS classes to `globals.css` (see Typography section above)

### Phase 3: TDD Implementation
1. **Types First**: Create `BlogTypes.ts` interfaces
2. **Service Layer**: `BlogService.ts` (markdown parsing)
3. **Repository Layer**: `BlogRepository.ts` (file operations)
4. **Components**: `MarkdownRenderer.tsx`, `PostCard.tsx`, `PostList.tsx`
5. **Routes**: `/blog/page.tsx` and `/blog/[slug]/page.tsx`

### Phase 4: Content & Testing
1. Create `/posts/` directory in project root
2. Add sample markdown files
3. Test production build: `pnpm build`
4. Manual testing

## Common Pitfalls & Solutions

### 1. Typography Issues
**Problem**: Text appears unstyled, no headings hierarchy, missing bullet points
**Solution**: Use custom CSS classes instead of `@tailwindcss/typography` plugin

### 2. Build Failures
**Problem**: "Cannot read properties of undefined" errors during build
**Solution**: Check PostCSS config, ensure no conflicting Tailwind plugins

### 3. Missing Syntax Highlighting
**Problem**: Code blocks render as plain text
**Solution**: Import `highlight.js/styles/github-dark.css` in MarkdownRenderer

### 4. Static Generation Errors
**Problem**: Posts don't appear on blog index
**Solution**: Ensure `posts/` directory exists and contains `.md` files with valid frontmatter

### 5. Test Mocking Issues
**Problem**: Complex file system mocking failures
**Solution**: Start with simple integration tests using real files, add complex mocks later

## Technical Approach
- **Static Generation**: All posts generated at build time using `generateStaticParams`
- **Server Components**: Blog utilities run server-side only for file system access
- **Performance**: Minimal client-side JavaScript, syntax highlighting server-side
- **SEO**: All content rendered server-side with proper metadata
- **Type Safety**: Strict TypeScript with comprehensive interfaces

### Styling Requirements
- Dark mode only (black background assumed)
- Light text on dark backgrounds
- Syntax highlighting with dark theme (github-dark)
- Custom CSS classes for typography (NO @tailwindcss/typography plugin)
- Consistent spacing and vertical rhythm

## Definition of Done
- ✅ All tests pass (repository, service, component, integration)
- ✅ Production build succeeds (`pnpm build`)
- ✅ Lint and type-check pass
- ✅ 2-3 demo posts created and rendering correctly
- ✅ Blog index and detail pages functional
- ✅ Static generation working
- ✅ Typography properly styled with custom CSS
- ✅ Syntax highlighting working
- ✅ Manual testing completed

## Troubleshooting

### Build Errors
```bash
# Clear Next.js cache if seeing weird build errors
rm -rf .next
pnpm build
```

### Typography Not Working
1. Verify `blog-content` class is in `globals.css`
2. Check MarkdownRenderer uses `className="blog-content"`
3. Ensure no conflicting `prose` classes

### Posts Not Appearing
1. Check `/posts/` directory exists at project root
2. Verify `.md` files have valid frontmatter
3. Check `BlogRepository` constructor path resolution

### Syntax Highlighting Missing
1. Import `highlight.js/styles/github-dark.css`
2. Verify `rehype-highlight` plugin is installed and configured
3. Check code blocks use triple backticks in markdown

## Out of Scope
- Search/filtering
- Comments  
- RSS feeds
- Complex post organization
- Image optimization (Next.js Image component)
- Custom React components in markdown (pure markdown only)