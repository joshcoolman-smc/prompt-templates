# Clean Architecture Principles

A framework-agnostic conceptual framework for organizing applications with clear boundaries, separation of concerns, and maintainable structure.

While these principles apply to any TypeScript application, examples reference React and Next.js patterns where relevant.

## Core Philosophy

**Organize by feature domain, not technical categories.** Everything related to a business capability lives together. Users don't think in terms of "all the hooks" or "all the services" - they think in terms of features and workflows.

**Define contracts through interfaces, fulfill them through implementations.** The what is separate from the how. This separation creates flexibility and clarity.

**Dependencies flow inward toward business logic.** UI components depend on services, services depend on repositories. Never the reverse. Data access and frameworks are details, not the core.

**The repository-service-hooks pattern is framework-agnostic.** While terminology may vary (hooks in React, composables in Vue, stores in other frameworks), the three-layer separation of data access, business logic, and UI integration applies universally.

## Feature Module Pattern

### Co-location of Related Concerns

Each feature is a self-contained module with its own layers. A feature about user profiles contains everything needed for user profiles - the UI components, the business logic, the data access, the types. Nothing is scattered across a global "services" or "repositories" folder.

This is the fundamental organizing principle: **organize by what the feature does, not by what technical category files belong to.**

### Feature Module Structure

A complete feature module contains:

**Components:** UI elements specific to this feature, grouped together with the feature logic they depend on.

**Repositories:** Data access interfaces and implementations for this feature's data needs.

**Services:** Business logic and orchestration specific to this feature's domain.

**Hooks (or equivalent):** Integration layer between UI framework and business logic, specific to this feature.

**Types:** TypeScript definitions for this feature's domain models.

### Benefits of Feature Modules

**Cognitive locality:** Everything related to a capability is in one place. Understanding or modifying a feature doesn't require hunting through multiple directories.

**Encapsulation:** Features expose only what's needed. Internal implementation details stay internal.

**Independent evolution:** Features can be modified, refactored, or even removed without affecting unrelated parts of the system.

**Team scalability:** Different teams can own different features with minimal coordination overhead.

### Inter-Feature Dependencies

Features can depend on other features when needed, but these dependencies should be explicit and intentional. A shopping cart feature might depend on a product catalog feature. An order management feature might depend on both.

Keep dependencies unidirectional where possible. Circular dependencies between features indicate a need to refactor or extract shared concerns.

## Three-Layer Pattern

### Repository Layer: Data Access Boundary

The repository layer represents the boundary between your application and external data sources. It answers the question: where does data come from and where does it go?

**Responsibilities:**
- Encapsulate how data is fetched, stored, and retrieved
- Translate between external data formats and internal domain models
- Handle data source specifics (API endpoints, database queries, caching)
- Provide a clean, stable interface regardless of underlying implementation

**What it does NOT do:**
- Business logic or validation
- Data transformation for business purposes
- Orchestration of multiple data sources
- React state management

The repository knows about APIs, databases, and HTTP clients. It does not know about business rules or React components.

### Service Layer: Business Logic Core

The service layer embodies the business logic and rules of your application. It answers the question: what are the capabilities and rules of this domain?

**Responsibilities:**
- Implement business rules and workflows
- Coordinate multiple repositories when needed
- Transform and combine data according to business requirements
- Enforce business constraints and validation
- Represent use cases and domain operations

**What it does NOT do:**
- Know about React, hooks, or UI state
- Directly access external APIs or databases
- Handle HTTP requests or responses
- Manage component lifecycle

The service knows about your business domain. It knows that promoting a user to admin requires checking their activity score, or that generating a report requires combining data from multiple sources. It does not know about React or fetch.

### Hooks Layer: UI Framework Integration Boundary

The hooks layer (or equivalent integration layer in other frameworks) bridges the gap between UI components and your business logic. It answers the question: how do UI components interact with the application logic?

