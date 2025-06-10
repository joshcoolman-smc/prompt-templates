# Code Review Template

## Overview
Please perform a comprehensive code review of the provided code/changes. Focus on code quality, best practices, security, performance, and maintainability. Provide specific, actionable feedback with examples where applicable.

## Review Scope
**Files to Review**: [Specify files or paste code here]
**Context**: [Brief description of what this code does and its purpose]
**Change Type**: [New feature / Bug fix / Refactor / Performance improvement / Other]

## Review Criteria

### 1. Code Quality & Style
- [ ] **Readability**: Is the code clear and easy to understand?
- [ ] **Naming**: Are variables, functions, and components well-named?
- [ ] **Code Organization**: Is the code logically structured?
- [ ] **Consistency**: Does it follow established project patterns?
- [ ] **Comments**: Are complex logic sections properly documented?

### 2. React/TypeScript Best Practices
- [ ] **Component Design**: Are components focused and single-purpose?
- [ ] **Hooks Usage**: Are hooks used correctly and efficiently?
- [ ] **Props & Types**: Are all props properly typed with interfaces?
- [ ] **State Management**: Is state handled appropriately?
- [ ] **Re-renders**: Are unnecessary re-renders avoided?

### 3. Performance Considerations
- [ ] **Bundle Size**: Are imports optimized (tree-shaking friendly)?
- [ ] **Memoization**: Are expensive operations properly memoized?
- [ ] **Lazy Loading**: Should components or imports be lazy-loaded?
- [ ] **Event Handlers**: Are event handlers optimized?
- [ ] **DOM Operations**: Are DOM manipulations minimized?

### 4. Security Review
- [ ] **Input Validation**: Is user input properly validated and sanitized?
- [ ] **XSS Prevention**: Are dynamic content and user inputs safely rendered?
- [ ] **API Security**: Are API calls secure and authenticated?
- [ ] **Sensitive Data**: Are secrets/keys properly handled?
- [ ] **Dependencies**: Are third-party packages secure and up-to-date?

### 5. Error Handling & Resilience
- [ ] **Error Boundaries**: Are error boundaries implemented where needed?
- [ ] **API Error Handling**: Are network failures gracefully handled?
- [ ] **Loading States**: Are loading and error states properly managed?
- [ ] **Fallbacks**: Are appropriate fallbacks provided?
- [ ] **User Feedback**: Do users get clear feedback on errors?

### 6. Accessibility (a11y)
- [ ] **Semantic HTML**: Are proper HTML elements used?
- [ ] **ARIA Labels**: Are ARIA attributes correctly implemented?
- [ ] **Keyboard Navigation**: Is keyboard navigation supported?
- [ ] **Screen Readers**: Is the content accessible to screen readers?
- [ ] **Color Contrast**: Does the UI meet accessibility standards?

### 7. Testing Considerations
- [ ] **Test Coverage**: Are new features covered by tests?
- [ ] **Test Quality**: Are tests meaningful and well-structured?
- [ ] **Edge Cases**: Are edge cases and error conditions tested?
- [ ] **Integration Tests**: Are component interactions tested?
- [ ] **Accessibility Tests**: Are accessibility features tested?

### 8. Architecture & Design Patterns
- [ ] **Separation of Concerns**: Are responsibilities properly separated?
- [ ] **DRY Principle**: Is code duplication minimized?
- [ ] **SOLID Principles**: Does the design follow SOLID principles?
- [ ] **Design Patterns**: Are appropriate patterns used?
- [ ] **Scalability**: Will this code scale with the application?

## Review Questions to Address

### Functionality
1. Does the code accomplish its intended purpose?
2. Are all requirements met?
3. Are there any logical errors or bugs?
4. Does it handle edge cases appropriately?

### Maintainability
1. How easy would this code be to modify in the future?
2. Are there any code smells or anti-patterns?
3. Is the code self-documenting or well-commented?
4. Would a new team member understand this code?

### Integration
1. How does this code interact with existing systems?
2. Are there any breaking changes?
3. Is backward compatibility maintained?
4. Are APIs and interfaces properly defined?

## Feedback Format

### For each issue found, provide:
1. **Severity Level**: 
   - 🔴 **Critical**: Must be fixed (security, functionality)
   - 🟡 **Important**: Should be fixed (performance, maintainability)
   - 🔵 **Suggestion**: Nice to have (style, optimization)

2. **Location**: Specific file and line number if applicable

3. **Description**: Clear explanation of the issue

4. **Recommendation**: Specific suggestion for improvement

5. **Example**: Code example showing the recommended fix

### Example Feedback Entry:
**🟡 Important - Component Re-renders**
- **Location**: `src/components/UserProfile.tsx:45`
- **Issue**: Component re-renders on every parent update due to inline object creation
- **Recommendation**: Move the style object outside the component or use useMemo
- **Example**:
  ```tsx
  // Instead of:
  <div style={{padding: '10px', margin: '5px'}}>
  
  // Use:
  const containerStyle = {padding: '10px', margin: '5px'};
  <div style={containerStyle}>
  ```

## Additional Review Prompts

### Code Quality Deep Dive
"Please analyze this code for potential improvements in readability, maintainability, and performance. Focus specifically on [area of concern]."

### Security Review
"Perform a security-focused review of this code. Pay special attention to input validation, authentication, and potential vulnerabilities."

### Performance Analysis
"Review this code for performance bottlenecks. Identify any expensive operations, unnecessary re-renders, or optimization opportunities."

### Architecture Review
"Evaluate the architectural decisions in this code. Does it follow established patterns? How well does it integrate with the existing codebase?"

## Summary Request

At the end of the review, please provide:

1. **Overall Assessment**: Brief summary of code quality
2. **Critical Issues**: List of must-fix issues
3. **Improvement Opportunities**: Key areas for enhancement
4. **Positive Aspects**: What was done well
5. **Next Steps**: Recommended actions before merging/deploying
