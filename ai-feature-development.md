# AI Feature Development Workflow

## Overview

This guide provides a step-by-step workflow specifically designed for AI-assisted feature development, integrating Test-Driven Development, GitHub Issues, and production build validation.

## Core Workflow Principles

### 🤖 AI-First Development Rules

1. **Test-Driven Development is MANDATORY** - Always write tests before implementation
2. **Production Build is the Completion Gate** - Features aren't done until `npm run build` succeeds
3. **Follow Established Patterns** - Use Repository-Service-Hooks architecture consistently
4. **Document as You Go** - Update docs throughout development, not at the end
5. **One Feature Per Branch** - Keep changes focused and reviewable

## Step-by-Step Feature Development

### Phase 1: Planning and Setup

#### 1.1 Create GitHub Issue

```bash
# Start with a clear, actionable issue
gh issue create \
  --title "[FEATURE] Add user profile management" \
  --body "## Context
Users need ability to view and edit their profile information.

## Requirements
- View current profile data
- Edit name, email, avatar
- Password change functionality
- Account deletion option

## Acceptance Criteria
- [ ] Profile page displays current user data
- [ ] Edit form validates input properly
- [ ] Changes save successfully with feedback
- [ ] Password change requires current password
- [ ] Account deletion requires confirmation

## Files Likely to Change
- \`src/features/profile/\` (new feature module)
- \`src/app/profile/\` (new page)
- \`src/features/auth/\` (password change integration)" \
  --label "feature,needs-triage"
```

#### 1.2 Create Feature Branch

```bash
# Get the issue number from the previous command
issue_number=42

# Create descriptive branch name
git checkout -b "feature/user-profile-management"

# Link branch to issue
gh issue develop $issue_number
```

#### 1.3 Set Up Feature Structure

```bash
# Create feature module structure following architecture guidelines
mkdir -p src/features/profile/{components,hooks,repository,service,types,utils}
mkdir -p src/app/profile
mkdir -p __tests__/features/profile

# Create initial files
touch src/features/profile/types/profile.ts
touch src/features/profile/repository/profile-repository.ts
touch src/features/profile/service/profile-service.ts
touch src/features/profile/hooks/use-profile.ts
touch src/features/profile/components/ProfileForm.tsx
touch src/app/profile/page.tsx

# Create test files
touch __tests__/features/profile/profile-service.test.ts
touch __tests__/features/profile/profile-form.test.tsx
```

### Phase 2: Test-Driven Development

#### 2.1 Define Types First

```typescript
// src/features/profile/types/profile.ts
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

#### 2.2 Write Repository Tests

```typescript
// __tests__/features/profile/profile-repository.test.ts
import { ProfileRepository } from '@/features/profile/repository/profile-repository';

describe('ProfileRepository', () => {
  let repository: ProfileRepository;

  beforeEach(() => {
    repository = new ProfileRepository();
  });

  it('should get user profile by id', async () => {
    const profile = await repository.getProfile('user-123');
    
    expect(profile).toBeDefined();
    expect(profile.id).toBe('user-123');
    expect(profile.email).toBeDefined();
    expect(profile.name).toBeDefined();
  });

  it('should update user profile', async () => {
    const updates = { name: 'Updated Name' };
    const updated = await repository.updateProfile('user-123', updates);
    
    expect(updated.name).toBe('Updated Name');
    expect(updated.updatedAt).toBeDefined();
  });

  // Write more tests BEFORE implementing
});
```

#### 2.3 Write Service Tests

```typescript
// __tests__/features/profile/profile-service.test.ts
import { ProfileService } from '@/features/profile/service/profile-service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    service = new ProfileService();
  });

  it('should validate profile updates', async () => {
    const updates = { name: '' }; // Invalid empty name
    
    await expect(service.updateProfile('user-123', updates))
      .rejects
      .toThrow('Name cannot be empty');
  });

  it('should change password with validation', async () => {
    const request = {
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    };
    
    await expect(service.changePassword('user-123', request))
      .resolves
      .not.toThrow();
  });

  // Continue with comprehensive test coverage
});
```

#### 2.4 Write Component Tests

```typescript
// __tests__/features/profile/profile-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '@/features/profile/components/ProfileForm';

