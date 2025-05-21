# Interactive Website Building Controller

This document outlines the implementation approach for an AI controller that manages the interactive website building process.

## Controller Overview

The controller manages the state of the website building process, tracks which phase the user is in, and provides the appropriate prompts and actions for each phase.

## Implementation Structure

### 1. Phase Management

```typescript
// Types for phase tracking
interface BuildPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  steps: BuildStep[];
  dependencies: string[]; // IDs of phases that must be completed first
}

interface BuildStep {
  id: string;
  name: string;
  type: 'question' | 'implementation' | 'review';
  status: 'pending' | 'in_progress' | 'completed';
  data?: any; // User responses or implementation details
}

// Main phases of website construction
const buildPhases: BuildPhase[] = [
  {
    id: 'structure',
    name: 'Project Structure',
    description: 'Establish folder organization and routing',
    status: 'pending',
    dependencies: [],
    steps: [
      { id: 'folder-structure', name: 'Folder Structure', type: 'question', status: 'pending' },
      { id: 'implement-structure', name: 'Implement Structure', type: 'implementation', status: 'pending' },
      { id: 'review-structure', name: 'Review Structure', type: 'review', status: 'pending' }
    ]
  },
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Create responsive site navigation',
    status: 'pending',
    dependencies: ['structure'],
    steps: [
      { id: 'nav-sections', name: 'Navigation Sections', type: 'question', status: 'pending' },
      { id: 'nav-dropdowns', name: 'Dropdown Menus', type: 'question', status: 'pending' },
      { id: 'implement-nav', name: 'Implement Navigation', type: 'implementation', status: 'pending' },
      { id: 'review-nav', name: 'Review Navigation', type: 'review', status: 'pending' }
    ]
  },
  // Additional phases for colors, typography, components, pages, etc.
]
```

### 2. State Management

```typescript
// Build state management
interface BuildState {
  phases: BuildPhase[];
  currentPhaseId: string | null;
  currentStepId: string | null;
  userResponses: Record<string, any>;
  implementationResults: Record<string, any>;
}

// Helper functions
function getCurrentPhase(state: BuildState): BuildPhase | null {
  if (!state.currentPhaseId) return null;
  return state.phases.find(phase => phase.id === state.currentPhaseId) || null;
}

function getCurrentStep(state: BuildState): BuildStep | null {
  const phase = getCurrentPhase(state);
  if (!phase || !state.currentStepId) return null;
  return phase.steps.find(step => step.id === state.currentStepId) || null;
}

function canStartPhase(state: BuildState, phaseId: string): boolean {
  const phase = state.phases.find(p => p.id === phaseId);
  if (!phase) return false;
  
  // Check if all dependencies are completed
  return phase.dependencies.every(depId => {
    const depPhase = state.phases.find(p => p.id === depId);
    return depPhase && depPhase.status === 'completed';
  });
}

function getNextPhase(state: BuildState): BuildPhase | null {
  // Find the first pending phase that has all dependencies completed
  return state.phases.find(phase => 
    phase.status === 'pending' && canStartPhase(state, phase.id)
  ) || null;
}

function getNextStep(state: BuildState): { phase: BuildPhase, step: BuildStep } | null {
  const phase = getCurrentPhase(state);
  if (!phase) return getNextPhase(state) ? { phase: getNextPhase(state)!, step: getNextPhase(state)!.steps[0] } : null;
  
  const currentStepIndex = phase.steps.findIndex(step => step.id === state.currentStepId);
  if (currentStepIndex < 0) return { phase, step: phase.steps[0] };
  
  // If there's a next step in the current phase
  if (currentStepIndex < phase.steps.length - 1) {
    return { phase, step: phase.steps[currentStepIndex + 1] };
  }
  
  // If we've completed the phase, move to the next phase
  const nextPhase = getNextPhase(state);
  return nextPhase ? { phase: nextPhase, step: nextPhase.steps[0] } : null;
}
```

### 3. Interaction Engine

