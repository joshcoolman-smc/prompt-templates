# PRD: React Flip Clock Component
image reference for design: https://fliqlo.com/images/main.png

**Version:** 1.0
**Date:** October 26, 2023
**Author:** User & AI

## 1. Introduction & Overview

This document outlines the requirements for creating a React component that replicates the visual design and core functionality of the digital flip clock screensaver found at Fliqslo.com. The primary goal is to develop a visually faithful and responsive clock component that can be easily integrated into a Next.js website. It will display the current local time based on the user's browser, without any user-configurable settings.

## 2. Goals & Objectives

*   **Goal 1:** Develop a React component that accurately displays the current time (hours and minutes).
*   **Goal 2:** Replicate the distinct visual aesthetic and "flip" animation of the Fliqslo clock.
*   **Goal 3:** Ensure the component is responsive, adjusting its size gracefully to fit various container dimensions (from a small dashboard widget to full-screen).
*   **Goal 4:** Create a self-contained and easy-to-integrate component for Next.js applications.
*   **Goal 5:** The clock must derive its time from the client's browser.

## 3. Target Audience (for the component)

Website visitors who will view this clock as a design element, either full-screen or as part of a larger interface like a dashboard.

## 4. Functional Requirements

### FR1: Time Display
*   **Requirement:** The component MUST display the current time.
*   **Priority:** Must

### FR1.1: Hours Display
*   **Requirement:** Hours MUST be displayed as two digits (e.g., "09", "13").
*   **Priority:** Must

### FR1.2: Minutes Display
*   **Requirement:** Minutes MUST be displayed as two digits (e.g., "05", "59").
*   **Priority:** Must

### FR1.3: Colon Separator
*   **Requirement:** A colon (":") MUST be displayed between the hours and minutes units.
*   **Priority:** Must

### FR2: Local Time Sourcing
*   **Requirement:** The time displayed MUST be the user's current local time, obtained from their browser environment (e.g., `new Date()`).
*   **Priority:** Must

### FR3: Automatic Time Updates
*   **Requirement:** The displayed minutes MUST update automatically when the local minute changes. The displayed hours MUST update automatically when the local hour changes.
*   **Priority:** Must

### FR3.1: Colon Blinking
*   **Requirement:** The colon separator SHOULD blink at a regular interval (e.g., once per second, toggling visibility).
*   **Priority:** Must

### FR4: Digit Flip Animation
*   **Requirement:** When a digit in the hours or minutes display changes, it MUST animate using a "flip" effect.
*   **Priority:** Must

### FR4.1: Animation Mechanics
*   **Requirement:** The top half of the card representing the old digit should appear to flip downwards, revealing the top half of the new digit. The bottom half of the new digit should be revealed underneath.
*   **Priority:** Must

### FR5: Responsiveness
*   **Requirement:** The component's size (including digits, spacing, and font) MUST adapt proportionally to the dimensions of its parent container. It should look good in small containers and when full-screen.
*   **Priority:** Must

### FR6: No User Configuration
*   **Requirement:** The component MUST NOT provide any UI for end-user settings (e.g., theme changes, 12/24 hour format toggle, time zone adjustments). It should operate with a fixed design.
*   **Priority:** Must

## 5. Design & UI/UX Requirements

