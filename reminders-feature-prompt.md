# Reminders Feature Implementation

## Overview
Create a Reminders feature that mirrors the core functionality of Apple's Reminders app. This feature should allow users to create, manage, and organize reminders with due dates, priorities, and categories/lists.

## Tech Stack
- Next.js 15 (App Router)
- Supabase for database and authentication
- Zod for type validation
- Zustand for state management
- TanStack Query v5 for server state management
- ShadCn/ui for components
- Tailwind CSS for styling

## Authentication & Database
- Authentication is handled by Supabase
- Users are created manually through Supabase admin dashboard
- No signup flow is required in the application
- User session is managed through Supabase Auth

## Core Functionality Requirements
1. Create and manage reminder lists (categories)
2. Add, edit, and delete individual reminders
3. Set due dates and times for reminders
4. Mark reminders as completed
5. Set priority levels for reminders
6. Search and filter reminders
7. Responsive design that works well on all device sizes

## Technical Implementation

### Database Schema
Define the following Supabase database tables:

```sql
-- Enable RLS
alter table reminder_lists enable row level security;
alter table reminders enable row level security;

-- Create tables
create table reminder_lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  color text not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  list_id uuid references reminder_lists(id) not null,
  title text not null,
  notes text,
  completed boolean default false not null,
  due_date timestamp with time zone,
  priority text not null check (priority in ('none', 'low', 'medium', 'high')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index reminder_lists_user_id_idx on reminder_lists(user_id);
create index reminders_user_id_idx on reminders(user_id);
create index reminders_list_id_idx on reminders(list_id);
create index reminders_due_date_idx on reminders(due_date);

-- Set up RLS policies
create policy "Users can only see their own lists"
  on reminder_lists for select
  using (auth.uid() = user_id);

create policy "Users can insert their own lists"
  on reminder_lists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own lists"
  on reminder_lists for update
  using (auth.uid() = user_id);

create policy "Users can delete their own lists"
  on reminder_lists for delete
  using (auth.uid() = user_id);

create policy "Users can only see their own reminders"
  on reminders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reminders"
  on reminders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reminders"
  on reminders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reminders"
  on reminders for delete
  using (auth.uid() = user_id);
```

### Data Models and Validation
Implement the following Zod schemas and types:

```typescript
// Schema definitions
const reminderListSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i), // Hex color code
  icon: z.string().optional(), // Lucide icon name
  createdAt: z.date(),
  updatedAt: z.date()
});

const reminderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  listId: z.string().uuid(),
  title: z.string().min(1).max(200),
  notes: z.string().max(1000).optional(),
  completed: z.boolean(),
  dueDate: z.date().optional(),
  priority: z.enum(['none', 'low', 'medium', 'high']),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Infer types from schemas
type ReminderList = z.infer<typeof reminderListSchema>;
type Reminder = z.infer<typeof reminderSchema>;
```

### Feature Structure
Follow this structure for the Reminders feature:

```
src/app/features/reminders/
├── api/
│   ├── lists/
│   │   └── route.ts
│   └── reminders/
│       └── route.ts
├── components/
│   ├── RemindersList/
│   │   ├── index.tsx
│   │   └── ReminderItem.tsx
│   ├── ReminderForm/
│   │   ├── index.tsx
│   │   ├── PrioritySelector.tsx
│   │   └── DateTimePicker.tsx
│   ├── ListSelector/
│   │   ├── index.tsx
│   │   └── ListColorPicker.tsx
│   └── SearchFilter/
│       └── index.tsx
├── store/
│   ├── reminderStore.ts
│   └── filterStore.ts
├── queries/
│   ├── useReminders.ts
│   └── useReminderLists.ts
├── mutations/
│   ├── useCreateReminder.ts
│   ├── useUpdateReminder.ts
│   └── useDeleteReminder.ts
├── schemas/
│   └── index.ts
└── utils/
    └── reminderUtils.ts
```

### State Management with Zustand
Implement the following stores:

```typescript
// src/app/features/reminders/store/reminderStore.ts
interface ReminderState {
  selectedListId: string | null;
  setSelectedList: (id: string | null) => void;
  showCompleted: boolean;
  toggleShowCompleted: () => void;
}

export const useReminderStore = create<ReminderState>((set) => ({
  selectedListId: null,
  setSelectedList: (id) => set({ selectedListId: id }),
  showCompleted: true,
  toggleShowCompleted: () => set((state) => ({ showCompleted: !state.showCompleted }))
}));

// src/app/features/reminders/store/filterStore.ts
interface FilterState {
  searchQuery: string;
  priorityFilter: Priority | null;
  dateFilter: 'all' | 'today' | 'upcoming';
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: Priority | null) => void;
  setDateFilter: (filter: 'all' | 'today' | 'upcoming') => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  priorityFilter: null,
  dateFilter: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setDateFilter: (filter) => set({ dateFilter: filter })
}));
```