```typescript
// Generates the appropriate prompts for the current step
function generatePrompt(state: BuildState): string {
  const { phase, step } = getNextStep(state) || {};
  if (!phase || !step) return "All phases are complete! Your website is built.";
  
  switch (step.type) {
    case 'question':
      return generateQuestionPrompt(phase, step, state);
    case 'implementation':
      return generateImplementationPrompt(phase, step, state);
    case 'review':
      return generateReviewPrompt(phase, step, state);
    default:
      return "Something went wrong. Let's try again.";
  }
}

// Generate question prompts based on the phase and step
function generateQuestionPrompt(phase: BuildPhase, step: BuildStep, state: BuildState): string {
  switch (phase.id) {
    case 'structure':
      return "Let's establish your project structure. Do you have any specific feature modules you want to include?";
    
    case 'navigation':
      if (step.id === 'nav-sections') {
        return "What main sections should appear in your website navigation?";
      } else if (step.id === 'nav-dropdowns') {
        return "Would you like any dropdown menus in your navigation? If so, which sections should have dropdowns?";
      }
      break;
      
    case 'colors':
      return "What are your brand colors or color preferences for the website?";
      
    // Additional cases for other phases and steps
  }
  
  return "Please tell me more about your requirements for this phase.";
}

// Handle user input and update state
function handleUserInput(input: string, state: BuildState): BuildState {
  const { phase, step } = getNextStep(state) || {};
  if (!phase || !step) return state;
  
  const updatedState = { ...state };
  
  // Store user response
  updatedState.userResponses = { 
    ...updatedState.userResponses,
    [`${phase.id}-${step.id}`]: input 
  };
  
  // Update step status
  const updatedPhase = { ...phase };
  const stepIndex = updatedPhase.steps.findIndex(s => s.id === step.id);
  updatedPhase.steps[stepIndex] = { ...step, status: 'completed' };
  
  // Update phase in phases array
  const phaseIndex = updatedState.phases.findIndex(p => p.id === phase.id);
  updatedState.phases[phaseIndex] = updatedPhase;
  
  // Update current step/phase
  const next = getNextStep(updatedState);
  if (next) {
    updatedState.currentPhaseId = next.phase.id;
    updatedState.currentStepId = next.step.id;
    
    // Mark the next step and phase as in progress
    const nextPhaseIndex = updatedState.phases.findIndex(p => p.id === next.phase.id);
    const nextPhase = { ...updatedState.phases[nextPhaseIndex], status: 'in_progress' };
    const nextStepIndex = nextPhase.steps.findIndex(s => s.id === next.step.id);
    nextPhase.steps[nextStepIndex] = { ...nextPhase.steps[nextStepIndex], status: 'in_progress' };
    updatedState.phases[nextPhaseIndex] = nextPhase;
  }
  
  return updatedState;
}
```

### 4. Implementation Functions

```typescript
// Functions that implement different aspects of the website based on user responses

// Project structure implementation
function implementProjectStructure(state: BuildState) {
  // Use user responses to create folder structure
  const response = state.userResponses['structure-folder-structure'];
  // Implementation logic here...
  
  return {
    folderStructure: {
      // Generated folder structure
    },
    files: {
      // Created files
    }
  };
}

// Navigation implementation
function implementNavigation(state: BuildState) {
  const sections = state.userResponses['navigation-nav-sections'];
  const dropdowns = state.userResponses['navigation-nav-dropdowns'];
  
  // Implementation logic here...
  
  return {
    navComponent: "// Generated navigation component code",
    screenshots: ["url/to/screenshot"]
  };
}

// Color system implementation
function implementColorSystem(state: BuildState) {
  const colorPreferences = state.userResponses['colors-color-preferences'];
  
  // Implementation logic here...
  
  return {
    colorSystem: {
      primary: "#hexcode",
      secondary: "#hexcode",
      // Other color definitions
    },
    tailwindConfig: "// Updated Tailwind config",
    colorPreview: "url/to/color/preview"
  };
}

// Master implementation function
function implementCurrentStep(state: BuildState): BuildState {
  const { phase, step } = getNextStep(state) || {};
  if (!phase || !step || step.type !== 'implementation') return state;
  
  const updatedState = { ...state };
  let result;
  
  switch (phase.id) {
    case 'structure':
      result = implementProjectStructure(state);
      break;
    case 'navigation':
      result = implementNavigation(state);
      break;
    case 'colors':
      result = implementColorSystem(state);
      break;
    // Additional cases for other phases
  }
  
  // Store implementation result
  updatedState.implementationResults = {
    ...updatedState.implementationResults,
    [phase.id]: result
  };
  
  // Update step status
  const updatedPhase = { ...phase };
  const stepIndex = updatedPhase.steps.findIndex(s => s.id === step.id);
  updatedPhase.steps[stepIndex] = { ...step, status: 'completed' };
  
  // Update phase in phases array
  const phaseIndex = updatedState.phases.findIndex(p => p.id === phase.id);
  updatedState.phases[phaseIndex] = updatedPhase;
  
  // Move to next step
  const next = getNextStep(updatedState);
  if (next) {
    updatedState.currentPhaseId = next.phase.id;
    updatedState.currentStepId = next.step.id;
    
    // Mark the next step and phase as in progress
    const nextPhaseIndex = updatedState.phases.findIndex(p => p.id === next.phase.id);
    const nextPhase = { ...updatedState.phases[nextPhaseIndex], status: 'in_progress' };
    const nextStepIndex = nextPhase.steps.findIndex(s => s.id === next.step.id);
    nextPhase.steps[nextStepIndex] = { ...nextPhase.steps[nextStepIndex], status: 'in_progress' };
    updatedState.phases[nextPhaseIndex] = nextPhase;
  }
  
  return updatedState;
}
```

