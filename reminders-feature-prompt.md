# Reminders Feature Implementation

## Overview
Create a Reminders feature that mirrors the core functionality of Apple's Reminders app. This feature should allow users to create, manage, and organize reminders with due dates, priorities, and categories/lists.

## Core Functionality Requirements
1. Create and manage reminder lists (categories)
2. Add, edit, and delete individual reminders
3. Set due dates and times for reminders
4. Mark reminders as completed
5. Set priority levels for reminders
6. Search and filter reminders
7. Responsive design that works well on all device sizes

## Technical Implementation

### Data Model
Implement the following data models:

```typescript
// ReminderList model
interface ReminderList {
  id: string;
  name: string;
  color: string; // Hex color code for the list
  icon?: string; // Optional Lucide icon name
  createdAt: Date;
  updatedAt: Date;
}

// Reminder model
interface Reminder {
  id: string;
  listId: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'none' | 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}
```

### Feature Structure
Follow this structure for the Reminders feature:

```
src/app/features/reminders/
├── components/
│   ├── RemindersList.tsx
│   ├── ReminderItem.tsx
│   ├── ReminderForm.tsx
│   ├── ListSelector.tsx
│   ├── PrioritySelector.tsx
│   ├── DateTimePicker.tsx
│   └── SearchFilter.tsx
├── hooks/
│   ├── useReminders.ts
│   └── useReminderLists.ts
├── repository/
│   ├── reminderRepository.interface.ts
│   ├── mockReminderRepository.ts
│   └── mockData.ts
├── service/
│   ├── reminderService.interface.ts
│   └── reminderService.ts
├── types/
│   └── index.ts
└── utils/
    └── reminderUtils.ts
```

### UI Components
Create the following UI components using shadcn components:

1. **RemindersList**: Display reminders in a list format, grouped by their lists
2. **ReminderItem**: Individual reminder component with completion checkbox, title, due date
3. **ReminderForm**: Form for creating/editing reminders
4. **ListSelector**: Component to select and manage reminder lists
5. **PrioritySelector**: Component to set priority levels
6. **DateTimePicker**: Component for setting due dates and times
7. **SearchFilter**: Component for searching and filtering reminders

### Main Page Implementation
Create a reminders page at `/src/app/reminders/page.tsx` that serves as a server component container for the client-side Reminders feature.

### State Management
Implement state management using React hooks (useState, useReducer) and context if needed. All interactive functionality should be in client components.

### Mock Data
Generate mock data that includes:
- At least 5 reminder lists with different colors
- At least 20 reminders spread across the lists
- Variety of priorities, due dates, and completion statuses

## Design Requirements

### Layout
- Use a two-panel layout for desktop:
  - Left panel: Lists selection
  - Right panel: Reminders for the selected list
- Use a stacked layout for mobile:
  - Lists at the top
  - Reminders below

### Visual Elements
- Use Tailwind colors for list colors
- Use appropriate Lucide React icons for UI elements
- Implement clean, minimalist design following macOS aesthetic
- Ensure proper spacing and typography hierarchy
- Implement subtle animations for interactions (hover, click)

### Dark/Light Mode
- Ensure all components look great in both dark and light modes
- Use next-themes variables appropriately

## User Interactions
Implement the following user interactions:

1. **Creating a reminder**:
   - Quick add input at the top of the list
   - Expanded form for detailed information

2. **Editing a reminder**:
   - Click to edit or dedicated edit button
   - Form should pre-populate with existing data

3. **Completing a reminder**:
   - Checkbox to mark as complete
   - Completed items should be visually distinct
   - Option to show/hide completed items

4. **Managing lists**:
   - Create, rename, and delete lists
   - Color picker for list customization
   - Drag and drop for reordering (optional)

5. **Filtering and searching**:
   - Search by reminder title/notes
   - Filter by due date (today, upcoming, all)
   - Filter by priority
   - Filter by completion status

## Advanced Features (Implement if time permits)
- Recurring reminders (daily, weekly, monthly)
- Subtasks within reminders
- Tags for cross-list organization
- Reminder notifications (browser notifications)
- Drag and drop for organizing reminders
- Import/export functionality

## Implementation Approach
1. Start with data models and repository implementation
2. Create basic UI components without complex interactions
3. Implement core CRUD functionality
4. Add filtering and search capabilities
5. Enhance the UI with animations and polish
6. Implement advanced features if time permits

## Testing Requirements
- Ensure all components render correctly in both dark and light modes
- Test on multiple screen sizes for responsive design
- Test all CRUD operations
- Verify search and filter functionality works as expected

## Accessibility Considerations
- Ensure proper keyboard navigation
- Use appropriate ARIA attributes
- Maintain sufficient color contrast
- Implement proper focus states
