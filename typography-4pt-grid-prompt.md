# Typography Showcase with 4pt Grid System

Create a comprehensive typography showcase webpage demonstrating a 4pt grid system using Tailwind CSS with a dark zinc color palette. Build this as a single HTML file with embedded Tailwind CSS.

Use next/font with:
- Headings: IBM Plex Sans (all weights and include italics)
- Subheadings / body: IBM Plex Serif (all weights and include italics)

## Requirements

### Technical Setup
- Single HTML file with Tailwind CSS via CDN
- Dark-first design using zinc color palette
- 4pt grid system for all spacing (multiples of 4px: 4, 8, 12, 16, 20, 24, 32, etc.)
- Responsive design that works on mobile and desktop
- Optional: Visual 4px grid overlay toggle

### Color System
Use a zinc color palette with appropriate hierarchy for dark mode. Create distinct layers for backgrounds, cards, interactive elements, and borders. Establish clear text hierarchy from primary headings to subtle/disabled text using appropriate zinc color values.

### Typography Scale
Implement a typography scale aligned to the 4pt grid with font sizes ranging from text-xs to text-6xl. Ensure all line heights are multiples of 4px to maintain vertical rhythm. Use the IBM Plex Sans for headings and IBM Plex Serif for body content.

### Spacing System
All margins, padding, and gaps must use 4px increments. Apply consistent spacing patterns throughout the design using Tailwind's spacing utilities that align with the 4pt grid system.

## Content Sections to Include

### Typography Scale Showcase
Display all heading levels (H1-H6) with proper color hierarchy. Include body text examples in different sizes and code snippets showing the Tailwind classes used. Add visual indicators to demonstrate 4pt grid alignment.

### Real Content Example
Create a full article layout including:
- Article title and subtitle
- Meta information (date, reading time, etc.)
- Body paragraphs with proper spacing
- Section headings
- Blockquote with styled border
- Bulleted list with proper spacing
- Call-out box or highlighted content area

### UI Component Examples
Build practical component examples:

1. **Card Component**: Include title, content, and action button with proper spacing throughout

2. **Form Component**: Show form labels, input fields, helper text, and submit button with appropriate spacing

3. **Navigation/Button Examples**: Display primary buttons, secondary buttons, and demonstrate hover/focus states

## Key Principles to Follow
- **Contrast**: Ensure proper contrast ratios for accessibility (4.5:1 for body text, 3:1 for large text)
- **Hierarchy**: Create clear visual distinction between heading levels
- **Consistency**: All spacing uses 4px multiples
- **Readability**: Maintain optimal line lengths (45-75 characters)
- **Accessibility**: Include proper focus states and semantic HTML
- **Performance**: Keep as single file with minimal external dependencies

## Success Criteria
- All elements visually align to a 4px grid
- Text hierarchy is immediately apparent
- Dark theme feels sophisticated, not harsh
- Code is clean and well-documented
- Examples are practical and reusable
- Typography feels consistent and professional

Build this as a complete, working HTML file that demonstrates professional typography systems while giving practical examples that can be referenced for future projects.