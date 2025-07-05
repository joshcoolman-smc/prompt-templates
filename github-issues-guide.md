# GitHub Issues Guide

## Overview

This guide provides comprehensive workflows for managing GitHub Issues using the GitHub CLI, including best practices for AI collaboration, issue templates, and integration with development workflows.

## GitHub CLI Setup

### Installation

```bash
# macOS (Homebrew)
brew install gh

# Alternative installation methods
# npm install -g @github/cli
# Download from: https://github.com/cli/cli/releases
```

### Authentication

```bash
# Login with web browser
gh auth login

# Login with token
gh auth login --with-token < token.txt

# Check authentication status
gh auth status
```

### Configuration

```bash
# Set default editor
gh config set editor "code --wait"

# Set default protocol
gh config set git_protocol https

# View all configuration
gh config list
```

## Core Issue Management Commands

### Creating Issues

```bash
# Interactive issue creation
gh issue create

# Create issue with title and body
gh issue create --title "Add user authentication" --body "Implement login/logout functionality"

# Create issue from template
gh issue create --template bug_report.md

# Create issue with labels and assignees
gh issue create \
  --title "Fix navigation menu" \
  --body "Menu items not responsive on mobile" \
  --label "bug,ui" \
  --assignee "username"

# Create issue and immediately start working on it
gh issue create --title "Feature: Dark mode toggle" && gh issue develop $(gh issue list --limit 1 --json number --jq '.[0].number')
```

### Listing and Viewing Issues

```bash
# List all open issues
gh issue list

# List issues with filters
gh issue list --state open
gh issue list --state closed
gh issue list --label "bug"
gh issue list --assignee "@me"
gh issue list --author "username"

# List issues in specific format
gh issue list --json number,title,labels --jq '.[] | "\(.number): \(.title)"'

# View specific issue
gh issue view 42
gh issue view 42 --web  # Open in browser

# View issue with comments
gh issue view 42 --comments
```

### Managing Issues

```bash
# Close an issue
gh issue close 42

# Close with comment
gh issue close 42 --comment "Fixed in PR #43"

# Reopen an issue
gh issue reopen 42

# Edit issue title/body
gh issue edit 42 --title "New title"
gh issue edit 42 --body "Updated description"

# Add labels
gh issue edit 42 --add-label "bug,priority:high"

# Remove labels
gh issue edit 42 --remove-label "needs-triage"

# Assign issue
gh issue edit 42 --add-assignee "username"

# Pin important issues
gh issue pin 42
gh issue unpin 42
```

### Development Workflow Integration

```bash
# Create branch from issue (GitHub CLI extension)
gh extension install github/gh-issue

# Create and checkout branch for issue
gh issue develop 42

# Alternative manual approach
issue_number=42
issue_title=$(gh issue view $issue_number --json title --jq '.title')
branch_name="feature/$(echo "$issue_title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')"
git checkout -b "$branch_name"
```

## Issue Templates

### Bug Report Template

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: "[BUG] "
labels: bug, needs-triage
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
A clear description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120.0]
- Node.js: [e.g. 18.17.0]
- Project version: [e.g. 1.2.3]

## Additional Context
Add any other context about the problem here.

## Acceptance Criteria
- [ ] Bug is fixed
- [ ] Tests are added to prevent regression
- [ ] Documentation is updated if needed
```

### Feature Request Template

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: "[FEATURE] "
labels: enhancement, needs-triage
assignees: ''
---

## Feature Summary
A clear and concise description of the feature you'd like to see.

## Problem Statement
What problem does this feature solve? Is your feature request related to a problem?

## Proposed Solution
Describe the solution you'd like to see implemented.

## Alternative Solutions
Describe any alternative solutions or features you've considered.

## User Stories
- As a [user type], I want [functionality] so that [benefit]
- As a [user type], I want [functionality] so that [benefit]

## Acceptance Criteria
- [ ] Feature requirement 1
- [ ] Feature requirement 2
- [ ] Feature requirement 3
- [ ] Tests are written
- [ ] Documentation is updated

## Technical Considerations
- Dependencies needed
- Potential challenges
- Performance implications

## Design Mockups
If applicable, add wireframes or design mockups.

## Priority
- [ ] Low
- [ ] Medium
- [ ] High
- [ ] Critical
```

