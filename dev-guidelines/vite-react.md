## General Guidelines
- Focus on code changes, optimization, and new code generation.
- Prioritize meaningful and relevant code improvements specific to the user request.

### Code Quality
- Follow clean code principles.
- Ensure all code is **type-safe** using TypeScript.
- Include clear, professional comments where they improve clarity or maintainability.

### UI & Styling
- Use **Tailwind CSS** utility classes for styling — avoid custom CSS when Tailwind classes suffice.
- Design components to look good in **both light and dark mode**.
- Use **Lucide React** for icons.
- Use **Radix UI** for accessibility primitives and composable components.
- Prefer **shadcn/ui** components when available for consistent styling and accessibility.
  
### Component Structure
- Keep **page-level routes** in their own folder under `/src/pages` or use a router like **React Router**.
- **Feature UI components** should be placed inside their respective feature folders and defined as client components.
- Client-side logic such as state management or interactivity should be isolated in **client components**.

## Architecture Guidelines

### Feature Module Pattern
Structure all features using the **feature folder pattern**:

```
/features/[feature-name]/
├── components/
├── hooks/
├── repository/
├── service/
├── types/
└── utils/
```

### Architecture Best Practices
- Use **Repository, Service, Hooks** architecture to separate concerns.
- Repositories and Services should implement well-defined **interfaces** for consistency and testability.
- Use **Zod** for schema validation and type inference.
- Generate **mock data** with enough volume and variety to support thorough UI and logic testing.
  - Place mock data in the feature’s `repository/` or `utils/` folder as needed.

---

