# Next.js 14 Clean Architecture Feature Implementation Guide

This guide demonstrates how to implement new features in an existing Next.js 14 application using clean architecture principles. We'll use a Todo feature as an example.

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
   - Components
   - API Routes (if needed)
   - Page Component (if needed)

Let's walk through these steps using the Todo feature as an example.

### 1. Feature Directory Structure

Create the following structure for the Todo feature:

```
src/
  features/
    todos/
      components/
        TodoList.tsx
        ErrorBoundary.tsx
      services/
        todoService.ts
      repositories/
        todoRepository.ts
        mockTodoRepository.ts
      schemas.ts
      types.ts
      utils.ts
      index.ts
```

### 2. Implement Feature Components

#### Schemas (`src/features/todos/schemas.ts`)

```typescript
import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title cannot be empty").max(100, "Title is too long"),
  completed: z.boolean(),
});

export const todoListSchema = z.array(todoSchema);

export const createTodoSchema = todoSchema.pick({ title: true });
```

#### Types (`src/features/todos/types.ts`)

```typescript
import { z } from 'zod';
import { todoSchema, todoListSchema, createTodoSchema } from './schemas';

export type Todo = z.infer<typeof todoSchema>;
export type TodoList = z.infer<typeof todoListSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export interface TodoError {
  message: string;
  code?: string;
}
```

#### Repository Interface (`src/features/todos/repositories/todoRepository.ts`)

```typescript
import { Todo, TodoList, CreateTodoInput } from '../types';

export interface TodoRepository {
  getTodos(): Promise<TodoList>;
  getTodoById(id: string): Promise<Todo>;
  createTodo(todo: CreateTodoInput): Promise<Todo>;
  updateTodo(id: string, todo: Partial<Todo>): Promise<Todo>;
  deleteTodo(id: string): Promise<boolean>;
}
```

#### Repository Implementation (`src/features/todos/repositories/mockTodoRepository.ts`)

```typescript
import { TodoRepository } from './todoRepository';
import { Todo, TodoList, CreateTodoInput } from '../types';
import { todoSchema, todoListSchema } from '../schemas';
import { AppError } from '@/core/errors/AppError';

export class MockTodoRepository implements TodoRepository {
  private todos: TodoList = [
    { id: '1', title: 'Learn Next.js', completed: false },
    { id: '2', title: 'Build a todo app', completed: false },
  ];

  async getTodos(): Promise<TodoList> {
    return todoListSchema.parse(this.todos);
  }

  async getTodoById(id: string): Promise<Todo> {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      throw new AppError('Todo not found', 'NOT_FOUND');
    }
    return todoSchema.parse(todo);
  }

  async createTodo(todo: CreateTodoInput): Promise<Todo> {
    const newTodo = { ...todo, id: Date.now().toString(), completed: false };
    this.todos.push(newTodo);
    return todoSchema.parse(newTodo);
  }

  async updateTodo(id: string, updatedFields: Partial<Todo>): Promise<Todo> {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new AppError('Todo not found', 'NOT_FOUND');
    }
    this.todos[index] = { ...this.todos[index], ...updatedFields };
    return todoSchema.parse(this.todos[index]);
  }

  async deleteTodo(id: string): Promise<boolean> {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(t => t.id !== id);
    return this.todos.length < initialLength;
  }
}
```

#### Service (`src/features/todos/services/todoService.ts`)

```typescript
import { TodoRepository } from '../repositories/todoRepository';
import { Todo, TodoList, CreateTodoInput } from '../types';
import { AppError } from '@/core/errors/AppError';

export class TodoService {
  constructor(private repository: TodoRepository) {}

  async getAllTodos(): Promise<TodoList> {
    try {
      return await this.repository.getTodos();
    } catch (error) {
      throw new AppError('Failed to fetch todos', 'FETCH_ERROR');
    }
  }

  async addTodo(todo: CreateTodoInput): Promise<Todo> {
    try {
      return await this.repository.createTodo(todo);
    } catch (error) {
      throw new AppError('Failed to create todo', 'CREATE_ERROR');
    }
  }

  async toggleTodoCompletion(id: string): Promise<Todo> {
    try {
      const todo = await this.repository.getTodoById(id);
      return await this.repository.updateTodo(id, { completed: !todo.completed });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to toggle todo completion', 'UPDATE_ERROR');
    }
  }

  async deleteTodo(id: string): Promise<boolean> {
    try {
      return await this.repository.deleteTodo(id);
    } catch (error) {
      throw new AppError('Failed to delete todo', 'DELETE_ERROR');
    }
  }
}
```