### Enhancement Template

```markdown
---
name: Enhancement
about: Improve existing functionality
title: "[ENHANCEMENT] "
labels: enhancement, needs-triage
assignees: ''
---

## Current Behavior
Describe how the feature currently works.

## Proposed Enhancement
Describe the improvement you'd like to see.

## Benefits
- Benefit 1
- Benefit 2
- Benefit 3

## Implementation Ideas
Suggestions for how this could be implemented.

## Acceptance Criteria
- [ ] Enhancement requirement 1
- [ ] Enhancement requirement 2
- [ ] Tests are updated
- [ ] Documentation is updated

## Breaking Changes
Will this introduce any breaking changes? If so, describe migration path.
```

## AI-Friendly Issue Patterns

### Clear Context Structure

```markdown
## Context
[Brief background information]

## Problem
[Specific issue or need]

## Solution
[Proposed approach or requirements]

## Implementation Notes
[Technical details, constraints, or preferences]

## Files Likely to Change
- `src/components/Auth/LoginForm.tsx`
- `src/lib/auth/auth-service.ts`
- `src/app/api/auth/login/route.ts`

## Related Issues/PRs
- Relates to #123
- Depends on #456
```

### Structured Requirements

```markdown
## Functional Requirements
1. User must be able to login with email/password
2. System must validate credentials server-side
3. Failed login attempts must be logged

## Technical Requirements
1. Use existing authentication service
2. Follow repository-service-hooks pattern
3. Include comprehensive error handling

## Acceptance Criteria
- [ ] Login form validates input client-side
- [ ] Server validates credentials and returns appropriate responses
- [ ] Error messages are user-friendly
- [ ] Loading states are handled properly
- [ ] Tests cover happy path and error cases
```

## Labeling System

### Priority Labels
- `priority:critical` - System is broken, immediate fix needed
- `priority:high` - Important feature or serious bug
- `priority:medium` - Standard enhancement or minor bug
- `priority:low` - Nice-to-have improvement

### Type Labels
- `bug` - Something is broken
- `feature` - New functionality
- `enhancement` - Improvement to existing functionality
- `documentation` - Documentation changes
- `refactor` - Code improvements without functional changes
- `performance` - Performance-related improvements

### Status Labels
- `needs-triage` - Needs initial review and prioritization
- `ready-for-dev` - Approved and ready for development
- `in-progress` - Currently being worked on
- `blocked` - Waiting on external dependencies
- `needs-review` - Implementation complete, needs review

### Component Labels
- `frontend` - UI/UX related
- `backend` - Server-side changes
- `api` - API endpoint changes
- `database` - Database schema or query changes
- `auth` - Authentication/authorization
- `testing` - Test-related changes

## Issue Lifecycle Workflow

### 1. Issue Creation
```bash
# Create issue with proper template and labels
gh issue create \
  --template feature_request.md \
  --title "[FEATURE] Add dark mode toggle" \
  --label "feature,frontend,needs-triage"
```

### 2. Triage and Planning
```bash
# Review and update labels
gh issue edit 42 \
  --add-label "priority:medium,ready-for-dev" \
  --remove-label "needs-triage" \
  --add-assignee "developer-username"
```

### 3. Development Start
```bash
# Create branch from issue
gh issue develop 42

# Or manually create branch following naming convention
git checkout -b "feature/dark-mode-toggle"
```

### 4. Work Progress
```bash
# Update issue status
gh issue edit 42 --add-label "in-progress"

# Reference issue in commits
git commit -m "feat(ui): add dark mode toggle component

Implements basic toggle functionality for dark/light theme switching.

Related to #42"
```

### 5. Completion
```bash
# Create PR that closes issue
gh pr create \
  --title "feat(ui): add dark mode toggle" \
  --body "Implements dark mode toggle functionality.

Closes #42

## Changes
- Added ThemeToggle component
- Implemented theme context
- Updated global styles for dark mode

## Testing
- Added unit tests for ThemeToggle
- Tested theme persistence across sessions"

# PR merge will automatically close the issue
```

## Advanced Workflows

### Bulk Issue Management