### 5. Review and Approval

```typescript
// Handle user approval or rejection of implementations
function handleReviewResponse(approved: boolean, feedback: string, state: BuildState): BuildState {
  const { phase, step } = getNextStep(state) || {};
  if (!phase || !step || step.type !== 'review') return state;
  
  const updatedState = { ...state };
  
  if (approved) {
    // Mark step as completed
    const updatedPhase = { ...phase };
    const stepIndex = updatedPhase.steps.findIndex(s => s.id === step.id);
    updatedPhase.steps[stepIndex] = { ...step, status: 'completed' };
    
    // Mark phase as completed if this was the last step
    if (stepIndex === updatedPhase.steps.length - 1) {
      updatedPhase.status = 'completed';
    }
    
    // Update phase in phases array
    const phaseIndex = updatedState.phases.findIndex(p => p.id === phase.id);
    updatedState.phases[phaseIndex] = updatedPhase;
    
    // Move to next step/phase
    const next = getNextStep(updatedState);
    if (next) {
      updatedState.currentPhaseId = next.phase.id;
      updatedState.currentStepId = next.step.id;
      
      // Mark the next phase/step as in progress
      const nextPhaseIndex = updatedState.phases.findIndex(p => p.id === next.phase.id);
      const nextPhase = { ...updatedState.phases[nextPhaseIndex], status: 'in_progress' };
      const nextStepIndex = nextPhase.steps.findIndex(s => s.id === next.step.id);
      nextPhase.steps[nextStepIndex] = { ...nextPhase.steps[nextStepIndex], status: 'in_progress' };
      updatedState.phases[nextPhaseIndex] = nextPhase;
    }
  } else {
    // Store feedback
    updatedState.userResponses = {
      ...updatedState.userResponses,
      [`${phase.id}-${step.id}-feedback`]: feedback
    };
    
    // Go back to implementation step
    const implementationStepId = phase.steps.find(s => s.type === 'implementation')?.id;
    if (implementationStepId) {
      updatedState.currentStepId = implementationStepId;
      
      // Reset implementation step status
      const updatedPhase = { ...phase };
      const stepIndex = updatedPhase.steps.findIndex(s => s.id === implementationStepId);
      updatedPhase.steps[stepIndex] = { ...updatedPhase.steps[stepIndex], status: 'in_progress' };
      
      // Update phase in phases array
      const phaseIndex = updatedState.phases.findIndex(p => p.id === phase.id);
      updatedState.phases[phaseIndex] = updatedPhase;
    }
  }
  
  return updatedState;
}
```

## Controller Usage Pattern

1. Initialize build state
2. Generate prompt for current phase/step
3. Process user input
4. If implementation step, perform implementation
5. If review step, process approval/rejection
6. Repeat until all phases are complete

## Integration with AI Workflow

The AI would:

1. Initialize the controller state
2. Maintain state throughout the conversation
3. Use the controller to determine what questions to ask
4. Implement components based on user responses
5. Show previews and request approval
6. Track progress through phases
7. Maintain consistency in implementations based on previous decisions

This structured approach ensures a systematic, interactive website building process with clear human approval checkpoints at each stage.