# Project-Specific Component Requirements

- Define prop interfaces within component files
- Export components as named exports (no default exports)
- Accept className prop for Tailwind customization
- Use cn() utility from @/lib/utils for class merging
- Use discriminated unions for variant props (e.g., size: 'sm' | 'md' | 'lg')
- Implement error boundaries for API-dependent components
- Use Next/Image for all images
- Follow mobile-first Tailwind patterns
- Support dark mode using 'dark:' Tailwind variants
- Follow project color tokens (no hardcoded colors)
- Use semantic tokens for spacing (no magic numbers)
- Keep bundle size minimal - avoid new dependencies
- Use shadcn/ui components when available
- Handle API loading and error states explicitly
- Support keyboard navigation for interactive elements
- Follow project folder structure conventions
- Use Tailwind breakpoints consistently
- Implement proper focus outline styles
- Use consistent animation durations
- Add JSDoc comments for complex props

## File Organization & Naming
- File names should be kebab-case (example-component.tsx)
- Component names should be PascalCase (ExampleComponent)
- One component per file (including its subcomponents)
- Files exporting a component should match the component name
- Group related components in feature folders
- Keep index.ts files for clean exports
- No nested component definitions unless they're subcomponents
