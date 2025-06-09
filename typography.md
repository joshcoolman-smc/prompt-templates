Use next/font
Headings : IBM Plex Sans (all weights and include italics)
Subheadings / body : IBM Plex Serif (all weights and include italics)

Create a comprehensive typography showcase webpage demonstrating a 4pt grid system using Tailwind CSS with a dark zinc color palette. Build this as a single HTML file with embedded Tailwind CSS.

### **Requirements:**

#### **1. Technical Setup**
- Single HTML file with Tailwind CSS via CDN
- Dark-first design using zinc color palette (zinc-50 to zinc-950)
- 4pt grid system for all spacing (multiples of 4px: 4, 8, 12, 16, 20, 24, 32, etc.)
- Responsive design that works on mobile and desktop
- Optional: Visual 4px grid overlay toggle

#### **2. Color System (Zinc Palette)**
```
Background Layers:
- Base: zinc-950 (darkest background)
- Cards: zinc-900 (elevated surfaces)  
- Interactive: zinc-800 (buttons, inputs)
- Borders: zinc-700, zinc-600

Text Hierarchy:
- Primary headings: zinc-50 (brightest)
- Secondary text: zinc-100, zinc-200
- Body text: zinc-200, zinc-300
- Muted text: zinc-400, zinc-500
- Subtle/disabled: zinc-600
```

#### **3. Typography Scale (4pt Grid Aligned)**
```
Font Sizes with Line Heights:
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
```

#### **4. Spacing System**
All margins, padding, and gaps must use 4px increments:
- space-y-1 (4px), space-y-2 (8px), space-y-3 (12px)
- space-y-4 (16px), space-y-5 (20px), space-y-6 (24px)  
- space-y-8 (32px), space-y-10 (40px), space-y-12 (48px)
- p-4 (16px), p-6 (24px), p-8 (32px) for padding
- mb-4 (16px), mb-6 (24px), mb-8 (32px) for margins

### **5. Content Sections to Include:**
#### **C. Typography Scale Showcase**
- All heading levels (H1-H6) with proper zinc colors
- Body text examples in different sizes
- Code snippets showing the exact Tailwind classes used
- Visual indicators showing 4pt grid alignment

#### **D. Real Content Example** 
- Full article layout with:
  - Article title (text-4xl, zinc-50)
  - Subtitle/lead (text-xl, zinc-300)  
  - Meta information (text-sm, zinc-500)
  - Body paragraphs (text-base, zinc-200)
  - Section headings (text-2xl, zinc-100)
  - Blockquote with zinc-500 border
  - Bulleted list with proper spacing
  - Call-out box with zinc-800 background

#### **E. UI Component Examples**
1. **Card Component:**
   - zinc-900 background with zinc-800 border
   - Card title (text-lg, zinc-100)
   - Card content (text-base, zinc-300)
   - Button with zinc-700 background
   - 4pt grid spacing throughout (p-6, space-y-4)

2. **Form Component:**
   - Form labels (text-sm, zinc-300)
   - Input fields with zinc-900 background, zinc-600 borders
   - Helper text (text-xs, zinc-500)
   - Submit button (zinc-700 background, hover:zinc-600)
   - Proper spacing using 4pt increments

3. **Navigation/Button Examples:**
   - Primary buttons: zinc-600 background
   - Secondary buttons: zinc-800 with zinc-600 border  
   - Hover states: zinc-500, zinc-700
   - Focus states with proper ring colors

### **8. Key Principles to Follow**
- **Contrast**: Ensure 4.5:1 ratio for body text, 3:1 for large text
- **Hierarchy**: Clear visual distinction between heading levels
- **Consistency**: All spacing uses 4px multiples
- **Readability**: Optimal line lengths (45-75 characters)
- **Accessibility**: Proper focus states and semantic HTML
- **Performance**: Single file, minimal external dependencies

### **9. Success Criteria**
- All elements visually align to a 4px grid
- Text hierarchy is immediately apparent
- Dark theme feels sophisticated, not harsh
- Code is clean and well-documented
- Examples are practical and reusable
- Typography feels consistent and professional

