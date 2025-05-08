# Next.js 15 Clean Architecture Feature Implementation Guide

This guide demonstrates how to implement new features in an existing Next.js 15 application using clean architecture principles and React 19 features.

## Existing Project Structure

```
src/
  app/
    api/
    layout.tsx
    page.tsx
  features/
  core/
    types/
    utils/
    errors/
      AppError.ts
  lib/
    api/
  components/
    ui/
  store/ (optional, for state management)
```

## Implementing a New Feature

When adding a new feature to the application, follow these steps:

1. Create a new directory for your feature under `src/features/`
2. Implement the following components for your feature:
   - Schemas
   - Types
   - Repository Interface
   - Repository Implementation
   - Service
   - Actions (Server Actions)
   - Components
   - API Routes (if needed)
   - Page Component (if needed)

### 1. Feature Directory Structure

Create the following structure for your feature:

```
src/
  features/
    [feature-name]/
      actions/
        featureActions.ts
      components/
        FeatureComponent.tsx
        ErrorBoundary.tsx
      services/
        featureService.ts
      repositories/
        featureRepository.ts
        mockFeatureRepository.ts
      schemas.ts
      types.ts
      utils.ts
      index.ts
```

### 2. Implement Feature Components

#### Schemas (`src/features/[feature-name]/schemas.ts`)

```typescript
import { z } from 'zod';

// Define your Zod schemas for data validation and type inference
export const featureSchema = z.object({
  id: z.string(),
  // Add your feature-specific fields
});

export const featureListSchema = z.array(featureSchema);

export const createFeatureSchema = featureSchema.pick({
  // Specify fields needed for creation
});
```

#### Types (`src/features/[feature-name]/types.ts`)

```typescript
import { z } from 'zod';
import { featureSchema, featureListSchema, createFeatureSchema } from './schemas';

export type Feature = z.infer<typeof featureSchema>;
export type FeatureList = z.infer<typeof featureListSchema>;
export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;

export interface FeatureError {
  message: string;
  code?: string;
}
```

#### Repository Interface (`src/features/[feature-name]/repositories/featureRepository.ts`)

```typescript
import { Feature, FeatureList, CreateFeatureInput } from '../types';

export interface FeatureRepository {
  getAll(): Promise<FeatureList>;
  getById(id: string): Promise<Feature>;
  create(input: CreateFeatureInput): Promise<Feature>;
  update(id: string, data: Partial<Feature>): Promise<Feature>;
  delete(id: string): Promise<boolean>;
}
```

#### Repository Implementation (`src/features/[feature-name]/repositories/mockFeatureRepository.ts`)

```typescript
import { FeatureRepository } from './featureRepository';
import { Feature, FeatureList, CreateFeatureInput } from '../types';
import { featureSchema, featureListSchema } from '../schemas';
import { AppError } from 'core/errors/AppError';

export class MockFeatureRepository implements FeatureRepository {
  private items: FeatureList = [];

  async getAll(): Promise<FeatureList> {
    return featureListSchema.parse(this.items);
  }

  async getById(id: string): Promise<Feature> {
    const item = this.items.find(i => i.id === id);
    if (!item) {
      throw new AppError('Item not found', 'NOT_FOUND');
    }
    return featureSchema.parse(item);
  }

  async create(input: CreateFeatureInput): Promise<Feature> {
    const newItem = { ...input, id: Date.now().toString() };
    this.items.push(newItem);
    return featureSchema.parse(newItem);
  }

  async update(id: string, data: Partial<Feature>): Promise<Feature> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new AppError('Item not found', 'NOT_FOUND');
    }
    this.items[index] = { ...this.items[index], ...data };
    return featureSchema.parse(this.items[index]);
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.items.length;
    this.items = this.items.filter(i => i.id !== id);
    return this.items.length < initialLength;
  }
}
```

#### Service (`src/features/[feature-name]/services/featureService.ts`)