**Responsibilities:**
- Manage framework-specific state (loading, errors, local UI state)
- Trigger service operations in response to component lifecycle
- Provide a clean, consistent interface for components
- Handle asynchronous operations and side effects
- Coordinate multiple service calls when needed for UI purposes

**What it does NOT do:**
- Contain business logic
- Directly call repositories
- Implement business rules
- Transform data for business purposes

In React, this layer uses hooks (useState, useEffect) and component lifecycle. In other frameworks, it might be composables (Vue), signals (Solid), or stores (Svelte). The pattern is the same: isolate framework concerns from business logic.

## Interface-Driven Design

### The Contract Pattern

An interface is a contract. It defines capabilities without specifying implementation. This separation is powerful.

**Why interfaces matter:**

**Flexibility:** Swap a real API for a mock without changing any consuming code. Switch from REST to GraphQL by changing one implementation. Replace a database without touching business logic.

**Testability:** Create simple test implementations that return predictable data. No need for complex mocking frameworks or brittle test setups.

**Clarity:** The interface documents exactly what operations are available and what they require. It's living documentation that the compiler enforces.

**Decoupling:** Components depend on abstractions, not concrete implementations. Change the how without changing the what.

### When to Use Interfaces

**Always for repositories:** Data access is the most volatile part of applications. APIs change, services get replaced, data sources migrate. Interface-based repositories make this manageable.

**Frequently for services:** When business logic might vary, when testing is important, when you want clear contracts between layers.

**Rarely for utilities:** Pure functions don't need interfaces. Simple helpers that take input and return output can stay concrete.

**Never just for ceremony:** Don't create interfaces because "that's what clean architecture does." Create them when they provide value.

## Dependency Injection

### The Service Container Pattern

Dependencies should be explicit. A service needs a repository? Pass it in. A hook needs a service? Pass it in. Don't reach out to global singletons from deep inside functions.

A service container is a centralized place where you wire up these dependencies. It's where you decide which implementations to use and how they connect.

**Benefits of explicit dependencies:**

**Testability:** Pass in test implementations instead of production ones. No global state to manage or reset.

**Clarity:** Looking at a constructor or function signature tells you exactly what it needs. No hidden dependencies.

**Flexibility:** Want to use different implementations in different contexts? Just pass in different dependencies.

**Single responsibility:** Each piece does its job and receives what it needs from outside.

### Dependency Flow

Dependencies flow in one direction: from outer layers toward inner layers. UI components depend on hooks. Hooks depend on services. Services depend on repositories.

Never does a repository import a service. Never does a service import a hook. The dependency arrow points toward business logic, not away from it.

## TypeScript Integration

### Type Safety Philosophy

TypeScript types are your compile-time safety net. They catch errors before runtime and document structure.

**Interface definitions for data structures:** Define what a User is, what a Product is, what a Transaction is. These are your domain models.

**Input and output types:** Separate types for creating resources, updating them, and reading them. A CreateUserInput doesn't have an ID. An UpdateUserInput has all optional fields.

**Discriminated unions for states:** Loading, success with data, or error. Not three separate booleans that could be in impossible combinations.

### Runtime Validation

TypeScript disappears at runtime. External data (API responses, user input) needs runtime validation.

Use a validation library (like Zod) at boundaries - where data enters your system. Validate API responses. Validate form inputs. Validate environment variables.

Once data is validated and typed, trust the types. Don't validate again deep in your application.

## Component Patterns

### Container and Display Pattern

When building UI, separate orchestration from presentation. This pattern applies regardless of framework, though specific implementations vary.

**Container Component (Orchestrator):** Handles the setup work - authentication, data fetching, authorization, routing logic. In server-rendered frameworks, this runs on the server. In client frameworks, this coordinates data loading and routing.

**Display Component (Presentation):** Receives data and renders the interactive UI. Contains local state for interaction, event handlers, and visual logic.

