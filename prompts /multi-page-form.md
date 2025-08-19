# Multi-Page Form Implementation Guide

This guide provides a comprehensive approach to implementing multi-page forms in Next.js applications with state persistence, server-side validation, and seamless navigation.

## Architecture Overview

A multi-page form consists of several key components working together:

1. **Schema Definition & Validation** - Zod schemas for each step and combined validation
2. **State Management** - React Context with localStorage persistence
3. **Server Actions** - Server-side validation and navigation
4. **Form Components** - Reusable input components with error handling
5. **Navigation System** - Step-based navigation with progress tracking
6. **Layout Structure** - Consistent layout with context providers

## 1. Schema Definition (`schemas.ts`)

Define Zod schemas for each form step and create a combined schema:

```typescript
import z from 'zod';

// Individual step schemas
export const stepOneSchema = z.object({
  fieldName: z.string().min(1, 'Error message'),
  // Add other fields
});

export const stepTwoSchema = z.object({
  // Define step two fields
});

// Combined schema for final validation
export const combinedSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  // Continue for all steps
});

// Optional values schema for initial state
export const initialValuesSchema = z.object({
  fieldName: z.string().optional(),
  // Make all fields optional for persistence
});

// Type exports
export type CombinedType = z.infer<typeof combinedSchema>;
export type InitialValuesType = z.infer<typeof initialValuesSchema>;
```

## 2. Type Definitions (`types.ts`)

```typescript
export interface FormErrors {
  [key: string]: string | undefined;
}

export enum FormRoutes {
  STEP_ONE = '/form/step-one',
  STEP_TWO = '/form/step-two',
  REVIEW = '/form/review',
}
```

## 3. Context Provider (`contexts/formContext.tsx`)

Create a context for state management with localStorage persistence:

```typescript
'use client';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { InitialValuesType, CombinedType, initialValuesSchema } from '@/schemas';

const LOCAL_STORAGE_KEY = 'form-data';

const defaultData: InitialValuesType = {
  // Initialize with empty/default values
};

type FormContextType = {
  formData: InitialValuesType;
  updateFormData: (data: Partial<CombinedType>) => void;
  dataLoaded: boolean;
  resetLocalStorage: () => void;
};

export const FormContext = createContext<FormContextType | null>(null);

export const FormContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<InitialValuesType>(defaultData);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    readFromLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveDataToLocalStorage(formData);
    }
  }, [formData, dataLoaded]);

  const updateFormData = useCallback((data: Partial<CombinedType>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const saveDataToLocalStorage = (data: InitialValuesType) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  const readFromLocalStorage = () => {
    const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!loadedDataString) return setFormData(defaultData);
    
    const validated = initialValuesSchema.safeParse(JSON.parse(loadedDataString));
    setFormData(validated.success ? validated.data : defaultData);
  };

  const resetLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setFormData(defaultData);
  };

  const contextValue = useMemo(() => ({
    formData,
    dataLoaded,
    updateFormData,
    resetLocalStorage,
  }), [formData, dataLoaded, updateFormData]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === null) {
    throw new Error('useFormContext must be used within a FormContextProvider');
  }
  return context;
}
```

## 4. Layout Structure (`app/form/layout.tsx`)

Wrap form pages with the context provider and navigation:

```typescript
import { FormContextProvider } from '@/contexts/formContext';
import StepNavigation from '@/components/StepNavigation';

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="form-container">
      <StepNavigation />
      <FormContextProvider>
        <div className="form-content">
          {children}
        </div>
      </FormContextProvider>
    </div>
  );
}
```

## 5. Input Component (`components/Input.tsx`)

Create a reusable input component that integrates with the form context:

```typescript
'use client';
import { useFormContext } from '@/contexts/formContext';

interface InputProps {
  label: string;
  id: string;
  type: string;
  required?: boolean;
  description?: string;
  errorMsg?: string;
  // Add other HTML input props as needed
}

export default function Input({ label, id, type, required, description, errorMsg, ...props }: InputProps) {
  const { updateFormData, formData } = useFormContext();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {description && <span className="description">{description}</span>}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        required={required}
        onChange={handleInputChange}
        defaultValue={formData[id] as string}
        className={errorMsg ? 'error' : ''}
        {...props}
      />
      {errorMsg && <span className="error-message">{errorMsg}</span>}
    </div>
  );
}
```

## 6. Submit Button (`components/SubmitButton.tsx`)

```typescript
'use client';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  text: string;
  submittingText?: string;
}

export default function SubmitButton({ text, submittingText = 'Loading...' }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? submittingText : text}
    </button>
  );
}
```

## 7. Server Actions Pattern

For each step, create a server action that validates and redirects:

### Step Action (`app/form/step-one/actions.ts`)

```typescript
'use server';
import { stepOneSchema } from '@/schemas';
import { FormRoutes, FormErrors } from '@/types';
import { redirect } from 'next/navigation';

export const stepOneFormAction = (
  prevState: FormErrors | undefined,
  formData: FormData
): FormErrors | undefined => {
  const data = Object.fromEntries(formData.entries());
  const validated = stepOneSchema.safeParse(data);
  
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(FormRoutes.STEP_TWO);
};
```

### Final Submit Action (`app/form/review/actions.tsx`)