#### Components (`src/features/todos/components/TodoList.tsx`)

```typescript
import React, { useState } from 'react';
import { Todo, TodoList as TodoListType, CreateTodoInput, TodoError } from '../types';
import { TodoService } from '../services/todoService';
import { createTodoSchema } from '../schemas';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, PlusCircle } from 'lucide-react'
import { ErrorBoundary } from './ErrorBoundary';

interface TodoListProps {
  initialTodos: TodoListType;
  todoService: TodoService;
}

export const TodoList: React.FC<TodoListProps> = ({ initialTodos, todoService }) => {
  const [todos, setTodos] = useState<TodoListType>(initialTodos);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [error, setError] = useState<TodoError | null>(null);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const input: CreateTodoInput = { title: newTodoTitle };
      await createTodoSchema.parseAsync(input);
      const newTodo = await todoService.addTodo(input);
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
    } catch (err) {
      if (err instanceof Error) {
        setError({ message: err.message });
      }
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const updatedTodo = await todoService.toggleTodoCompletion(id);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err) {
      if (err instanceof Error) {
        setError({ message: err.message });
      }
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const success = await todoService.deleteTodo(id);
      if (success) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError({ message: err.message });
      }
    }
  };

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error.message}</div>}
          <ul className="space-y-2">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    id={`todo-${todo.id}`}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.title}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <form onSubmit={addTodo} className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Add a new todo"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
};

export default TodoList;
```

### 3. Implement API Routes (if needed)

Create a new file `src/app/api/todos/route.ts`:

```typescript
import { TodoService } from '@/features/todos/services/todoService';
import { MockTodoRepository } from '@/features/todos/repositories/mockTodoRepository';
import { createTodoSchema, todoListSchema } from '@/features/todos/schemas';
import { NextResponse } from 'next/server';
import { AppError } from '@/core/errors/AppError';

const todoRepository = new MockTodoRepository();
const todoService = new TodoService(todoRepository);

export async function GET() {
  try {
    const todos = await todoService.getAllTodos();
    return NextResponse.json(todoListSchema.parse(todos));
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createTodoSchema.parse(body);
    const newTodo = await todoService.addTodo(validatedData);
    return NextResponse.json(newTodo);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### 4. Implement Page Component (if needed)

Create a new file `src/app/todos/page.tsx`:

```typescript
import { TodoList } from '@/features/todos/components/TodoList';
import { TodoService } from '@/features/todos/services/todoService';
import { MockTodoRepository } from '@/features/todos/repositories/mockTodoRepository';

export default async function TodosPage() {
  const todoRepository = new MockTodoRepository();
  const todoService = new TodoService(todoRepository);
  
  try {
    const todos = await todoService.getAllTodos();
    return <TodoList initialTodos={todos} todoService={todoService} />;
  } catch (error) {
    return <div>Error loading todos. Please try again later.</div>;
  }
}
```

## Best Practices

When implementing new features, keep these best practices in mind:

- Use Zod schemas for all data validation and type inference
- Keep the repository implementation (mock or real) separate from the interface
- Use dependency injection to provide the repository to the service
- Implement proper error handling in both frontend and API routes
- Use existing UI components from the `components/ui` directory for consistent styling
- Ensure all components work well in both light and dark modes
- Consider using global state management (e.g., Zustand) for complex state requirements
- Implement progressive enhancement techniques for better performance and accessibility

By following this guide and the provided example, you can implement new features in your existing Next.js application while maintaining a clean and scalable architecture.
