## Documentation Guidelines

### Project README Standards

#### Root README.md
- **Must be updated** when features are created or significantly modified.
- Should accurately reflect the current state of the application.
- Include the following sections:
  - **Project Overview**: A concise description of what the application does
  - **Core Features**: Brief bullet points of main functionality
  - **Tech Stack**: List of primary technologies used
  - **Getting Started**: Installation and setup instructions
  - **Environment Variables**: Required configuration parameters
  - **Development Workflow**: How to run, test, and build the project
  - **Deployment**: Brief deployment instructions
  - **Project Structure**: High-level overview of the codebase organization

#### Example Root README.md Structure:
```markdown
# Project Name

## Overview
A brief description of what this application does and its purpose.

## Core Features
- Feature 1: Brief description
- Feature 2: Brief description
- Feature 3: Brief description

## Tech Stack
- [Frontend Framework]
- [Language]
- [CSS Solution]
- [Other major libraries]

## Getting Started
[Installation instructions]

## Environment Variables
[Required variables]

## Development Workflow
[Development commands]

## Deployment
[Deployment instructions]

## Project Structure
[Brief overview of code organization]
```

### Feature README Standards

#### Feature-Level README.md
Each feature folder should contain its own README.md that provides:

- **Purpose**: What problem this feature solves
- **Functionality**: How the feature works and its capabilities
- **Architecture**: Structure of the feature's components and data flow
- **Key Components**: Description of major components and their roles
- **Integration Points**: How this feature connects with other parts of the application
- **Testing**: Specific testing considerations for this feature
- **Future Improvements**: Planned enhancements (if applicable)

#### Example Feature README.md Structure:
```markdown
# Feature Name

## Purpose
Explains what problem this feature solves and its importance to the application.

## Functionality
Describes what this feature does and how it works from both user and technical perspectives.

## Architecture
Explains the structure of this feature:
- Data flow
- State management approach
- API interactions

## Key Components
- `ComponentA`: Handles XYZ functionality
- `ComponentB`: Manages ABC state
- `ServiceA`: Provides data processing for DEF

## Integration Points
- Connects with Feature X via [state management approach]
- Consumes data from API endpoints A, B, C
- Triggers application-wide events for X, Y, Z

## Future Improvements
- Planned enhancements
- Known limitations
```

### Documentation Best Practices

1. **Keep Documentation Updated**: Update relevant README files alongside code changes - this is not optional.

2. **Write for New Developers**: Assume the reader is new to the project but technically competent.

3. **Be Concise but Complete**: Provide enough detail to be useful without overwhelming with information.

4. **Use Formatting Effectively**:
   - Use headers, lists, and code blocks to improve readability
   - Bold important information
   - Include diagrams when complexity warrants it

5. **Include Examples**: Where appropriate, include code snippets or usage examples.

6. **Document API and Data Structures**: Include information about data models and API endpoints related to the feature.

7. **Link to Related Resources**: Reference related documentation, design files, or requirements.

8. **Version History**: For significant features, maintain a brief version history noting major changes.
