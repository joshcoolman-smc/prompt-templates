# Ideas App - Product Requirements Document

## Overview
A local Next.js application that captures, organizes, and processes user ideas through a three-document system with AI-powered distillation and task extraction.

## Core Functionality

### Three-Document System
* **Transcript**: Verbatim chronological record of all user inputs
* **Ideas**: AI-distilled and organized concepts from user inputs  
* **Tasks**: Actionable items extracted from the ideas document

### User Interface
* Simple chat-style input interface with submit button
* Three-tab navigation: Ideas, Transcript, Tasks
* Clean markdown rendering for all document views
* Real-time updates with loading states during AI processing
* Input field auto-focus and keyboard shortcuts (Enter to submit)

### Processing Workflow
1. User enters text input and submits
2. Transcript document immediately updated with verbatim input and timestamp
3. Input + existing Ideas context sent to Anthropic API for idea distillation
4. Ideas document updated with organized, deduplicated concepts
5. Updated Ideas document sent to separate API call for task extraction  
6. Tasks document updated with abbreviated actionable items (3-7 words each)

## Technical Requirements

### Architecture
* Next.js 14+ application running locally (port 3000)
* File system-based markdown document storage in `/data` directory
* Anthropic API integration (Claude Sonnet) for AI processing
* No external database required
* Environment variable for Anthropic API key

### API Routes
* `POST /api/process-input` - Handles transcript update and triggers idea distillation
* `POST /api/extract-tasks` - Processes ideas document to generate tasks
* `GET /api/documents/[type]` - Retrieves specific document content
* File system operations for reading/writing markdown files

### Document Format & Storage
* All documents stored as markdown (.md) files in `/data` directory
* **Transcript**: `transcript.md` - Chronological with timestamps (`## [2024-01-15 14:30] \n User input here`)
* **Ideas**: `ideas.md` - Organized with headers and bullet points, AI-maintained structure
* **Tasks**: `tasks.md` - Abbreviated bullet points grouped by category/priority
* Automatic creation of `/data` directory and initial files if they don't exist

### Error Handling & Resilience
* API key validation and clear error messages
* Graceful handling of API failures (show error, preserve user input)
* File system error handling (permissions, disk space)
* Loading states and user feedback during processing

## Key Features
* Persistent local storage of all documents
* Sequential AI processing maintains document relationships
* Real-time UI updates during processing with progress indicators
* Simplified interface focused on rapid idea capture
* Keyboard-friendly interaction (Enter to submit, Tab navigation)
* No external dependencies beyond Anthropic API
* Privacy-first: all data stays local

## Success Criteria
* Seamless idea capture and organization (< 2 seconds from input to transcript update)
* Clear separation of raw input, distilled concepts, and actionable items
* Fast processing and UI updates (loading states < 10 seconds for AI calls)
* Reliable document persistence and retrieval
* Intuitive navigation between document views
* Robust error handling that doesn't lose user input

## Implementation Notes
* Use standard Next.js file-based routing
* Implement with React hooks for state management
* Use `fs/promises` for file operations
* Consider rate limiting for API calls
* Include basic CSS styling for clean, readable interface