```typescript
import { FeatureRepository } from '../repositories/featureRepository';
import { Feature, FeatureList, CreateFeatureInput } from '../types';
import { AppError } from 'core/errors/AppError';

export class FeatureService {
  constructor(private repository: FeatureRepository) {}

  async getAll(): Promise<FeatureList> {
    try {
      return await this.repository.getAll();
    } catch (error) {
      throw new AppError('Failed to fetch items', 'FETCH_ERROR');
    }
  }

  async create(input: CreateFeatureInput): Promise<Feature> {
    try {
      return await this.repository.create(input);
    } catch (error) {
      throw new AppError('Failed to create item', 'CREATE_ERROR');
    }
  }

  async update(id: string, data: Partial<Feature>): Promise<Feature> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update item', 'UPDATE_ERROR');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new AppError('Failed to delete item', 'DELETE_ERROR');
    }
  }
}
```

#### Server Actions (`src/features/[feature-name]/actions/featureActions.ts`)

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { FeatureService } from '../services/featureService';
import { MockFeatureRepository } from '../repositories/mockFeatureRepository';
import { CreateFeatureInput } from '../types';
import { createFeatureSchema } from '../schemas';

const repository = new MockFeatureRepository();
const service = new FeatureService(repository);

export async function createFeature(formData: FormData) {
  const input = {
    title: formData.get('title'),
    // Add other fields as needed
  };

  try {
    const validatedData = createFeatureSchema.parse(input);
    await service.create(validatedData);
    revalidatePath('/[feature-name]');
  } catch (error) {
    return { error: 'Failed to create item' };
  }
}

export async function updateFeature(id: string, data: Partial<CreateFeatureInput>) {
  try {
    await service.update(id, data);
    revalidatePath('/[feature-name]');
  } catch (error) {
    return { error: 'Failed to update item' };
  }
}

export async function deleteFeature(id: string) {
  try {
    await service.delete(id);
    revalidatePath('/[feature-name]');
  } catch (error) {
    return { error: 'Failed to delete item' };
  }
}
```

### 3. Implement Page Component (if needed)

Create a new file `src/app/[feature-name]/page.tsx`:

```typescript
import { Suspense } from 'react';
import { FeatureComponent } from 'features/[feature-name]/components/FeatureComponent';
import { FeatureService } from 'features/[feature-name]/services/featureService';
import { MockFeatureRepository } from 'features/[feature-name]/repositories/mockFeatureRepository';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feature Name',
  description: 'Feature description'
};

export default async function FeaturePage() {
  const repository = new MockFeatureRepository();
  const service = new FeatureService(repository);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeatureComponent service={service} />
    </Suspense>
  );
}
```

### 4. Implement Feature Component

```typescript
'use client';

import { useOptimistic, useFormStatus, useFormState } from 'react';
import { createFeature, updateFeature, deleteFeature } from '../actions/featureActions';
import { Feature } from '../types';

interface FeatureComponentProps {
  service: FeatureService;
}

export function FeatureComponent({ service }: FeatureComponentProps) {
  const { pending } = useFormStatus();
  const [optimisticItems, addOptimisticItem] = useOptimistic<Feature[]>(
    [],
    (state, newItem: Feature) => [...state, newItem]
  );

  return (
    <div>
      <form
        action={async (formData) => {
          const title = formData.get('title');
          // Add optimistic update
          addOptimisticItem({ id: 'temp-id', title: title as string });
          await createFeature(formData);
        }}
      >
        {/* Form fields */}
        <button type="submit" disabled={pending}>
          Add Item
        </button>
      </form>

      {/* Display items */}
      <ul>
        {optimisticItems.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Best Practices

When implementing new features, keep these best practices in mind:

- Use Server Actions for form submissions and data mutations
- Implement Partial Prerendering for improved performance
- Utilize React 19's new hooks (useOptimistic, useFormStatus, useFormState)
- Use the Document Metadata API for dynamic metadata
- Implement proper Suspense boundaries for loading states
- Use Zod schemas for all data validation and type inference
- Keep the repository implementation separate from the interface
- Use dependency injection to provide the repository to the service
- Implement proper error handling in both frontend and API routes
- Use existing UI components from the `components/ui` directory
- Ensure components work well in both light and dark modes
- Consider using global state management (e.g., Zustand) for complex state
- Implement progressive enhancement techniques
- Use React 19's automatic memo optimization
- Take advantage of Next.js 15's improved static/dynamic rendering
