# Typography Showcase with 4pt Grid System

Create a comprehensive typography showcase webpage demonstrating a 4pt grid system using Tailwind CSS with a dark zinc color palette. Build this as a single HTML file with embedded Tailwind CSS.

## Technical Requirements

Use a dark-first design with the zinc color palette (zinc-50 to zinc-950) where the background is zinc-950 and text uses a proper hierarchy from zinc-50 (brightest headings) down to zinc-500 (subtle text). Implement a 4pt grid system where all spacing uses multiples of 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px, etc.

Set up the typography scale with these font sizes and line heights aligned to the 4pt grid:
- text-xs: 12px / 16px line-height
- text-sm: 14px / 20px line-height  
- text-base: 16px / 24px line-height
- text-lg: 18px / 28px line-height
- text-xl: 20px / 28px line-height
- text-2xl: 24px / 32px line-height
- text-3xl: 30px / 36px line-height
- text-4xl: 36px / 40px line-height
- text-5xl: 48px / 52px line-height
- text-6xl: 60px / 64px line-height

## Color System Implementation

Use this zinc color hierarchy:
- Background: zinc-950 (darkest)
- Cards/surfaces: zinc-900 
- Interactive elements: zinc-800
- Borders: zinc-700, zinc-600
- Primary headings: zinc-50 (brightest)
- Secondary text: zinc-100, zinc-200
- Body text: zinc-200, zinc-300
- Muted text: zinc-400, zinc-500
- Subtle/disabled: zinc-600

## Content to Include

Create a header with a large title (text-5xl or text-6xl, zinc-50), subtitle (zinc-300), and tag badges showing "Dark First", "4pt Grid", "Zinc Palette".

Add a zinc color demonstration section with a visual grid showing all zinc colors from zinc-50 through zinc-950, including text examples at each color level and the corresponding Tailwind class names.

Include a typography scale showcase displaying all heading levels (H1-H6) with proper zinc colors, body text examples in different sizes, and code snippets showing the exact Tailwind classes used.

Create a real content example with a full article layout containing:
- Article title (text-4xl, zinc-50)
- Subtitle/lead paragraph (text-xl, zinc-300)  
- Meta information like publish date (text-sm, zinc-500)
- Body paragraphs (text-base, zinc-200) with proper 4pt spacing
- Section headings (text-2xl, zinc-100)
- A blockquote with zinc-500 left border
- A bulleted list with proper spacing
- A call-out box with zinc-800 background

## UI Components

Build practical examples including:

A card component with zinc-900 background, zinc-800 border, card title (text-lg, zinc-100), card content (text-base, zinc-300), and a button with zinc-700 background. Use 4pt grid spacing throughout (p-6, space-y-4).

A form component with form labels (text-sm, zinc-300), input fields with zinc-900 background and zinc-600 borders, helper text (text-xs, zinc-500), and a submit button (zinc-700 background, hover:zinc-600). Ensure proper spacing using 4pt increments.

Navigation and button examples showing primary buttons (zinc-600 background), secondary buttons (zinc-800 with zinc-600 border), proper hover states (zinc-500, zinc-700), and focus states with appropriate ring colors.

## Code Documentation

Include a Tailwind config snippet showing zinc color definitions, example HTML snippets for each component, class combination examples, and a best practices list. Add an optional toggle to show/hide a 4px grid overlay so users can see the alignment.

## Design Principles

Ensure 4.5:1 contrast ratio for body text and 3:1 for large text. Create clear visual distinction between heading levels. Make all spacing use 4px multiples. Optimize line lengths for readability (45-75 characters). Include proper focus states and semantic HTML for accessibility.

The final result should demonstrate professional typography where all elements visually align to a 4px grid, text hierarchy is immediately apparent, the dark theme feels sophisticated rather than harsh, code is clean and well-documented, examples are practical and reusable, and typography feels consistent and professional throughout.

Build this as a complete, working HTML file that showcases the 4pt grid typography system with zinc color palette, including comments explaining design decisions and class choices.