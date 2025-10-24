---
description: Review code for production readiness and suggest improvements
---

I need to review this code: $ARGUMENTS

## My Role

I'm conducting a thorough code review as an experienced developer. I'll analyze the file for production readiness, clean code principles, and opportunities for improvement.

## Review Criteria

### 1. Component Structure & Separation of Concerns

**Component Complexity:**
- Is this component doing too much?
- Should it be broken into smaller, focused components?
- Are there obvious UI sections that could be extracted?
- Is the component reusable or too specific?

**Business Logic Location:**
- Is business logic embedded in the component?
- Should logic be extracted to custom hooks?
- Are there service layer operations happening in the UI?
- Is data transformation happening in render logic?

**Props and State:**
- Is state management appropriate for this component?
- Are there too many useState calls (consider useReducer)?
- Should state be lifted up or pushed down?
- Are props being drilled unnecessarily?

### 2. File Length and Readability

**Line Count Assessment:**
- Components over 200 lines: Strong candidate for splitting
- Components over 300 lines: Should definitely be refactored
- Files over 400 lines: Critical refactoring needed

**Cognitive Complexity:**
- Are there deeply nested conditions?
- Is the render logic easy to follow?
- Can you understand the component flow quickly?
- Are there too many responsibilities?

### 3. Custom Hook Opportunities

**Extract to hooks when I see:**
- Data fetching patterns
- Form state management
- Complex state logic with multiple setState calls
- Side effects with useEffect
- Reusable stateful logic
- API calls and loading states
- Event handlers with complex logic

### 4. Reusable Component Extraction

**Look for patterns like:**
- Repeated JSX structures
- Similar UI elements with slight variations
- Card/list item patterns
- Form field groups
- Modal/dialog content
- Layout wrappers

### 5. Code Quality Issues

**Check for:**
- Proper TypeScript typing (no `any` types)
- Missing error handling
- Unhandled edge cases
- Missing loading states
- Accessibility issues (missing labels, ARIA attributes)
- Performance concerns (missing memoization, unnecessary re-renders)
- Console logs or debug code left in
- Commented-out code that should be removed

### 6. Clean Architecture Compliance

**Repository-Service-Hooks Pattern:**
- Is the component calling repositories directly? (should use hooks)
- Is business logic in the component? (should be in services)
- Are there hardcoded API calls? (should be in repositories)
- Is dependency injection being used properly?

**Feature Module Organization:**
- Is this in the right location?
- Should it be in a feature module?
- Are imports organized correctly?
- Is it importing from the right layers?

### 7. Next.js Specific Concerns

**Server vs Client Components:**
- Is 'use client' necessary or could this be a Server Component?
- Is a page route accidentally marked as 'use client'?
- Should data fetching happen server-side?
- Are client-only APIs being used appropriately?

**Container-Display Pattern:**
- If this is a page, should it delegate to a display component?
- Is orchestration separated from presentation?
- Could this be split into container + display?

## My Review Process

### Step 1: Initial Assessment
I'll start by reading through the entire file and noting:
- Overall purpose and responsibility
- Current line count
- Immediate red flags
- General structure

### Step 2: Detailed Analysis
I'll analyze each section:
- Imports and dependencies
- Type definitions
- State management
- Business logic
- Side effects
- Render logic
- Event handlers

### Step 3: Specific Recommendations
For each issue found, I'll provide:
- **What**: Clear description of the issue
- **Why**: Explanation of why it matters
- **How**: Specific refactoring suggestion with approach
- **Priority**: High/Medium/Low based on impact

### Step 4: Refactoring Plan
If significant changes are needed, I'll propose:
- Files to create (new components, hooks, services)
- Code to extract and where it should go
- Order of refactoring (safest approach)
- What can be done incrementally vs all at once

## Example Improvements I Look For

### Extract Custom Hooks
**Before:** Component with data fetching, loading state, error handling
**After:** `useUserProfile` hook that encapsulates all of that

### Split Large Components
**Before:** 300-line UserDashboard component
**After:** UserDashboard + UserStats + UserActivity + UserSettings components

### Create Reusable Components
**Before:** Repeated card markup throughout
**After:** Shared `<Card>` component in components/ui/

### Move Business Logic
**Before:** Data transformation and validation in component
**After:** Logic in service layer, component just renders

### Improve Type Safety
**Before:** `any` types, optional chaining everywhere
**After:** Proper interfaces, type guards, handled nulls

## What I Won't Do

**I won't:**
- Suggest changes just for the sake of changing
- Over-engineer simple components
- Break apart components that are appropriately sized
- Recommend abstractions that add complexity without value
- Nitpick formatting if the code is functionally sound

**I will:**
- Be pragmatic about what actually needs improvement
- Prioritize changes by impact
- Suggest incremental improvements
- Focus on maintainability and readability
- Consider the component's context and usage

## Output Format

I'll provide my review in this structure:

**📊 File Overview**
- Purpose and current state
- Line count and complexity assessment
- Overall code quality rating

**🔴 Critical Issues** (fix now)
- Major problems affecting functionality or maintainability
- Specific fixes with code suggestions

**🟡 Suggested Improvements** (should address)
- Refactoring opportunities
- Extraction candidates (hooks, components)
- Architecture alignment issues

**🟢 Nice-to-Haves** (optional)
- Minor optimizations
- Style improvements
- Future considerations

**✅ What's Good**
- Things that are well-done
- Patterns being followed correctly
- Positive reinforcement

**🎯 Refactoring Plan** (if needed)
- Step-by-step approach
- Files to create
- Order of operations

Now let me review: **$ARGUMENTS**

I'll provide honest, actionable feedback to help make this code production-ready.
