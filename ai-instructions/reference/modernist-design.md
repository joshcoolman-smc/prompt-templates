# Modernist Design Guidelines

This guide provides a complete design system for creating sophisticated, Swiss modernist-inspired interfaces using Next.js and Tailwind CSS. The aesthetic follows principles from Josef Müller-Brockmann and Dieter Rams, emphasizing functional minimalism and systematic design.

## Prerequisites

- Next.js 13+ with App Router
- Tailwind CSS 4+
- Access to Google Fonts

## Core Philosophy

- **Minimal Color Usage**: Typography and spacing create hierarchy, not color
- **Functional Over Decorative**: Every element serves a clear purpose
- **Mathematical Proportions**: Systematic spacing and grid-based layouts
- **High Contrast**: Maximum legibility through strategic color relationships
- **Swiss Grid Principles**: Precise alignment and generous white space

## Typography System

### Font Configuration

Install and configure IBM Plex font family using Next.js fonts:

```bash
# Required fonts from Google Fonts
IBM Plex Sans: weights 400, 500, 600
IBM Plex Serif: weights 400, 500  
IBM Plex Mono: weights 300, 400
```

**Setup in `layout.tsx`:**
```typescript
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google"
```

**Tailwind Configuration:**
```typescript
// tailwind.config.ts
fontFamily: {
  'sans': ['var(--font-ibm-plex-sans)', 'sans-serif'],
  'serif': ['var(--font-ibm-plex-serif)', 'serif'], 
  'mono': ['var(--font-ibm-plex-mono)', 'monospace'],
}
```

### Typography Hierarchy

**IBM Plex Sans** - Navigation and Structure
- All headings and section headers
- Navigation elements and tabs
- Button labels and UI controls
- Primary brand elements

**IBM Plex Serif** - Content and Reading
- Body copy and descriptions
- Main content areas
- Article text and paragraphs
- User-generated content

**IBM Plex Mono** - Technical and Metadata
- Captions and technical specifications
- Categories, tags, and labels
- Dates, times, and metadata
- Code snippets and technical details

## Color System

### Background Hierarchy
```css
zinc-950: Outer page background (90px border areas)
zinc-900: Primary content containers
zinc-800: Secondary content areas and forms
```

### Text Hierarchy
```css
zinc-100: Brand elements and primary headers
zinc-200: Section headings and important content
zinc-300: Body text and descriptions
white: Technical specifications and captions (mono font only)
```

### Strategic Accents
```css
emerald-500: Success states, completed actions, progress indicators
amber-500: Warning states, errors, deletion actions
```

**Usage Rules:**
- Use accents sparingly - only for interactive states and feedback
- Never use accent colors for decorative purposes
- Maintain high contrast ratios for accessibility

## Layout Principles

### 90px Border System
```css
/* Main page wrapper */
.page-container {
  @apply min-h-screen bg-zinc-950;
}

/* Content area with 90px border */
.content-wrapper {
  @apply p-[90px];
}

/* Inner content container */
.inner-content {
  @apply bg-zinc-900;
}
```

### Grid System
- Use CSS Grid for major layout structure
- 3-column grids for statistical displays
- Alternating backgrounds for visual rhythm (`zinc-900` / `zinc-800`)
- No gaps between grid items - use borders for separation

### Spacing Scale
```css
/* Systematic spacing using 4px base unit */
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px

/* Component internal spacing */
p-12: Standard component padding
p-8: Secondary component padding
p-6: Compact component padding

/* Vertical rhythm */
mb-8, mb-12, mb-16, mb-24: Section separation
```

## Rules and Dividers

### Section Headers
```css
/* 2pt underlines for major sections */
.section-header {
  @apply border-b-2 border-zinc-700 pb-4 mb-8;
}
```

### Content Separation
```css
/* 1px dividers for list items */
.list-divider {
  @apply border-b border-zinc-700;
}

/* Vertical dividers between columns */
.column-divider {
  @apply border-r border-zinc-700 last:border-r-0;
}
```

## Component Patterns

### Form Design
```css
/* Bottom-border inputs */
.form-input {
  @apply w-full px-0 py-4 bg-transparent border-0 border-b-2 border-zinc-700
         text-zinc-200 font-serif text-lg placeholder-zinc-500
         focus:outline-none focus:border-emerald-500 transition-colors;
}

/* Technical labels */
.form-label {
  @apply block font-mono text-xs text-white tracking-wider uppercase mb-6;
}
```

### Button System
```css
/* Primary actions */
.btn-primary {
  @apply font-sans text-xs font-medium text-zinc-200 tracking-wider uppercase
         border border-zinc-700 px-10 py-5
         hover:bg-emerald-500 hover:border-emerald-500 hover:text-zinc-900
         transition-colors;
}

/* Secondary actions */
.btn-secondary {
  @apply font-sans text-xs font-medium text-zinc-400 tracking-wider uppercase
         border border-zinc-700 px-10 py-5
         hover:border-zinc-600 hover:text-zinc-300 transition-colors;
}
```

### Content Cards
```css
/* Standard content container */
.content-card {
  @apply bg-zinc-800 p-12;
}

/* With section header */
.card-header {
  @apply border-b-2 border-zinc-700 mb-8;
}

/* Alternating backgrounds for lists */
.list-item:nth-child(even) {
  @apply bg-zinc-800;
}
.list-item:nth-child(odd) {
  @apply bg-zinc-900;
}
```

## Interactive States

### Hover Effects
```css
/* Subtle hover transitions */
transition-colors: Color changes
transition-all duration-200: General hover states
```

### Loading States
```css
/* Skeleton loading */
.loading-skeleton {
  @apply animate-pulse bg-zinc-700;
}
```

### Error States
```css
/* Error highlighting */
.error-border {
  @apply border-amber-500;
}

/* Error messages */
.error-text {
  @apply font-mono text-xs text-amber-500 tracking-wide uppercase;
}
```

## Implementation Checklist

### Typography
- [ ] IBM Plex fonts loaded and configured
- [ ] Sans for headings and UI, Serif for content, Mono for technical
- [ ] Consistent font weights and tracking
- [ ] Proper line heights for readability

### Colors
- [ ] Zinc background hierarchy implemented
- [ ] Text contrast ratios meet accessibility standards
- [ ] Accent colors used sparingly and purposefully
- [ ] No decorative color usage

### Layout
- [ ] 90px border system around page content
- [ ] Grid-based component layouts
- [ ] Systematic spacing using 4px base unit
- [ ] Mathematical proportions maintained

### Visual Rhythm
- [ ] 2pt borders for section headers
- [ ] 1px borders for content separation
- [ ] Consistent component padding and margins
- [ ] Alternating backgrounds for visual interest

### Interactions
- [ ] Subtle hover transitions
- [ ] Clear loading and error states
- [ ] Accessible focus indicators
- [ ] Consistent button and form styling

## Advanced Techniques

### Grid Precision
```css
/* Perfect grid alignment */
.stats-grid {
  @apply grid grid-cols-3 gap-0;
}

.stats-cell {
  @apply border-r border-zinc-700 last:border-r-0 p-12;
}
```

### Visual Hierarchy
```css
/* Size relationships */
text-5xl: Major numbers/statistics
text-2xl: Section headers  
text-lg: Content headers
text-base: Body text
text-xs: Technical details
```

### Accessibility Considerations
- Maintain 4.5:1 contrast ratio minimum
- Use semantic HTML structure
- Provide proper focus indicators
- Include ARIA labels where needed

This design system creates sophisticated, professional interfaces that prioritize content and functionality while maintaining visual elegance through systematic design principles.