```bash
# Close multiple issues
gh issue list --label "duplicate" --json number --jq '.[].number' | xargs -I {} gh issue close {}

# Add label to multiple issues
gh issue list --search "login" --json number --jq '.[].number' | xargs -I {} gh issue edit {} --add-label "auth"

# List issues by milestone
gh issue list --milestone "v1.0.0"
```

### Issue Search and Filtering

```bash
# Search issues by text
gh issue list --search "authentication"

# Complex queries
gh issue list --search "is:open label:bug author:username"

# Search closed issues
gh issue list --state closed --search "login"

# Search by date range
gh issue list --search "created:>2023-12-01"
```

### Issue Analytics

```bash
# Count issues by label
gh issue list --json labels --jq '[.[].labels[].name] | group_by(.) | map({label: .[0], count: length})'

# List issues by assignee
gh issue list --json assignees,title,number --jq 'group_by(.assignees[0].login) | map({assignee: .[0].assignees[0].login, issues: map("\(.number): \(.title)")})'

# Show issue velocity (requires jq processing)
gh issue list --state closed --json closedAt,createdAt --jq 'map((.closedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) | add / length / 86400'
```

## Integration with Development Workflow

### Connecting to Existing Workflow

This guide integrates with the branch naming and commit conventions from `development-workflow.md`:

**Branch Creation from Issues:**
```bash
# Issue #42: "Add user authentication"
gh issue develop 42
# Creates branch: feature/add-user-authentication
```

**Commit Messages Referencing Issues:**
```bash
# Following conventional commit format
git commit -m "feat(auth): implement login form validation

Adds client-side validation for email and password fields
with proper error messaging and accessibility support.

Closes #42"
```

**PR Creation with Issue Context:**
```bash
gh pr create \
  --title "feat(auth): implement user authentication system" \
  --body "Complete implementation of user authentication.

Closes #42
Closes #43
Closes #44

## Summary
- Login/logout functionality
- Session management
- Password reset flow

## Testing
- Unit tests for auth service
- Integration tests for login flow
- E2E tests for complete user journey"
```

### Automated Issue Management

```bash
# Add to .github/workflows/issue-management.yml
name: Issue Management

on:
  issues:
    types: [opened, labeled]
  pull_request:
    types: [opened, closed]

jobs:
  auto-label:
    runs-on: ubuntu-latest
    steps:
      - name: Auto-label based on title
        if: github.event.action == 'opened'
        run: |
          if [[ "${{ github.event.issue.title }}" == *"[BUG]"* ]]; then
            gh issue edit ${{ github.event.issue.number }} --add-label "bug"
          elif [[ "${{ github.event.issue.title }}" == *"[FEATURE]"* ]]; then
            gh issue edit ${{ github.event.issue.number }} --add-label "feature"
          fi
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## AI Collaboration Patterns

### Requesting AI Help with Issues

When asking AI to work with issues, use these patterns:

```bash
# "List all open bugs"
gh issue list --label "bug" --state open

# "Create an issue for adding dark mode"
gh issue create \
  --title "[FEATURE] Add dark mode support" \
  --body "Implement dark/light theme toggle with system preference detection" \
  --label "feature,ui,enhancement"

# "Show me the details of issue #42"
gh issue view 42 --comments

# "Close all issues labeled as duplicate"
gh issue list --label "duplicate" --json number --jq '.[].number' | xargs -I {} gh issue close {} --comment "Closed as duplicate"
```

### AI-Friendly Issue Descriptions

Structure issues so AI can easily understand and act on them:

```markdown
## AI Context
- This is a [frontend/backend/fullstack] issue
- Primary files to modify: [list specific files]
- Follow patterns from: [similar existing code]
- Use existing utilities: [list relevant utilities]

## Technical Constraints
- Must maintain TypeScript strict mode
- Follow repository-service-hooks pattern
- Include comprehensive error handling
- Add corresponding tests

## Success Criteria
- [ ] Functionality works as described
- [ ] Code follows project conventions
- [ ] Tests have good coverage
- [ ] Documentation is updated
```

This comprehensive GitHub Issues workflow integrates seamlessly with your existing development processes while providing powerful CLI-based project management capabilities.