```typescript
'use server';
import { stepOneSchema, stepTwoSchema, CombinedType } from '@/schemas';
import { FormRoutes } from '@/types';

interface SubmitActionReturnType {
  redirect?: FormRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitFormAction = async (data: CombinedType): Promise<SubmitActionReturnType> => {
  // Validate all steps
  const stepOneValidated = stepOneSchema.safeParse(data);
  if (!stepOneValidated.success) {
    return {
      redirect: FormRoutes.STEP_ONE,
      errorMsg: 'Please validate step one.',
    };
  }

  const stepTwoValidated = stepTwoSchema.safeParse(data);
  if (!stepTwoValidated.success) {
    return {
      redirect: FormRoutes.STEP_TWO,
      errorMsg: 'Please validate step two.',
    };
  }

  // Process the form data (save to database, send email, etc.)
  try {
    // Your business logic here
    console.log('Processing form data:', data);
    
    return { success: true, redirect: FormRoutes.STEP_ONE };
  } catch (error) {
    return { errorMsg: 'An error occurred while processing your request.' };
  }
};
```

## 8. Form Components

### Step Form (`app/form/step-one/StepOneForm.tsx`)

```typescript
'use client';
import { useFormState } from 'react-dom';
import { stepOneFormAction } from './actions';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import { FormErrors } from '@/types';

const initialState: FormErrors = {};

export default function StepOneForm() {
  const [serverErrors, formAction] = useFormState(stepOneFormAction, initialState);

  return (
    <form action={formAction}>
      <Input
        label="Field Label"
        id="fieldName"
        type="text"
        required
        errorMsg={serverErrors?.fieldName}
      />
      <SubmitButton text="Continue" />
    </form>
  );
}
```

### Review Form (`app/form/review/ReviewForm.tsx`)

```typescript
'use client';
import { useFormContext } from '@/contexts/formContext';
import { useRouter } from 'next/navigation';
import { submitFormAction } from './actions';
import { CombinedType } from '@/schemas';
import toast from 'react-hot-toast';

export default function ReviewForm() {
  const router = useRouter();
  const { formData, resetLocalStorage } = useFormContext();

  const handleFormSubmit = async (formData: FormData) => {
    const res = await submitFormAction(formData as CombinedType);
    const { redirect, errorMsg, success } = res;

    if (success) {
      toast.success('Form submitted successfully');
      resetLocalStorage();
    } else if (errorMsg) {
      toast.error(errorMsg);
    }
    
    if (redirect) {
      return router.push(redirect);
    }
  };

  return (
    <form action={handleFormSubmit}>
      {/* Display form data for review */}
      <div>
        <p>Field: {formData.fieldName}</p>
        {/* Display other fields */}
      </div>
      <SubmitButton text="Submit" submittingText="Submitting..." />
    </form>
  );
}
```

## 9. Navigation Component (`components/StepNavigation.tsx`)

```typescript
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FormRoutes } from '@/types';

const steps = [
  { title: 'Step One', route: 'step-one', link: FormRoutes.STEP_ONE },
  { title: 'Step Two', route: 'step-two', link: FormRoutes.STEP_TWO },
  { title: 'Review', route: 'review', link: FormRoutes.REVIEW },
];

export default function StepNavigation() {
  const pathname = usePathname();
  const currentRoute = pathname.split('/').pop();
  const currentStep = steps.findIndex(step => step.route === currentRoute);

  return (
    <nav>
      {/* Back button */}
      <Link href={steps[currentStep - 1]?.link || steps[0].link}>
        Back
      </Link>

      {/* Step indicators */}
      {steps.map((step, i) => (
        <Link key={step.link} href={step.link}>
          <span className={currentRoute === step.route ? 'active' : ''}>
            {i + 1}
          </span>
          <span>{step.title}</span>
        </Link>
      ))}
    </nav>
  );
}
```

## 10. Page Components

Each step should have a simple page component:

```typescript
// app/form/step-one/page.tsx
import StepOneForm from './StepOneForm';

export default function StepOnePage() {
  return (
    <div>
      <h1>Step One</h1>
      <StepOneForm />
    </div>
  );
}
```

## Key Implementation Principles

### 1. **State Persistence**
- Use localStorage to persist form data across page refreshes and navigation
- Validate data when loading from localStorage using Zod schemas
- Clear localStorage only after successful submission

### 2. **Validation Strategy**
- Use Zod schemas for both client-side and server-side validation
- Create separate schemas for each step and a combined schema for final validation
- Return specific error messages for each field

### 3. **Navigation Flow**
- Use server actions to handle form submission and navigation
- Redirect to next step only after successful validation
- Allow navigation between completed steps via the navigation component

### 4. **Error Handling**
- Display validation errors next to form fields
- Use `useFormState` to manage server-side validation errors
- Provide user feedback with toast notifications

### 5. **Context Management**
- Use React Context to share form state across components
- Implement optimistic updates for better user experience
- Use `useMemo` and `useCallback` to optimize context value

### 6. **Server Actions**
- Keep server actions focused on validation and navigation
- Return structured error objects for proper error handling
- Use type-safe patterns with proper TypeScript interfaces

## Usage Instructions

1. **Setup**: Copy this file structure and install dependencies (`zod`, `react-hot-toast`)
2. **Customize**: Replace field names, validation rules, and routes to match your use case
3. **Extend**: Add more steps by following the same pattern
4. **Style**: Apply your own CSS classes and styling
5. **Business Logic**: Implement actual data processing in the final submit action

This pattern provides a robust foundation for any multi-page form with state persistence, validation, and seamless user experience.