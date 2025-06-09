
HEADING FONT = Montserrat
SUBHEADING FONT = Lora
BODY FONT = Hind Madurai


Create a Next.js typography showcase page that demonstrates a 4pt grid system with customizable font pairings. Use the following configuration:

## Font Configuration
- **Heading Font**: [HEADING_FONT] (all weights | styles: normal, italic)
- **Subheading font**: [SUBHEADING FONT] (normal, bold, semibold wheights | styles: normal, italic)
- **Body Font**: [BODY_FONT] (normal, bold, semibold weights | styles: normal, italic)

## Requirements

### 1. Font Setup
Use \`next/font/google\` to import the specified fonts with CSS variables:
- Heading font variable: \`--font-heading\`
- Body font variable: \`--font-body\`

### 2. Tailwind Configuration
Update \`tailwind.config.ts\` to include custom font families:
\`\`\`typescript
fontFamily: {
  heading: ["var(--font-heading)", "sans-serif"],
  body: ["var(--font-body)", "serif"],
}
\`\`\`

### 3. Page Structure
Create a typography showcase page with the following sections:

#### Main Article Section
- Article container: \`bg-zinc-900/50 border border-zinc-800 rounded-xl p-8\`
- Header with:
  - H1: "The Future of Design Systems" (\`font-heading text-4xl font-bold\`)
  - Subtitle: "How consistent typography and spacing create better user experiences" (\`font-body text-xl italic\`)
  - Meta info: Date, read time, category (\`text-sm text-zinc-500\`)
- Content with:
  - H2: "The 4pt Grid System" (\`font-heading text-2xl font-semibold\`)
  - H3: "Key Benefits" (\`font-heading text-xl font-medium\`)
  - Body paragraphs (\`font-body text-base\` and \`font-body text-lg\`)
  - Blockquote with citation (\`font-body\`)
  - Bulleted list (\`font-body text-base\`)
  - Pro tip callout box

#### UI Component Examples
- Card component with workshop details
- Contact form with email and message fields
- Button examples (Primary, Secondary, Outline)

### 4. Typography Classes
Use these specific font classes throughout:
- \`font-heading\`: All headings (h1, h2, h3), labels, buttons
- \`font-body\`: All body text, paragraphs, form inputs, small text

### 5. Color Scheme
Use zinc color palette on dark background:
- Background: \`bg-zinc-950\`
- Text colors: \`text-zinc-200\`, \`text-zinc-300\`, \`text-zinc-400\`, \`text-zinc-500\`
- Component backgrounds: \`bg-zinc-900\`, \`bg-zinc-800\`, \`bg-zinc-950\`
- Borders: \`border-zinc-800\`, \`border-zinc-700\`, \`border-zinc-600\`

### 6. Spacing System
Follow 4pt grid system using Tailwind's spacing scale (multiples of 4px):
- Container padding: \`p-6\`, \`p-8\`
- Section spacing: \`space-y-4\`, \`space-y-6\`, \`space-y-8\`
- Component gaps: \`gap-3\`, \`gap-4\`, \`gap-6\`, \`gap-8\`

### 7. Responsive Design
- Max width container: \`max-w-4xl mx-auto\`
- Grid layouts: \`lg:grid-cols-2\`, \`sm:grid-cols-2 lg:grid-cols-3\`
- Responsive padding: \`px-6 py-8\`

### 8. Interactive Elements
- Hover states for buttons and form elements
- Focus states with ring utilities
- Transition animations: \`transition-colors duration-200\`

## Implementation Notes

### Font Loading Best Practices
1. Import fonts at the top of the page component
2. Apply font variables to the root container
3. Set fallback fonts in Tailwind config
4. Use \`display: 'swap'\` for better loading performance

### Accessibility Considerations
- Proper heading hierarchy (h1 → h2 → h3)
- Sufficient color contrast ratios
- Focus indicators for interactive elements
- Semantic HTML structure

### Performance Optimization
- Preload critical fonts
- Use font-display: swap
- Subset fonts to required characters if needed