### Why This Separation Matters

**Performance:** Orchestration work happens server-side (when possible), reducing client bundle size and improving initial load.

**Security:** Authentication and sensitive operations stay on the server, not in client JavaScript.

**Clarity:** Each component has a single, clear responsibility. The container sets up, the display presents.

**Testing:** Display components are pure functions of props - easy to test. Container logic can be tested separately.

### Framework-Specific Applications

**Next.js:** Page routes (always server components) act as containers. They fetch data, check auth, and pass to client components (displays) for interactivity.

**Traditional React (Vite, CRA):** Top-level route components act as containers. They use hooks to fetch data and check auth, then pass to presentation components.

**Other frameworks:** The pattern adapts but the principle remains - separate data orchestration from UI presentation.

### The Critical Principle

In server-rendering frameworks: **Page/route components must remain server-side.** Never add client-side directives to routes. Instead, routes pass data to client components for interactivity.

This maintains the performance and security benefits of server rendering while enabling rich client-side experiences.

## Error Handling Philosophy

### Errors as Domain Concepts

Different errors mean different things. A validation error is not the same as a network error. A "not found" error is not the same as an "unauthorized" error.

Create specific error types that represent domain concepts. This makes error handling clearer and enables proper recovery strategies.

### Error Boundaries

Errors should be caught at appropriate boundaries. Repositories catch and translate data access errors. Services catch and wrap business logic errors. Hooks catch and expose errors as state for UI.

Don't let errors silently disappear. Don't let them bubble up unhandled. Catch them where they can be properly contextualized and handled.

## Performance Considerations

### Lazy Loading

Load code when needed, not all upfront. Feature modules can be loaded on demand. Heavy components can be loaded when they're about to render.

### Memoization and Caching

Expensive operations should be cached when appropriate. Service operations that don't change frequently can be memoized. Data that's fetched often can be cached with appropriate invalidation.

Balance freshness with performance. Not everything needs to be real-time. Not everything should be cached forever.

### Code Splitting

Features are natural split points. Large features can load their code independently. Shared code can be extracted to common chunks.

## Practical Decision Framework

### When Starting a Feature

Ask these questions:

**Does this feature need to fetch or persist data?** If yes, create a repository with an interface.

**Is there business logic beyond simple CRUD?** If yes, create a service layer. If no, components can use repositories through hooks directly.

**Will multiple components need this logic?** If yes, create a custom hook. If no, inline state management might be sufficient.

**Are there multiple ways this might be implemented?** If yes, use an interface. If no, a concrete implementation might be enough.

### When Refactoring

Look for these patterns:

**Components with business logic:** Extract to service layer.

**Repeated data fetching patterns:** Extract to repository.

**Duplicated state management:** Extract to custom hook.

**Hardcoded dependencies:** Introduce dependency injection.

**Mixed concerns:** Separate into appropriate layers.

### When to Add Complexity

Add layers and patterns when they solve real problems, not hypothetical ones.

Start simple. Add structure when simplicity becomes messy. Add interfaces when you need flexibility. Add services when business logic appears.

Don't build for imaginary future requirements. Build for clarity and the problems you have now.

## Key Principles Summary

**Feature-based organization** keeps related code together and makes features easy to understand and modify.

**Interface-based design** creates flexibility and testability without coupling to specific implementations.

**Layered architecture** separates concerns - data access, business logic, and UI integration each have their place.

**Dependency injection** makes dependencies explicit and code easier to test and modify.

**Type safety with runtime validation** catches errors early and validates external data.

**Container-display component separation** keeps orchestration separate from presentation, enabling better performance and security.

**Pragmatic complexity** adds structure when needed, stays simple when possible.

**Framework-agnostic principles** that adapt to specific framework conventions while maintaining core architectural patterns.

This architecture provides a foundation for building maintainable applications that can grow and evolve without becoming tangled and unmaintainable.