### Supabase Client Setup
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### TanStack Query Integration
Implement data fetching and mutations using Supabase:

```typescript
// src/app/features/reminders/queries/useReminders.ts
export const useReminders = (listId: string | null) => {
  const { data: { session } } = useSessionQuery();
  
  return useQuery({
    queryKey: ['reminders', listId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('list_id', listId)
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!listId && !!session?.user
  });
};

// src/app/features/reminders/mutations/useCreateReminder.ts
export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  const { data: { session } } = useSessionQuery();
  
  return useMutation({
    mutationFn: async (newReminder: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('reminders')
        .insert([
          {
            ...newReminder,
            user_id: session?.user.id
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reminders', variables.listId] });
    }
  });
};
```

### UI Components
Create the following UI components using shadcn components:

1. **RemindersList**: Display reminders in a list format
```typescript
// src/app/features/reminders/components/RemindersList/index.tsx
'use client';

import { useReminders } from '../../queries/useReminders';
import { useReminderStore } from '../../store/reminderStore';
import { Card } from '@/components/ui/card';

export const RemindersList = () => {
  const selectedListId = useReminderStore((state) => state.selectedListId);
  const { data: reminders, isLoading } = useReminders(selectedListId);
  
  // Component implementation
};
```

2. **ReminderForm**: Form for creating/editing reminders
```typescript
// src/app/features/reminders/components/ReminderForm/index.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export const ReminderForm = () => {
  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderFormSchema)
  });
  
  // Form implementation
};
```

### API Routes
Implement Next.js API routes with Supabase:

```typescript
// src/app/api/reminders/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { reminderSchema } from '../../features/reminders/schemas';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const listId = searchParams.get('listId');
  
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: false });
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(reminders);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();
  const validatedData = reminderSchema.parse(body);
  
  const { data, error } = await supabase
    .from('reminders')
    .insert([validatedData])
    .select()
    .single();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
```

### Main Page Implementation
Create a reminders page that serves as a server component container:

```typescript
// src/app/reminders/page.tsx
import { Suspense } from 'react';
import { RemindersList } from '../features/reminders/components/RemindersList';
import { ListSelector } from '../features/reminders/components/ListSelector';
import { SearchFilter } from '../features/reminders/components/SearchFilter';

export default function RemindersPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-64 p-4 border-r">
        <Suspense fallback={<ListSelectorSkeleton />}>
          <ListSelector />
        </Suspense>
      </aside>
      
      <main className="flex-1 p-4">
        <SearchFilter />
        <Suspense fallback={<RemindersListSkeleton />}>
          <RemindersList />
        </Suspense>
      </main>
    </div>
  );
}
```

## Design Requirements

### Layout
- Use a two-panel layout for desktop:
  - Left panel: Lists selection (w-64)
  - Right panel: Reminders for the selected list
- Use a stacked layout for mobile:
  - Lists at the top
  - Reminders below
- Implement using Tailwind CSS classes for responsive design

### Visual Elements
- Use ShadCn components for consistent UI
- Use Tailwind colors for list colors
- Use Lucide React icons for UI elements
- Implement clean, minimalist design following macOS aesthetic
- Ensure proper spacing and typography hierarchy
- Implement subtle animations for interactions

### Dark/Light Mode
- Use next-themes for theme management
- Ensure all ShadCn components adapt to theme changes
- Use appropriate color variables for custom styling

## User Interactions
Implement the following user interactions:

1. **Creating a reminder**:
   - Quick add input using Command Menu (cmd+k)
   - Expanded form in a Dialog component

2. **Editing a reminder**:
   - Inline editing for simple changes
   - Full form in Dialog for detailed editing

3. **Completing a reminder**:
   - Checkbox component with animation
   - Optimistic updates using TanStack Query

4. **Managing lists**:
   - CRUD operations with immediate UI updates
   - Color picker using ShadCn's Popover

5. **Filtering and searching**:
   - Debounced search input
   - Filter pills for quick filtering
   - Combined filters using Zustand state

## Advanced Features (Optional)
- Recurring reminders
- Subtasks support
- Tags system
- Browser notifications
- Drag and drop using dnd-kit
- Import/export functionality

## Testing Requirements
- Unit tests for Zustand stores
- Integration tests for TanStack Query hooks
- Component tests using React Testing Library
- E2E tests using Playwright

## Accessibility Requirements
- Implement proper heading hierarchy
- Use appropriate ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain WCAG 2.1 compliance

## Performance Considerations
- Implement proper query caching strategies
- Use optimistic updates for better UX
- Implement infinite scrolling for large lists
- Use proper Suspense boundaries
- Monitor and optimize bundle size