### UI1: Visual Parity with Fliqslo.com
*   **Requirement:** The overall aesthetic SHOULD be a very close visual match to [fliqslo.com](https://fliqlo.com/).
*   **Priority:** Must

### UI1.1: Background Color
*   **Requirement:** Dark, near-black background for the clock area (e.g., `#111111`).
*   **Priority:** Must

### UI1.2: Digit "Card" Color
*   **Requirement:** Background of the digit cards should be a dark grey (e.g., `#282828`).
*   **Priority:** Must

### UI1.3: Digit Text Color
*   **Requirement:** Digits and colon should be a light, off-white color (e.g., `#f0f0f0`).
*   **Priority:** Must

### UI2: Typography
*   **Requirement:** Font choices should contribute to the Fliqslo aesthetic.
*   **Priority:** Must

### UI2.1: Font Family
*   **Requirement:** Use a clean, bold, sans-serif font similar to Fliqslo (e.g., "Helvetica Neue", Helvetica, Arial).
*   **Priority:** Must

### UI2.2: Font Weight
*   **Requirement:** Font weight should be bold.
*   **Priority:** Must

### UI3: Digit Structure
*   **Requirement:** Each digit (0-9) should appear as if on a split-flap panel. A subtle horizontal line should visually separate the top and bottom halves of static digit cards.
*   **Priority:** Must

### UI4: Flip Animation Style
*   **Requirement:** The animation must be visually representative of a physical flip.
*   **Priority:** Must

### UI4.1: 3D Perspective
*   **Requirement:** The flip animation MUST have a subtle 3D perspective effect, making the card appear to rotate in 3D space.
*   **Priority:** Must

### UI4.2: Animation Smoothness & Timing
*   **Requirement:** Animation MUST be smooth. An `ease-in-out` timing function is recommended. Duration should be noticeable but quick (e.g., 600ms).
*   **Priority:** Must

### UI5: Layout & Spacing
*   **Requirement:** Digits within a unit (e.g., the two digits for hours) should be closely spaced. The separator should have appropriate spacing around it. The overall clock should be centered within its container if the container is larger than the clock's natural size.
*   **Priority:** Must

## 6. Technical Requirements & Specifications

### TR1: Framework
*   **Requirement:** The component MUST be built using React.
*   **Priority:** Must

### TR2: Next.js Compatibility
*   **Requirement:** The component MUST be easily integrable into a Next.js application (e.g., placed in the `components` directory and imported into pages).
*   **Priority:** Must

### TR3: Styling
*   **Requirement:** CSS Modules (`.module.css`) MUST be used for styling to ensure style encapsulation and prevent global namespace conflicts.
*   **Priority:** Must

### TR4: Component Structure (Suggested)
*   **Requirement:** A modular component structure is preferred.
*   **Priority:** Should
*   **Details:**
    *   `FlipClock.tsx`: Main parent component. Manages time state, renders `FlipUnit`s.
    *   `FlipUnit.tsx`: Renders a two-digit unit (e.g., hours), composed of two `SingleDigitFlip`s.
    *   `SingleDigitFlip.tsx`: Renders a single animated digit.

### TR5: State Management
*   **Requirement:** State should be managed appropriately within components.
*   **Priority:** Must
*   **Details:**
    *   Time state (current hours, minutes) managed within `FlipClock.tsx`.
    *   Animation-specific state (e.g., `currentDigit`, `previousDigit`, `isFlipping`) managed locally within `SingleDigitFlip.tsx`.

### TR6: Animation Implementation
*   **Requirement:** CSS Keyframes and 3D transforms (`perspective`, `rotateX`) SHOULD be used for the flip animation for performance and visual effect.
*   **Priority:** Must

### TR7: Responsiveness Implementation
*   **Requirement:** The component must be responsive using scalable units.
*   **Priority:** Must
*   **Details:**
    *   Use `em` units for internal sizing of digit elements, relative to a base `font-size`.
    *   The base `font-size` of the clock container SHOULD be responsive (e.g., using CSS `clamp()` or viewport units like `vw`).
    *   The component itself SHOULD fill `100%` width and `100%` height of its immediate parent.

### TR8: Props (Developer-Facing)
*   **Requirement:** Props should be minimal for core functionality but allow for animation configuration if necessary.
*   **Priority:** Should
*   **Details:** The `SingleDigitFlip` component MAY accept an `animationDuration` prop (e.g., in milliseconds) with a sensible default. The main `FlipClock` component itself will not require external props from the page using it.

## 7. Non-Functional Requirements

### NFR1: Performance
*   **Requirement:** The animation MUST be smooth and CPU-efficient, avoiding jank or significant performance overhead.
*   **Priority:** Must

### NFR2: Maintainability
*   **Requirement:** Code should be well-structured, clearly written, and include comments where necessary to explain complex logic, especially in animation.
*   **Priority:** Should

### NFR3: Accessibility (Basic)
*   **Requirement:** Ensure sufficient color contrast between digit text and card backgrounds as per WCAG AA guidelines.
*   **Priority:** Should

## 8. Out of Scope

*   Display of seconds as flipping digits (though the colon blink implies second-level updates, actual flipping second digits are not required).
*   User-configurable settings (themes, 12/24 hour format, timezones, alarms, sound).
*   Date display.
*   Touch/mouse interaction.
*   Server-Side Rendering (SSR) of the *exact* initial time (the clock will initialize to the current browser time on client-side mount).

## 9. Future Considerations (Optional)

*   Option to display seconds with flip animation.
*   Theming capabilities (developer-configurable).
*   12-hour format option (developer-configurable).