describe('ProfileForm', () => {
  const mockProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  it('renders profile data correctly', () => {
    render(<ProfileForm profile={mockProfile} onSave={jest.fn()} />);
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('validates form submission', async () => {
    const mockOnSave = jest.fn();
    render(<ProfileForm profile={mockProfile} onSave={mockOnSave} />);
    
    // Clear name field
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: '' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
    
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  // Add more comprehensive tests
});
```

#### 2.5 Run Tests (They Should Fail)

```bash
# Run tests to confirm they fail properly
npm test -- --testPathPattern=profile

# Expected output: All tests should FAIL
# This confirms tests are written correctly
```

### Phase 3: Implementation

#### 3.1 Implement Repository Layer

```typescript
// src/features/profile/repository/profile-repository.ts
import { createClient } from '@/lib/supabase/client';
import { UserProfile, UpdateProfileRequest } from '../types/profile';

export class ProfileRepository {
  private supabase = createClient();

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  async updateProfile(userId: string, updates: UpdateProfileRequest): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }
}
```

#### 3.2 Implement Service Layer

```typescript
// src/features/profile/service/profile-service.ts
import { ProfileRepository } from '../repository/profile-repository';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types/profile';

export class ProfileService {
  constructor(private repository: ProfileRepository) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const profile = await this.repository.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, updates: UpdateProfileRequest): Promise<UserProfile> {
    // Validation
    if (updates.name !== undefined && updates.name.trim() === '') {
      throw new Error('Name cannot be empty');
    }

    return this.repository.updateProfile(userId, updates);
  }

  async changePassword(userId: string, request: ChangePasswordRequest): Promise<void> {
    // Validation
    if (request.newPassword !== request.confirmPassword) {
      throw new Error('New passwords do not match');
    }

    if (request.newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }

    // Implementation would integrate with auth service
    // This is where you'd call Supabase auth.updateUser()
  }
}
```

#### 3.3 Implement Hook Layer

```typescript
// src/features/profile/hooks/use-profile.ts
import { useState, useEffect } from 'react';
import { ProfileService } from '../service/profile-service';
import { UserProfile } from '../types/profile';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const profileService = new ProfileService();
    
    profileService.getProfile(userId)
      .then(setProfile)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { profile, isLoading, error };
}
```

#### 3.4 Implement Components

```typescript
// src/features/profile/components/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { UserProfile, UpdateProfileRequest } from '../types/profile';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (updates: UpdateProfileRequest) => Promise<void>;
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave({ name: name.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={profile.email}
          disabled
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

#### 3.5 Implement Page

```typescript
// src/app/profile/page.tsx
import { ProfileContainer } from '@/features/profile/components/ProfileContainer';

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <ProfileContainer />
    </div>
  );
}
```

#### 3.6 Run Tests After Each Implementation

```bash
# After implementing repository
npm test -- --testPathPattern=profile-repository

# After implementing service
npm test -- --testPathPattern=profile-service

# After implementing components
npm test -- --testPathPattern=profile-form

# All tests should now PASS
npm test -- --testPathPattern=profile
```

### Phase 4: Integration and Refinement

#### 4.1 Manual Testing

```bash
# Start development server
npm run dev

# Test the feature manually:
# 1. Navigate to /profile
# 2. Verify profile data loads
# 3. Test form validation
# 4. Test successful updates
# 5. Check error handling
```

#### 4.2 Continuous Quality Checks

```bash
# Run throughout development
npm run lint:fix
npm run type-check

# Fix any issues immediately
```

### Phase 5: Pre-Completion Validation

#### 5.1 Final Test Suite

```bash
# Run all tests
npm test

# Ensure 100% of new tests pass
npm test -- --coverage --testPathPattern=profile
```

#### 5.2 Build Validation (CRITICAL)

```bash
# MANDATORY: Production build must succeed
npm run build

# If build fails, debug and fix:
# 1. Check TypeScript errors
# 2. Verify imports/exports
# 3. Check for missing dependencies
# 4. Review environment variables

# Keep trying until build succeeds
npm run build && echo "✅ Build successful - feature ready!"
```

#### 5.3 Final Validation Sequence

```bash
# Complete validation (all must pass)
npm run lint:fix     # Fix any linting issues
npm run type-check   # No TypeScript errors
npm test            # All tests pass
npm run build       # Production build succeeds

# Only proceed to PR if all commands exit with code 0
```

### Phase 6: Pull Request and Deployment

#### 6.1 Create Pull Request

```bash
# Push feature branch
git add .
git commit -m "feat(profile): implement user profile management

Complete implementation of user profile viewing and editing:
- Profile data display and editing
- Form validation and error handling  
- Password change functionality
- Account deletion with confirmation

Closes #42"

git push origin feature/user-profile-management

# Create PR with preview deployment link
gh pr create \
  --title "feat(profile): implement user profile management" \
  --body "Complete implementation of user profile management feature.

## Summary
- ✅ Profile viewing and editing
- ✅ Form validation and error handling
- ✅ Password change functionality  
- ✅ Account deletion with confirmation
- ✅ Comprehensive test coverage
- ✅ Production build verified

## Testing
- All tests pass locally
- Manual testing completed
- Production build successful

## Preview
Vercel will automatically create preview deployment.

Closes #42"
```

#### 6.2 Verify Preview Deployment

```bash
# Vercel automatically creates preview URL
# Test on preview deployment:
# 1. Feature works in production environment
# 2. No console errors
# 3. Performance is acceptable
# 4. Integration with external services works
```

## AI Development Best Practices

### 🎯 Focus Areas for AI

1. **Start with Clear Requirements** - Well-defined issues lead to better implementations
2. **Test-First Mentality** - Write comprehensive tests before any implementation
3. **Follow Architecture Patterns** - Use established Repository-Service-Hooks structure
4. **Validate Continuously** - Run tests and builds frequently during development
5. **Document Decisions** - Explain complex logic and architectural choices

### 🚨 Critical Checkpoints

- **After Writing Tests**: All tests should FAIL initially
- **After Each Implementation Layer**: Corresponding tests should PASS
- **Before Any Commit**: Linting and type checking must pass
- **Before PR Creation**: Production build MUST succeed
- **After PR Creation**: Preview deployment must work correctly

### 🔄 Iteration Pattern

```bash
# 1. Write failing test
# 2. Implement minimal code to pass test
# 3. Refactor while keeping tests green
# 4. Run build validation
# 5. Repeat for next component

# This cycle ensures high quality and maintainable code
```

### ⚡ Quick Commands for AI

```bash
# Feature setup
mkdir -p src/features/[feature-name]/{components,hooks,repository,service,types}
mkdir -p __tests__/features/[feature-name]

# Test-driven cycle
npm test -- --testPathPattern=[feature-name] --watch

# Validation sequence
npm run lint:fix && npm run type-check && npm test && npm run build

# Create issue and branch
gh issue create --title "[FEATURE] Description" --label "feature"
git checkout -b "feature/descriptive-name"

# Final PR creation
gh pr create --title "feat(scope): description" --body "Implementation details..."
```

This workflow ensures consistent, high-quality feature development with AI assistance while maintaining production readiness standards.