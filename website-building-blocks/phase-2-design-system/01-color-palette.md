# Color Palette Creation

## Overview
Establish a comprehensive color system for your website that includes primary, secondary, accent colors, and semantic colors for UI states. This foundation will ensure visual consistency across your entire site.

## Requirements

### Color System Requirements
- Define a complete color palette with:
  - Primary brand color with 9 shades (50-900)
  - Secondary color with 9 shades
  - 1-2 accent colors with appropriate shades
  - Grayscale range (50-900)
  - Semantic colors (success, warning, error, info)
- Colors must meet WCAG AA accessibility standards (4.5:1 for normal text, 3:1 for large text)
- Implementation in Tailwind CSS configuration
- Example components demonstrating color usage
- Color documentation page for reference
### Implementation Steps

#### 1. Define Color Strategy

Before selecting specific colors, determine your brand's color strategy:

- **Brand Personality**: What traits does your brand embody? (Professional, playful, luxurious, trustworthy, etc.)
- **Industry Context**: What colors are common or avoided in your industry?
- **Target Audience**: What colors will resonate with your target demographic?
- **Cultural Considerations**: Are there cultural meanings of colors to consider?

#### 2. Select Primary and Secondary Colors

Choose colors that:
- Reflect your brand identity
- Have sufficient contrast with white/black text
- Can be used in various UI contexts

Use tools like [Coolors](https://coolors.co/) or [Adobe Color](https://color.adobe.com/) to help select base colors.

#### 3. Generate Color Scales

For each base color (primary, secondary, accent), generate a full scale of 9 shades:

- 50: Very light (almost white) - for backgrounds
- 100-300: Light shades - for hover states, backgrounds
- 400-600: Medium shades - for borders, secondary text
- 700-900: Dark shades - for text, primary actions

Use [Tailwind Color Generator](https://uicolors.app/create) or similar tools to create consistent scales.
#### 4. Define Semantic Colors

Map semantic colors to your primary/secondary/accent scales or define new colors for:

- **Success**: Green tones (for confirmation, completion)
- **Warning**: Yellow/Orange tones (for caution, pending states)
- **Error**: Red tones (for errors, destructive actions)
- **Info**: Blue tones (for information, help)

#### 5. Configure Tailwind CSS

Update your tailwind.config.js file with your color palette:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color (example: blue)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Secondary color (example: purple)
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },        // Accent color (example: amber)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      }
    },
  },
  plugins: [],
}
```
#### 6. Create a Color Documentation Component

Create src/pages/DesignSystem/ColorPalette.tsx:

```tsx
function ColorSwatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex flex-col">
      <div
        className={`h-16 w-full rounded-t-md ${color}`}
        aria-hidden="true"
      ></div>
      <div className="bg-white p-2 rounded-b-md shadow">
        <div className="text-xs font-medium">{name}</div>
      </div>
    </div>
  );
}

function ColorRow({ title, colorKey }: { title: string; colorKey: string }) {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
        {shades.map((shade) => (
          <ColorSwatch 
            key={shade} 
            color={`bg-${colorKey}-${shade}`} 
            name={`${colorKey}-${shade}`} 
          />
        ))}
      </div>
    </div>
  );
}

export function ColorPalette() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Color Palette</h1>
      
      <ColorRow title="Primary Colors" colorKey="primary" />
      <ColorRow title="Secondary Colors" colorKey="secondary" />
      <ColorRow title="Accent Colors" colorKey="accent" />
      
      <h1 className="text-2xl font-bold mt-12 mb-6">Semantic Colors</h1>
      <ColorRow title="Success" colorKey="success" />
      <ColorRow title="Warning" colorKey="warning" />
      <ColorRow title="Error" colorKey="error" />
      <ColorRow title="Info" colorKey="info" />
    </div>
  );
}
```

#### 7. Add Route for Color Palette

Update your App.tsx to include a route to your color palette:

```tsx
// In your App.tsx or router configuration
<Route path="design-system/colors" element={<ColorPalette />} />
```

#### 8. Create Utility Functions for Color Usage

Create src/utils/colors.ts for programmatic color manipulation:

```typescript
/**
 * Get the appropriate text color (black or white) based on background
 * Uses WCAG contrast guidelines
 */
export function getContrastText(hexColor: string): 'text-white' | 'text-black' {
  // Remove # if present
  const hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
  
  // Convert to RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance < 128 ? 'text-white' : 'text-black';
}
```

### Expected Output

1. A complete color system defined in Tailwind CSS
2. A color documentation page showing all colors with their codes
3. Examples of color application in UI components
4. Utility functions for color manipulation
### Important Considerations

- **Consistency**: Use colors consistently across your site (e.g., primary-600 always for primary buttons)
- **Accessibility**: Test your color combinations for sufficient contrast
- **Flexibility**: Your color system should accommodate both light and dark modes
- **Documentation**: Keep your color palette documentation updated as your design evolves

### Tools and Resources

- [Coolors.co](https://coolors.co/) - Color palette generation
- [TailwindCSS Color Generator](https://uicolors.app/create) - Generate Tailwind color scales
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Test color contrast for accessibility
- [ColorBox by Lyft](https://www.colorbox.io/) - Advanced color scale generator
- [Leonardo.ai](https://leonardocolor.io/) - Accessible color palette generator
- [Color Review](https://color.review/) - Test color combinations for different visual impairments

### Next Steps

After establishing your color system:

1. Set up typography to complement your color choices
2. Create a spacing system for consistent layout
3. Implement base UI components that leverage your color system
4. Create a dark mode variation of your color palette